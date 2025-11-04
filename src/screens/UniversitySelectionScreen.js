import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

const UniversitySelectionScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  // Sample university data - you can expand this list
  const universities = [
    { id: '1', name: 'JNTU Hyderabad', code: 'JNTUH' },
    { id: '2', name: 'Osmania University', code: 'OU' },
    { id: '3', name: 'Kakatiya University', code: 'KU' },
    { id: '4', name: 'Andhra University', code: 'AU' },
    { id: '5', name: 'Sri Venkateswara University', code: 'SVU' },
    { id: '6', name: 'Telangana University', code: 'TU' },
    { id: '7', name: 'Mahatma Gandhi University', code: 'MGU' },
    { id: '8', name: 'Satavahana University', code: 'SU' },
  ];

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university);
  };

  const handleContinue = () => {
    if (!selectedUniversity) {
      Alert.alert('Error', 'Please select your university');
      return;
    }
    
    // Navigate to Bus Selection with university info
    navigation.navigate('BusSelection', { university: selectedUniversity });
  };

  const renderUniversityItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.universityItem,
        selectedUniversity?.id === item.id && styles.selectedUniversityItem
      ]}
      onPress={() => handleUniversitySelect(item)}
    >
      <Text style={styles.universityName}>{item.name}</Text>
      <Text style={styles.universityCode}>{item.code}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your University</Text>
      <Text style={styles.subtitle}>Choose your educational institution</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search universities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Universities List */}
      <FlatList
        data={filteredUniversities}
        renderItem={renderUniversityItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Selected University Display */}
      {selectedUniversity && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedText}>Selected: </Text>
          <Text style={styles.selectedUniversity}>
            {selectedUniversity.name} ({selectedUniversity.code})
          </Text>
        </View>
      )}

      {/* Continue Button */}
      <TouchableOpacity 
        style={[
          styles.continueButton,
          !selectedUniversity && styles.continueButtonDisabled
        ]} 
        onPress={handleContinue}
        disabled={!selectedUniversity}
      >
        <Text style={styles.continueButtonText}>Continue to Bus Selection</Text>
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
    marginBottom: 10,
    color: '#1e90ff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  universityItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedUniversityItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1e90ff',
    borderWidth: 2,
  },
  universityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  universityCode: {
    fontSize: 14,
    color: '#666',
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
  selectedUniversity: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UniversitySelectionScreen;