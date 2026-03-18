import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const TrackingScreen = ({ navigation, route }) => {

  // 🔥 SAFE PARAMS (prevents crash)
  const bus = route?.params?.bus || { number: "N/A", route: "N/A" };
  const university = route?.params?.university || { name: "University" };
  const stop = route?.params?.stop || { name: "Your Stop" };
  const alarmTime = route?.params?.alarmTime || { minutes: 5 };

  const [busLocation, setBusLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(true);
  const [timeToArrival, setTimeToArrival] = useState('Calculating...');
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  const routeCoordinates = [
    { latitude: 17.3850, longitude: 78.4867 },
    { latitude: 17.4401, longitude: 78.3489 },
    { latitude: 17.4500, longitude: 78.3800 },
    { latitude: 17.4600, longitude: 78.4000 },
    { latitude: 17.4700, longitude: 78.4200 },
    { latitude: 17.4832, longitude: 78.4567 },
  ];

  useEffect(() => {
    if (!isTracking) return;

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < routeCoordinates.length - 1) {

        setBusLocation(routeCoordinates[currentIndex]);
        currentIndex++;

        const remainingStops = routeCoordinates.length - currentIndex - 1;
        const estimatedTime = remainingStops * 5;
        setTimeToArrival(`${estimatedTime} minutes`);

        if (estimatedTime <= alarmTime.minutes && !alarmTriggered) {
          triggerAlarm();
        }

      } else {
        clearInterval(interval);
        setTimeToArrival('Arrived');
        Alert.alert('Bus Arrived', 'The bus has reached your stop!');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const triggerAlarm = () => {
    setAlarmTriggered(true);

    Alert.alert(
      '🚍 Bus Arrival Alert!',
      `Bus ${bus.number} is near ${stop.name}`,
      [{ text: 'OK' }]
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const resumeTracking = () => {
    setIsTracking(true);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🚍 Live Tracking</Text>
      </View>

      {/* 🔥 SAFE MAP (prevents crash) */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 17.4401,
            longitude: 78.3489,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >

          <Polyline
            coordinates={routeCoordinates}
            strokeColor="blue"
            strokeWidth={4}
          />

          {busLocation && (
            <Marker coordinate={busLocation}>
              <Text style={{ fontSize: 20 }}>🚍</Text>
            </Marker>
          )}

          <Marker coordinate={routeCoordinates[3]}>
            <Text style={{ fontSize: 20 }}>📍</Text>
          </Marker>

          <Marker coordinate={routeCoordinates[5]}>
            <Text style={{ fontSize: 20 }}>🏫</Text>
          </Marker>

        </MapView>
      </View>

      {/* INFO */}
      <ScrollView style={styles.info}>
        <Text>Bus: {bus.number}</Text>
        <Text>Route: {bus.route}</Text>
        <Text>Stop: {stop.name}</Text>
        <Text>Time: {timeToArrival}</Text>

        <TouchableOpacity onPress={stopTracking} style={styles.btnRed}>
          <Text style={styles.btnText}>Pause</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resumeTracking} style={styles.btnGreen}>
          <Text style={styles.btnText}>Resume</Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    padding: 15,
    backgroundColor: '#eee',
  },

  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  mapContainer: {
    height: height * 0.4,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  info: {
    padding: 20,
  },

  btnRed: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 10,
  },

  btnGreen: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 10,
  },

  btnText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default TrackingScreen;