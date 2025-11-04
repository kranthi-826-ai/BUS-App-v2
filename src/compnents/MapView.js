import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const CustomMapView = ({ 
  busLocation, 
  stops, 
  routeCoordinates, 
  selectedStop,
  universityLocation 
}) => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 17.4401,
        longitude: 78.3489,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {/* Bus Route Line */}
      {routeCoordinates.length > 1 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#1e90ff"
          strokeWidth={4}
        />
      )}
      
      {/* Bus Marker */}
      {busLocation && (
        <Marker coordinate={busLocation} title="Bus Location">
          <CustomBusMarker />
        </Marker>
      )}
      
      {/* Stop Markers */}
      {stops.map((stop, index) => (
        <Marker
          key={stop.id}
          coordinate={stop.coordinates}
          title={stop.name}
          description={`Stop ${index + 1}`}
        >
          <CustomStopMarker 
            isSelected={selectedStop?.id === stop.id}
            stopNumber={index + 1}
          />
        </Marker>
      ))}
      
      {/* University Marker */}
      {universityLocation && (
        <Marker coordinate={universityLocation} title="University">
          <CustomUniversityMarker />
        </Marker>
      )}
    </MapView>
  );
};

const CustomBusMarker = () => (
  <View style={styles.busMarker}>
    <Text style={styles.busEmoji}>🚍</Text>
  </View>
);

const CustomStopMarker = ({ isSelected, stopNumber }) => (
  <View style={[
    styles.stopMarker,
    isSelected && styles.selectedStopMarker
  ]}>
    <Text style={[
      styles.stopText,
      isSelected && styles.selectedStopText
    ]}>
      {stopNumber}
    </Text>
  </View>
);

const CustomUniversityMarker = () => (
  <View style={styles.universityMarker}>
    <Text style={styles.universityEmoji}>🏫</Text>
  </View>
);

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  busMarker: {
    backgroundColor: '#1e90ff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  busEmoji: {
    fontSize: 16,
  },
  stopMarker: {
    backgroundColor: '#28a745',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedStopMarker: {
    backgroundColor: '#ff6b35',
    transform: [{ scale: 1.2 }],
  },
  stopText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  selectedStopText: {
    color: '#fff',
  },
  universityMarker: {
    backgroundColor: '#ff6b35',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  universityEmoji: {
    fontSize: 16,
  },
});

export default CustomMapView;