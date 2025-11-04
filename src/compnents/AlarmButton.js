import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const AlarmButton = ({ 
  minutes, 
  isSelected, 
  onPress, 
  isLoading = false,
  isActive = false 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected && styles.selectedButton,
        isActive && styles.activeButton
      ]}
      onPress={() => onPress(minutes)}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={isSelected ? '#fff' : '#1e90ff'} 
          size="small" 
        />
      ) : (
        <>
          <Text style={[
            styles.buttonText,
            isSelected && styles.selectedButtonText,
            isActive && styles.activeButtonText
          ]}>
            {minutes} min
          </Text>
          {isActive && (
            <Text style={styles.activeIndicator}>🔔</Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
    margin: 5,
    minWidth: 80,
  },
  selectedButton: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  activeButton: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
  activeButtonText: {
    color: '#fff',
  },
  activeIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    fontSize: 12,
  },
});

export default AlarmButton;