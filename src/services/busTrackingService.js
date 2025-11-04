import { useState, useEffect } from 'react';

// Mock bus data - Replace with real API endpoints
const MOCK_BUSES = {
  'BUS001': {
    id: '1',
    number: 'Bus 1',
    route: 'Kukatpally to Campus',
    code: 'BUS001',
    currentLocation: { latitude: 17.3850, longitude: 78.4867 },
    routeCoordinates: [
      { latitude: 17.3850, longitude: 78.4867 },
      { latitude: 17.4401, longitude: 78.3489 },
      { latitude: 17.4500, longitude: 78.3800 },
      { latitude: 17.4600, longitude: 78.4000 },
      { latitude: 17.4700, longitude: 78.4200 },
      { latitude: 17.4832, longitude: 78.4567 }
    ],
    stops: [
      { id: '1', name: 'Kukatpally Bus Depot', coordinates: { latitude: 17.3850, longitude: 78.4867 } },
      { id: '2', name: 'Miyapur Metro Station', coordinates: { latitude: 17.4401, longitude: 78.3489 } },
      { id: '3', name: 'Hitech City Junction', coordinates: { latitude: 17.4500, longitude: 78.3800 } },
      { id: '4', name: 'Madhapur Police Station', coordinates: { latitude: 17.4600, longitude: 78.4000 } },
      { id: '5', name: 'Gachibowli Circle', coordinates: { latitude: 17.4700, longitude: 78.4200 } },
      { id: '6', name: 'University Main Gate', coordinates: { latitude: 17.4832, longitude: 78.4567 } }
    ],
    speed: 40, // km/h
    status: 'moving',
    lastUpdated: new Date()
  },
  'BUS002': {
    id: '2',
    number: 'Bus 2',
    route: 'Ameerpet to Campus',
    code: 'BUS002',
    currentLocation: { latitude: 17.4375, longitude: 78.4484 },
    routeCoordinates: [
      { latitude: 17.4375, longitude: 78.4484 },
      { latitude: 17.4401, longitude: 78.3489 },
      { latitude: 17.4500, longitude: 78.3800 },
      { latitude: 17.4832, longitude: 78.4567 }
    ],
    stops: [
      { id: '1', name: 'Ameerpet Metro', coordinates: { latitude: 17.4375, longitude: 78.4484 } },
      { id: '2', name: 'SR Nagar', coordinates: { latitude: 17.4401, longitude: 78.3489 } },
      { id: '3', name: 'Hitech City', coordinates: { latitude: 17.4500, longitude: 78.3800 } },
      { id: '4', name: 'University Gate', coordinates: { latitude: 17.4832, longitude: 78.4567 } }
    ],
    speed: 35,
    status: 'moving',
    lastUpdated: new Date()
  }
};

class BusTrackingService {
  constructor() {
    this.subscribers = new Set();
    this.busData = { ...MOCK_BUSES };
    this.updateInterval = null;
  }

  // Subscribe to bus location updates
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Start real-time tracking
  startTracking(busCode) {
    console.log(`Starting tracking for bus: ${busCode}`);
    
    // Clear any existing interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Simulate real-time bus movement
    this.updateInterval = setInterval(() => {
      this.updateBusLocation(busCode);
    }, 5000); // Update every 5 seconds

    return this.getBusData(busCode);
  }

  // Stop tracking
  stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    console.log('Bus tracking stopped');
  }

  // Update bus location (mock implementation)
  updateBusLocation(busCode) {
    const bus = this.busData[busCode];
    if (!bus) return;

    const currentIndex = bus.routeCoordinates.findIndex(
      coord => 
        coord.latitude === bus.currentLocation.latitude &&
        coord.longitude === bus.currentLocation.longitude
    );

    if (currentIndex < bus.routeCoordinates.length - 1) {
      // Move to next coordinate
      bus.currentLocation = bus.routeCoordinates[currentIndex + 1];
      bus.lastUpdated = new Date();
      
      // Notify subscribers
      this.notifySubscribers(busCode, bus);
    } else {
      // Bus reached destination
      bus.status = 'arrived';
      this.notifySubscribers(busCode, bus);
      this.stopTracking();
    }
  }

  // Notify all subscribers
  notifySubscribers(busCode, busData) {
    this.subscribers.forEach(callback => {
      callback(busCode, busData);
    });
  }

  // Get current bus data
  getBusData(busCode) {
    return this.busData[busCode] || null;
  }

  // Get all buses for a university
  getBusesForUniversity(universityCode) {
    // In real implementation, filter by university
    return Object.values(this.busData);
  }

  // Verify bus code
  verifyBusCode(busCode, enteredCode) {
    const bus = this.busData[busCode];
    if (!bus) {
      return { success: false, message: 'Bus not found' };
    }

    if (bus.code !== enteredCode) {
      return { success: false, message: 'Invalid bus code' };
    }

    return { 
      success: true, 
      message: 'Bus code verified successfully',
      bus: bus 
    };
  }

  // Calculate estimated arrival time
  calculateETA(busCode, stopId) {
    const bus = this.busData[busCode];
    if (!bus) return null;

    const stopIndex = bus.stops.findIndex(stop => stop.id === stopId);
    const currentIndex = bus.routeCoordinates.findIndex(
      coord => 
        coord.latitude === bus.currentLocation.latitude &&
        coord.longitude === bus.currentLocation.longitude
    );

    if (stopIndex === -1 || currentIndex === -1) return null;

    const stopsRemaining = stopIndex - currentIndex;
    const timePerStop = 5; // minutes per stop (mock)
    const estimatedMinutes = stopsRemaining * timePerStop;

    return {
      minutes: estimatedMinutes,
      arrivalTime: new Date(Date.now() + estimatedMinutes * 60000),
      stopsRemaining: stopsRemaining
    };
  }

  // Get distance between two coordinates (Haversine formula)
  calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(coord2.latitude - coord1.latitude);
    const dLon = this.deg2rad(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1.latitude)) * Math.cos(this.deg2rad(coord2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Check if bus is within alert distance
  shouldTriggerAlert(busCode, stopId, alertDistanceKm = 2) {
    const bus = this.busData[busCode];
    if (!bus) return false;

    const stop = bus.stops.find(s => s.id === stopId);
    if (!stop) return false;

    const distance = this.calculateDistance(bus.currentLocation, stop.coordinates);
    return distance <= alertDistanceKm;
  }
}

// Create singleton instance
const busTrackingService = new BusTrackingService();

export default busTrackingService;