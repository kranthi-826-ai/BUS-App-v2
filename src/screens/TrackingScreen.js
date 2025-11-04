import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const TrackingScreen = ({ navigation, route }) => {
  const { bus, university, stop, alarmTime } = route.params;
  const [busLocation, setBusLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(true);
  const [timeToArrival, setTimeToArrival] = useState('Calculating...');
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  // Sample bus route coordinates (you'll replace with real data)
  const routeCoordinates = [
    { latitude: 17.3850, longitude: 78.4867 }, // Start
    { latitude: 17.4401, longitude: 78.3489 }, // Stop 1
    { latitude: 17.4500, longitude: 78.3800 }, // Stop 2
    { latitude: 17.4600, longitude: 78.4000 }, // Stop 3 - Selected stop
    { latitude: 17.4700, longitude: 78.4200 }, // Stop 4
    { latitude: 17.4832, longitude: 78.4567 }, // University
  ];

  // Mock bus movement simulation
  useEffect(() => {
    if (!isTracking) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < routeCoordinates.length - 1) {
        setBusLocation(routeCoordinates[currentIndex]);
        currentIndex++;
        
        // Calculate time to arrival (mock calculation)
        const remainingStops = routeCoordinates.length - currentIndex - 1;
        const estimatedTime = remainingStops * 5; // 5 minutes per stop
        setTimeToArrival(`${estimatedTime} minutes`);
        
        // Check if alarm should be triggered
        if (estimatedTime <= alarmTime.minutes && !alarmTriggered) {
          triggerAlarm();
        }
      } else {
        // Bus reached destination
        clearInterval(interval);
        setTimeToArrival('Arrived');
        Alert.alert('Bus Arrived', 'The bus has reached your stop!');
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isTracking, alarmTriggered]);

  const triggerAlarm = () => {
    setAlarmTriggered(true);
    Alert.alert(
      '🚍 Bus Arrival Alert!',
      `Bus ${bus.number} will arrive at ${stop.name} in approximately ${alarmTime.minutes} minutes!`,
      [
        { text: 'OK', onPress: () => console.log('Alarm acknowledged') },
        { text: 'Snooze 5 mins', onPress: () => snoozeAlarm() }
      ]
    );
  };

  const snoozeAlarm = () => {
    setAlarmTriggered(false);
    // Reset alarm logic would go here
  };

  const stopTracking = () => {
    setIsTracking(false);
    Alert.alert(
      'Tracking Stopped',
      'Bus tracking has been paused. You can resume anytime.',
      [{ text: 'OK' }]
    );
  };

  const resumeTracking = () => {
    setIsTracking(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Live Bus Tracking</Text>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, isTracking ? styles.activeDot : styles.inactiveDot]} />
          <Text style={styles.statusText}>
            {isTracking ? 'Tracking Active' : 'Tracking Paused'}
          </Text>
        </View>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 17.4401,
            longitude: 78.3489,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Bus Route */}
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#1e90ff"
            strokeWidth={4}
          />
          
          {/* Bus Marker */}
          {busLocation && (
            <Marker coordinate={busLocation} title={`Bus ${bus.number}`}>
              <View style={styles.busMarker}>
                <Text style={styles.busMarkerText}>🚍</Text>
              </View>
            </Marker>
          )}
          
          {/* Stop Marker */}
          <Marker 
            coordinate={routeCoordinates[3]} 
            title={`Your Stop: ${stop.name}`}
            description={`Alarm: ${alarmTime.minutes} mins before`}
          >
            <View style={styles.stopMarker}>
              <Text style={styles.stopMarkerText}>📍</Text>
            </View>
          </Marker>
          
          {/* University Marker */}
          <Marker coordinate={routeCoordinates[5]} title={university.name}>
            <View style={styles.universityMarker}>
              <Text style={styles.universityMarkerText}>🏫</Text>
            </View>
          </Marker>
        </MapView>
      </View>

      {/* Tracking Info Card */}
      <ScrollView style={styles.infoCard} showsVerticalScrollIndicator={false}>
        {/* Bus Status */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Bus Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Bus:</Text>
            <Text style={styles.statusValue}>{bus.number}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Route:</Text>
            <Text style={styles.statusValue}>{bus.route}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={[styles.statusValue, styles.movingStatus]}>
              {isTracking ? 'Moving →' : 'Paused'}
            </Text>
          </View>
        </View>

        {/* Arrival Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Arrival Information</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Your Stop:</Text>
            <Text style={styles.statusValue}>{stop.name}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Time to Arrival:</Text>
            <Text style={[styles.statusValue, styles.timeValue]}>
              {timeToArrival}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Alarm Set:</Text>
            <Text style={styles.statusValue}>
              {alarmTime.minutes} minutes before
            </Text>
          </View>
        </View>

        {/* Alarm Status */}
        {alarmTriggered && (
          <View style={styles.alarmAlert}>
            <Text style={styles.alarmTitle}>⚠️ ALARM ACTIVE</Text>
            <Text style={styles.alarmText}>
              Bus is approaching your stop! Get ready.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {isTracking ? (
            <TouchableOpacity style={styles.pauseButton} onPress={stopTracking}>
              <Text style={styles.pauseButtonText}>⏸️ Pause Tracking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.resumeButton} onPress={resumeTracking}>
              <Text style={styles.resumeButtonText}>▶️ Resume Tracking</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.changeSettingsButton}
            onPress={() => navigation.navigate('BusSelection')}
          >
            <Text style={styles.changeSettingsText}>Change Bus/Stop</Text>
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Map Legend:</Text>
          <View style={styles.legendItem}>
            <Text style={styles.legendEmoji}>🚍</Text>
            <Text style={styles.legendText}>Bus Location</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendEmoji}>📍</Text>
            <Text style={styles.legendText}>Your Stop</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendEmoji}>🏫</Text>
            <Text style={styles.legendText}>University</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.routeLine} />
            <Text style={styles.legendText}>Bus Route</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e90ff',
    marginBottom: 10,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#28a745',
  },
  inactiveDot: {
    backgroundColor: '#dc3545',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  mapContainer: {
    height: height * 0.4,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  busMarker: {
    backgroundColor: '#1e90ff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  busMarkerText: {
    fontSize: 16,
  },
  stopMarker: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  stopMarkerText: {
    fontSize: 16,
  },
  universityMarker: {
    backgroundColor: '#ff6b35',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  universityMarkerText: {
    fontSize: 16,
  },
  infoCard: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  movingStatus: {
    color: '#28a745',
  },
  timeValue: {
    color: '#1e90ff',
    fontWeight: 'bold',
  },
  alarmAlert: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    marginBottom: 20,
  },
  alarmTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  alarmText: {
    fontSize: 14,
    color: '#856404',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  pauseButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resumeButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeSettingsButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e90ff',
  },
  changeSettingsText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legend: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendEmoji: {
    fontSize: 14,
    marginRight: 10,
    width: 20,
  },
  routeLine: {
    width: 20,
    height: 4,
    backgroundColor: '#1e90ff',
    marginRight: 10,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default TrackingScreen;