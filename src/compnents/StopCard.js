import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StopCard = ({ 
  stop, 
  isSelected, 
  onSelect,
  showConnector = true,
  isLast = false 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && styles.selectedCard
        ]}
        onPress={() => onSelect(stop)}
      >
        <View style={styles.stopIndicator}>
          <View style={[
            styles.stopCircle,
            isSelected && styles.selectedStopCircle
          ]}>
            <Text style={[
              styles.stopNumber,
              isSelected && styles.selectedStopNumber
            ]}>
              {stop.number}
            </Text>
          </View>
        </View>

        <View style={styles.stopDetails}>
          <Text style={[
            styles.stopName,
            isSelected && styles.selectedStopName
          ]}>
            {stop.name}
          </Text>
          
          <View style={styles.stopMeta}>
            <Text style={styles.stopTime}>🕒 {stop.time}</Text>
            <Text style={styles.stopDistance}>📏 {stop.distance}</Text>
          </View>
          
          {stop.landmark && (
            <Text style={styles.landmark}>📍 {stop.landmark}</Text>
          )}
        </View>

        {isSelected && (
          <Text style={styles.selectedIcon}>✓</Text>
        )}
      </TouchableOpacity>

      {showConnector && !isLast && (
        <View style={styles.connectorLine} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    width: '100%',
  },
  selectedCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1e90ff',
  },
  stopIndicator: {
    marginRight: 15,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedStopNumber: {
    color: '#fff',
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
    marginBottom: 4,
  },
  stopTime: {
    fontSize: 12,
    color: '#666',
  },
  stopDistance: {
    fontSize: 12,
    color: '#666',
  },
  landmark: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  selectedIcon: {
    fontSize: 18,
    color: '#1e90ff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  connectorLine: {
    width: 2,
    height: 20,
    backgroundColor: '#dee2e6',
    marginVertical: 5,
  },
});

export default StopCard;