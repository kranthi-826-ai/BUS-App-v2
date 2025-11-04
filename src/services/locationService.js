import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';
import { haversineDistance } from '../utils/helpers';

class LocationService {
  constructor() {
    this.watchId = null;
    this.subscribers = new Set();
    this.currentLocation = null;
    this.locationUpdatesEnabled = false;
  }

  // Request location permissions
  async requestPermissions() {
    try {
      console.log('Requesting location permissions...');
      
      let { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }

      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to track buses and provide accurate arrival times.',
          [
            { 
              text: 'Cancel', 
              style: 'cancel' 
            },
            { 
              text: 'Open Settings', 
              onPress: () => Location.getForegroundPermissionsAsync()
            }
          ]
        );
        return false;
      }

      // Request background permissions for continuous tracking
      if (Platform.OS === 'ios') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          console.log('Background location permission not granted');
        }
      }

      console.log('Location permissions granted');
      return true;

    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  // Get current location once
  async getCurrentLocation() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });

      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
        speed: location.coords.speed,
        heading: location.coords.heading,
      };

      console.log('Current location:', this.currentLocation);
      return this.currentLocation;

    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  // Start watching location updates
  async startLocationUpdates() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      // Stop any existing watcher
      if (this.watchId) {
        this.stopLocationUpdates();
      }

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10, // Update every 10 meters
          timeInterval: 5000,   // Update every 5 seconds
        },
        (location) => {
          this.currentLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
            speed: location.coords.speed,
            heading: location.coords.heading,
          };

          // Notify all subscribers
          this.notifySubscribers(this.currentLocation);
        }
      );

      this.locationUpdatesEnabled = true;
      console.log('Location updates started');

    } catch (error) {
      console.error('Error starting location updates:', error);
      throw error;
    }
  }

  // Stop location updates
  stopLocationUpdates() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
    this.locationUpdatesEnabled = false;
    console.log('Location updates stopped');
  }

  // Subscribe to location updates
  subscribe(callback) {
    this.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers
  notifySubscribers(location) {
    this.subscribers.forEach(callback => {
      try {
        callback(location);
      } catch (error) {
        console.error('Error in location subscriber callback:', error);
      }
    });
  }

  // Calculate distance to bus stop
  calculateDistanceToStop(stopCoordinates) {
    if (!this.currentLocation || !stopCoordinates) {
      return null;
    }

    const distance = haversineDistance(
      this.currentLocation,
      stopCoordinates
    );

    return {
      distance: distance, // in kilometers
      distanceMeters: distance * 1000, // in meters
      walkingTime: this.calculateWalkingTime(distance), // in minutes
    };
  }

  // Calculate walking time based on distance
  calculateWalkingTime(distanceKm) {
    const averageWalkingSpeed = 5; // km/h
    const timeHours = distanceKm / averageWalkingSpeed;
    return Math.ceil(timeHours * 60); // Convert to minutes
  }

  // Check if user is near a bus stop
  isNearBusStop(stopCoordinates, radiusKm = 0.5) {
    const distanceInfo = this.calculateDistanceToStop(stopCoordinates);
    if (!distanceInfo) return false;

    return distanceInfo.distance <= radiusKm;
  }

  // Get address from coordinates (reverse geocoding)
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        return {
          street: address.street,
          city: address.city,
          region: address.region,
          country: address.country,
          postalCode: address.postalCode,
          name: address.name,
          formattedAddress: `${address.street}, ${address.city}, ${address.region}`,
        };
      }

      return null;

    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // Get coordinates from address (forward geocoding)
  async getCoordinatesFromAddress(address) {
    try {
      const coordinates = await Location.geocodeAsync(address);
      
      if (coordinates.length > 0) {
        return {
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
        };
      }

      return null;

    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Calculate ETA based on current location and destination
  calculateETA(destinationCoordinates, averageSpeedKmH = 30) {
    if (!this.currentLocation || !destinationCoordinates) {
      return null;
    }

    const distance = haversineDistance(this.currentLocation, destinationCoordinates);
    const timeHours = distance / averageSpeedKmH;
    const timeMinutes = Math.ceil(timeHours * 60);

    return {
      minutes: timeMinutes,
      arrivalTime: new Date(Date.now() + timeMinutes * 60000),
      distance: distance,
    };
  }

  // Check if location services are enabled
  async checkLocationServices() {
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      return servicesEnabled;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }

  // Get last known location
  async getLastKnownLocation() {
    try {
      const lastLocation = await Location.getLastKnownPositionAsync();
      if (lastLocation) {
        this.currentLocation = {
          latitude: lastLocation.coords.latitude,
          longitude: lastLocation.coords.longitude,
          accuracy: lastLocation.coords.accuracy,
          timestamp: lastLocation.timestamp,
        };
      }
      return this.currentLocation;
    } catch (error) {
      console.error('Error getting last known location:', error);
      return null;
    }
  }

  // Start background location tracking (for advanced features)
  async startBackgroundTracking() {
    if (Platform.OS === 'android') {
      // Android-specific background location setup
      await Location.startLocationUpdatesAsync('busTracking', {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 50, // Update every 50 meters
        timeInterval: 30000,  // Update every 30 seconds
        foregroundService: {
          notificationTitle: 'Bus Tracking Active',
          notificationBody: 'Tracking your bus location in the background',
        },
      });
    }
  }

  // Stop background tracking
  async stopBackgroundTracking() {
    if (Platform.OS === 'android') {
      await Location.stopLocationUpdatesAsync('busTracking');
    }
  }

  // Check if location is within geofence (virtual perimeter)
  isWithinGeofence(location, center, radiusKm) {
    const distance = haversineDistance(location, center);
    return distance <= radiusKm;
  }

  // Get bearing/direction between two points
  calculateBearing(start, end) {
    const startLat = this.deg2rad(start.latitude);
    const startLng = this.deg2rad(start.longitude);
    const endLat = this.deg2rad(end.latitude);
    const endLng = this.deg2rad(end.longitude);

    const dLng = endLng - startLng;

    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

    let bearing = Math.atan2(y, x);
    bearing = this.rad2deg(bearing);
    bearing = (bearing + 360) % 360;

    return bearing;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  rad2deg(rad) {
    return rad * (180 / Math.PI);
  }

  // Cleanup
  cleanup() {
    this.stopLocationUpdates();
    this.subscribers.clear();
  }
}

// Create singleton instance
const locationService = new LocationService();

export default locationService;