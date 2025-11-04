import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const StopSelectionScreen = ({ navigation, route }) => {
  const [selectedStop, setSelectedStop] = useState(null);
  const { bus, university } = route.params;

  // Sample stop data - you'll replace this with actual bus route stops
  const stops = [
    { id: '1', number: 'Stop 1', name: 'Kukatpally Bus Depot', time: '7:00 AM', distance: '0 km' },
    { id: '2', number: 'Stop 2', name: 'Miyapur Metro Station', time: '7:15 AM', distance: '5 km' },
    { id: '3', number: 'Stop 3', name: 'Hitech City Junction', time: '7:30 AM', distance: '10 km' },
    { id: '4', number: 'Stop 4', name: 'Madhapur Police Station', time: '7:45 AM', distance: '15 km' },
    { id: '5', number: 'Stop 5', name: 'Gachibowli Circle', time: '8:00 AM', distance: '20 km' },
    { id: '6', number: 'Stop 6', name: 'University Main Gate', time: '8:15 AM', distance: '25 km' },
    { id: '7', number: 'Stop 7', name: 'Academic Block', time: '8:20 AM', distance: '26 km' },
    { id: '8', number: 'Stop 8', name: 'Hostel Block', time: '8:25 AM', distance: '27 km' },
  ];

  const handleStopSelect = (stop) => {
    setSelectedStop(stop);
  };

  const handleContinue = () => {
    if (!selectedStop) {
      Alert.alert('Error', 'Please select your boarding stop');
      return;
    }

    // Navigate to Alarm Setup with all collected data
    navigation.navigate('AlarmSetup', {
      bus: bus,
      university: university,
      stop: selectedStop
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Stop</Text>
      
      {/* Bus and Route Info */}
      <View style={styles.routeInfo}>
        <Text style={styles.busName}>{bus.number}</Text>
        <Text style={styles.routeName}>{bus.route}</Text>
        <Text style={styles.universityName}>{university.name}</Text>
      </View>

      <Text style={styles.sectionTitle}>Bus Route Stops</Text>
      <Text style={styles.subtitle}>Select your boarding stop</Text>

      {/* Stops List */}
      <ScrollView style={styles.stopsList} showsVerticalScrollIndicator={false}>
        {stops.map((stop, index) => (
          <TouchableOpacity
            key={stop.id}
            style={[
              styles.stopItem,
              selectedStop?.id === stop.id && styles.selectedStopItem,
              index === stops.length - 1 && styles.lastStopItem
            ]}
            onPress={() => handleStopSelect(stop)}
          >
            {/* Stop Number and Connector Line */}
            <View style={styles.stopIndicator}>
              <View style={[
                styles.stopCircle,
                selectedStop?.id === stop.id && styles.selectedStopCircle
              ]}>
                <Text style={[
                  styles.stopNumber,
                  selectedStop?.id === stop.id && styles.selectedStopNumber
                ]}>
                  {stop.number.split(' ')[1]}
                </Text>
              </View>
              {index !== stops.length - 1 && (
                <View style={styles.connectorLine} />
              )}
            </View>

            {/* Stop Details */}
            <View style={styles.stopDetails}>
              <Text style={[
                styles.stopName,
                selectedStop?.id === stop.id && styles.selectedStopName
              ]}>
                {stop.name}
              </Text>
              <View style={styles.stopMeta}>
                <Text style={styles.stopTime}>🕒 {stop.time}</Text>
                <Text style={styles.stopDistance}>📏 {stop.distance}</Text>
              </View>
            </View>

            {/* Selection Indicator */}
            {selectedStop?.id === stop.id && (
              <Text style={styles.selectedIcon}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selected Stop Display */}
      {selectedStop && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedText}>Selected Stop: </Text>
          <Text style={styles.selectedStop}>
            {selectedStop.number} - {selectedStop.name}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedStop && styles.continueButtonDisabled
          ]} 
          onPress={handleContinue}
          disabled={!selectedStop}
        >
          <Text style={styles.continueButtonText}>Set Alarm →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1e90ff',
  },
  routeInfo: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginBottom: 5,
  },
  routeName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  universityName: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  stopsList: {
    flex: 1,
    marginBottom: 20,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  selectedStopItem: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    marginHorizontal: -10,
    paddingHorizontal: 10,
  },
  lastStopItem: {
    marginBottom: 0,
  },
  stopIndicator: {
    alignItems: 'center',
    marginRight: 15,
    width: 40,
  },
  stopCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dee2e6',
  },
  selectedStopCircle: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  stopNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedStopNumber: {
    color: '#fff',
  },
  connectorLine: {
    width: 2,
    height: 40,
    backgroundColor: '#dee2e6',
    marginVertical: 2,
  },
  stopDetails: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  selectedStopName: {
    color: '#1e90ff',
  },
  stopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stopTime: {
    fontSize: 12,
    color: '#666',
  },
  stopDistance: {
    fontSize: 12,
    color: '#666',
  },
  selectedIcon: {
    fontSize: 18,
    color: '#1e90ff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 10,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  selectedStop: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e90ff',
    flex: 0.48,
  },
  backButtonText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 0.48,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StopSelectionScreen;