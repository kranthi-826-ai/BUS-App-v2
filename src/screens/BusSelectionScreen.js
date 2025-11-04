import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const BusSelectionScreen = ({ navigation, route }) => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [busCode, setBusCode] = useState('');
  const { university } = route.params;

  // Sample bus data - you'll replace this with actual data
  const buses = [
    { id: '1', number: 'Bus 1', route: 'Kukatpally to Campus', code: 'BUS001' },
    { id: '2', number: 'Bus 2', route: 'Ameerpet to Campus', code: 'BUS002' },
    { id: '3', number: 'Bus 3', route: 'Secunderabad to Campus', code: 'BUS003' },
    { id: '4', number: 'Bus 4', route: 'LB Nagar to Campus', code: 'BUS004' },
    { id: '5', number: 'Bus 5', route: 'Hi-Tech City to Campus', code: 'BUS005' },
    { id: '6', number: 'Bus 6', route: 'Gachibowli to Campus', code: 'BUS006' },
  ];

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    setBusCode(''); // Reset bus code when new bus is selected
  };

  const verifyBusCode = () => {
    if (!selectedBus) {
      Alert.alert('Error', 'Please select a bus first');
      return;
    }

    if (!busCode) {
      Alert.alert('Error', 'Please enter bus code');
      return;
    }

    // Verify bus code (in real app, this would check with transport incharge data)
    if (busCode !== selectedBus.code) {
      Alert.alert('Error', 'Invalid bus code. Please check with transport incharge.');
      return;
    }

    // If code is correct, proceed to stop selection
    Alert.alert('Success', 'Bus code verified!', [
      { 
        text: 'Continue', 
        onPress: () => navigation.navigate('StopSelection', { 
          bus: selectedBus,
          university: university 
        }) 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Bus</Text>
      <Text style={styles.subtitle}>{university.name}</Text>

      {/* Bus Selection */}
      <Text style={styles.sectionTitle}>Available Buses</Text>
      <ScrollView style={styles.busList} showsVerticalScrollIndicator={false}>
        {buses.map((bus) => (
          <TouchableOpacity
            key={bus.id}
            style={[
              styles.busItem,
              selectedBus?.id === bus.id && styles.selectedBusItem
            ]}
            onPress={() => handleBusSelect(bus)}
          >
            <View style={styles.busInfo}>
              <Text style={styles.busNumber}>{bus.number}</Text>
              <Text style={styles.busRoute}>{bus.route}</Text>
            </View>
            {selectedBus?.id === bus.id && (
              <Text style={styles.selectedIcon}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bus Code Input */}
      {selectedBus && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeTitle}>Enter Bus Code for {selectedBus.number}</Text>
          <Text style={styles.codeHint}>
            *Get code from transport incharge
          </Text>
          
          <TextInput
            style={styles.codeInput}
            placeholder="Enter bus code"
            value={busCode}
            onChangeText={setBusCode}
            autoCapitalize="characters"
          />
          
          <TouchableOpacity 
            style={[
              styles.verifyButton,
              !busCode && styles.verifyButtonDisabled
            ]} 
            onPress={verifyBusCode}
            disabled={!busCode}
          >
            <Text style={styles.verifyButtonText}>Verify Bus Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Navigation Help */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back to Universities</Text>
      </TouchableOpacity>
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
    marginBottom: 5,
    color: '#1e90ff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  busList: {
    flex: 1,
    marginBottom: 20,
  },
  busItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedBusItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1e90ff',
    borderWidth: 2,
  },
  busInfo: {
    flex: 1,
  },
  busNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  busRoute: {
    fontSize: 14,
    color: '#666',
  },
  selectedIcon: {
    fontSize: 18,
    color: '#1e90ff',
    fontWeight: 'bold',
  },
  codeContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  codeHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  verifyButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#1e90ff',
    fontSize: 16,
  },
});

export default BusSelectionScreen;