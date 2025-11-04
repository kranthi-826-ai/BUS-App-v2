// Comprehensive stop data for all bus routes
export const STOP_DATA = {
  // JNTU Hyderabad Stops
  'JNTUH001': [
    {
      id: '1',
      number: 'Stop 1',
      name: 'Kukatpally Bus Depot',
      coordinates: { latitude: 17.4849, longitude: 78.3899 },
      arrivalTime: '7:00 AM',
      departureTime: '7:05 AM',
      landmark: 'Near Metro Station',
      distance: '0 km',
      estimatedTime: '0 min',
      type: 'Starting Point',
      facilities: ['Shelter', 'Seating', 'Digital Display']
    },
    {
      id: '2',
      number: 'Stop 2',
      name: 'Miyapur Metro Station',
      coordinates: { latitude: 17.4401, longitude: 78.3489 },
      arrivalTime: '7:15 AM',
      departureTime: '7:20 AM',
      landmark: 'Metro Station Entrance',
      distance: '8 km',
      estimatedTime: '15 min',
      type: 'Major Stop',
      facilities: ['Metro Connectivity', 'Shopping Complex', 'Food Court']
    },
    {
      id: '3',
      number: 'Stop 3',
      name: 'Hitech City Junction',
      coordinates: { latitude: 17.4500, longitude: 78.3800 },
      arrivalTime: '7:30 AM',
      departureTime: '7:35 AM',
      landmark: 'Near Cyber Towers',
      distance: '12 km',
      estimatedTime: '30 min',
      type: 'Major Stop',
      facilities: ['IT Park', 'Shopping Mall', 'Restaurants']
    },
    {
      id: '4',
      number: 'Stop 4',
      name: 'JNTU Main Gate',
      coordinates: { latitude: 17.4932, longitude: 78.3912 },
      arrivalTime: '7:45 AM',
      departureTime: '7:50 AM',
      landmark: 'University Main Entrance',
      distance: '15 km',
      estimatedTime: '45 min',
      type: 'Destination',
      facilities: ['Security Check', 'Student Center', 'Cafeteria']
    }
  ],

  'JNTUH002': [
    {
      id: '1',
      number: 'Stop 1',
      name: 'Ameerpet Metro Station',
      coordinates: { latitude: 17.4375, longitude: 78.4484 },
      arrivalTime: '7:15 AM',
      departureTime: '7:20 AM',
      landmark: 'Metro Station Exit 2',
      distance: '0 km',
      estimatedTime: '0 min',
      type: 'Starting Point',
      facilities: ['Metro Connectivity', 'Commercial Complex']
    },
    {
      id: '2',
      number: 'Stop 2',
      name: 'SR Nagar Bus Stop',
      coordinates: { latitude: 17.4250, longitude: 78.4500 },
      arrivalTime: '7:25 AM',
      departureTime: '7:30 AM',
      landmark: 'Near Apollo Hospital',
      distance: '3 km',
      estimatedTime: '10 min',
      type: 'Regular Stop',
      facilities: ['Medical Facilities', 'Shopping Area']
    },
    {
      id: '3',
      number: 'Stop 3',
      name: 'Hitech City Junction',
      coordinates: { latitude: 17.4500, longitude: 78.3800 },
      arrivalTime: '7:40 AM',
      departureTime: '7:45 AM',
      landmark: 'Cyber Towers Signal',
      distance: '10 km',
      estimatedTime: '25 min',
      type: 'Major Stop',
      facilities: ['IT Companies', 'Food Courts']
    },
    {
      id: '4',
      number: 'Stop 4',
      name: 'JNTU Main Gate',
      coordinates: { latitude: 17.4932, longitude: 78.3912 },
      arrivalTime: '7:55 AM',
      departureTime: '8:00 AM',
      landmark: 'University Main Gate',
      distance: '15 km',
      estimatedTime: '40 min',
      type: 'Destination',
      facilities: ['University Facilities']
    }
  ],

  // Osmania University Stops
  'OU001': [
    {
      id: '1',
      number: 'Stop 1',
      name: 'Secunderabad Station',
      coordinates: { latitude: 17.4399, longitude: 78.4983 },
      arrivalTime: '7:30 AM',
      departureTime: '7:35 AM',
      landmark: 'Railway Station Entrance',
      distance: '0 km',
      estimatedTime: '0 min',
      type: 'Starting Point',
      facilities: ['Railway Station', 'Shopping Plaza']
    },
    {
      id: '2',
      number: 'Stop 2',
      name: 'Paradise Circle',
      coordinates: { latitude: 17.4150, longitude: 78.4800 },
      arrivalTime: '7:40 AM',
      departureTime: '7:45 AM',
      landmark: 'Near Paradise Hotel',
      distance: '4 km',
      estimatedTime: '10 min',
      type: 'Major Stop',
      facilities: ['Restaurants', 'Shopping']
    },
    {
      id: '3',
      number: 'Stop 3',
      name: 'MG Bus Station',
      coordinates: { latitude: 17.4100, longitude: 78.4700 },
      arrivalTime: '7:50 AM',
      departureTime: '7:55 AM',
      landmark: 'Main Bus Terminal',
      distance: '7 km',
      estimatedTime: '20 min',
      type: 'Major Stop',
      facilities: ['Bus Terminal', 'Commercial Area']
    },
    {
      id: '4',
      number: 'Stop 4',
      name: 'OU Main Gate',
      coordinates: { latitude: 17.4131, longitude: 78.5276 },
      arrivalTime: '8:10 AM',
      departureTime: '8:15 AM',
      landmark: 'University Main Entrance',
      distance: '12 km',
      estimatedTime: '40 min',
      type: 'Destination',
      facilities: ['University Campus']
    }
  ]
};

// Get stops for a specific bus
export const getStopsForBus = (busCode) => {
  return STOP_DATA[busCode] || [];
};

// Get stop by ID
export const getStopById = (busCode, stopId) => {
  const stops = getStopsForBus(busCode);
  return stops.find(stop => stop.id === stopId) || null;
};

// Calculate distance between stops
export const calculateDistanceBetweenStops = (stop1, stop2) => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(stop2.coordinates.latitude - stop1.coordinates.latitude);
  const dLon = deg2rad(stop2.coordinates.longitude - stop1.coordinates.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(stop1.coordinates.latitude)) * Math.cos(deg2rad(stop2.coordinates.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c;
  
  return distance.toFixed(2);
};

// Calculate estimated travel time
export const calculateTravelTime = (distanceKm, averageSpeed = 30) => {
  const timeHours = distanceKm / averageSpeed;
  return Math.ceil(timeHours * 60); // Convert to minutes
};

// Get next stops from current stop
export const getNextStops = (busCode, currentStopId) => {
  const stops = getStopsForBus(busCode);
  const currentIndex = stops.findIndex(stop => stop.id === currentStopId);
  
  if (currentIndex === -1) return [];
  
  return stops.slice(currentIndex + 1);
};

// Get previous stops from current stop
export const getPreviousStops = (busCode, currentStopId) => {
  const stops = getStopsForBus(busCode);
  const currentIndex = stops.findIndex(stop => stop.id === currentStopId);
  
  if (currentIndex === -1) return [];
  
  return stops.slice(0, currentIndex);
};

// Helper function
const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

export default STOP_DATA;