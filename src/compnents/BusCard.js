import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BusCard = ({ 
  bus, 
  isSelected, 
  onSelect, 
  showCode = false 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard
      ]}
      onPress={() => onSelect(bus)}
    >
      <View style={styles.cardContent}>
        <View style={styles.busHeader}>
          <Text style={[
            styles.busNumber,
            isSelected && styles.selectedBusNumber
          ]}>
            {bus.number}
          </Text>
          {isSelected && (
            <Text style={styles.selectedIcon}>✓</Text>
          )}
        </View>
        
        <Text style={styles.busRoute}>{bus.route}</Text>
        
        {showCode && bus.code && (
          <Text style={styles.busCode}>Code: {bus.code}</Text>
        )}
        
        <View style={styles.busMeta}>
          <Text style={styles.busTime}>🕒 {bus.departureTime}</Text>
          <Text style={styles.busCapacity}>👥 {bus.capacity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  selectedCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1e90ff',
  },
  cardContent: {
    flex: 1,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedBusNumber: {
    color: '#1e90ff',
  },
  selectedIcon: {
    fontSize: 16,
    color: '#1e90ff',
    fontWeight: 'bold',
  },
  busRoute: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  busCode: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  busMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  busTime: {
    fontSize: 12,
    color: '#666',
  },
  busCapacity: {
    fontSize: 12,
    color: '#666',
  },
});

export default BusCard;