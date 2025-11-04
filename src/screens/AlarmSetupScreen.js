import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const AlarmSetupScreen = ({ navigation, route }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const { bus, university, stop } = route.params;

  // Alarm time options in minutes before arrival
  const alarmTimes = [
    { id: '5', minutes: 5, label: '5 minutes before' },
    { id: '10', minutes: 10, label: '10 minutes before' },
    { id: '15', minutes: 15, label: '15 minutes before' },
    { id: '20', minutes: 20, label: '20 minutes before' },
    { id: '25', minutes: 25, label: '25 minutes before' },
    { id: '30', minutes: 30, label: '30 minutes before' },
  ];

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const activateAlarm = () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select alarm time');
      return;
    }

    // Show confirmation with all details
    Alert.alert(
      'Alarm Set Successfully!',
      `🚍 Bus: ${bus.number}\n📍 Stop: ${stop.name}\n⏰ Alert: ${selectedTime.minutes} minutes before arrival\n\nYou will be notified when the bus is approaching your stop.`,
      [
        { 
          text: 'Start Tracking', 
          onPress: () => navigation.navigate('Tracking', {
            bus: bus,
            university: university,
            stop: stop,
            alarmTime: selectedTime
          }) 
        }
      ]
    );
  };

  const calculateArrivalTime = () => {
    if (!stop.time) return 'Estimated arrival time';
    
    // Simple calculation - in real app, this would use real-time data
    const stopTime = stop.time;
    return `Expected arrival: ${stopTime}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Alarm</Text>
      
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Trip Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>University:</Text>
          <Text style={styles.summaryValue}>{university.name}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Bus:</Text>
          <Text style={styles.summaryValue}>{bus.number} - {bus.route}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Stop:</Text>
          <Text style={styles.summaryValue}>{stop.number} - {stop.name}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Arrival:</Text>
          <Text style={styles.summaryValue}>{calculateArrivalTime()}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>When should we alert you?</Text>
      <Text style={styles.subtitle}>Select how many minutes before arrival</Text>

      {/* Alarm Time Selection */}
      <ScrollView style={styles.timeList} showsVerticalScrollIndicator={false}>
        {alarmTimes.map((time) => (
          <TouchableOpacity
            key={time.id}
            style={[
              styles.timeItem,
              selectedTime?.id === time.id && styles.selectedTimeItem
            ]}
            onPress={() => handleTimeSelect(time)}
          >
            <View style={styles.timeContent}>
              <Text style={[
                styles.timeMinutes,
                selectedTime?.id === time.id && styles.selectedTimeMinutes
              ]}>
                {time.minutes} mins
              </Text>
              <Text style={[
                styles.timeLabel,
                selectedTime?.id === time.id && styles.selectedTimeLabel
              ]}>
                {time.label}
              </Text>
            </View>
            
            {selectedTime?.id === time.id && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedIcon}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Alarm Preview */}
      {selectedTime && (
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Alarm Preview</Text>
          <Text style={styles.previewText}>
            You'll be notified when the bus is {' '}
            <Text style={styles.highlight}>{selectedTime.minutes} minutes</Text>{' '}
            away from {' '}
            <Text style={styles.highlight}>{stop.name}</Text>
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Change Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.activateButton,
            !selectedTime && styles.activateButtonDisabled
          ]} 
          onPress={activateAlarm}
          disabled={!selectedTime}
        >
          <Text style={styles.activateButtonText}>
            {selectedTime ? `Set ${selectedTime.minutes} Min Alarm` : 'Set Alarm'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Text style={styles.infoText}>
          💡 The app will track the bus location and notify you at the perfect time!
        </Text>
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
    marginBottom: 20,
    color: '#1e90ff',
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#1e90ff',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
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
  timeList: {
    flex: 1,
    marginBottom: 20,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  selectedTimeItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1e90ff',
  },
  timeContent: {
    flex: 1,
  },
  timeMinutes: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedTimeMinutes: {
    color: '#1e90ff',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
  },
  selectedTimeLabel: {
    color: '#1e90ff',
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewCard: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
  activateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 0.48,
  },
  activateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  activateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoNote: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
});

export default AlarmSetupScreen;