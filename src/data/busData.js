// Sample bus data for different universities
export const BUS_DATA = {
  // JNTU Hyderabad
  'JNTUH': [
    {
      id: '1',
      number: 'Bus 1',
      route: 'Kukatpally to JNTU Campus',
      code: 'JNTUH001',
      departureTime: '7:00 AM',
      returnTime: '5:30 PM',
      capacity: '50 seats',
      driver: {
        name: 'Rajesh Kumar',
        phone: '9876543210'
      },
      routeCoordinates: [
        { latitude: 17.4849, longitude: 78.3899 }, // Kukatpally
        { latitude: 17.4401, longitude: 78.3489 }, // Miyapur
        { latitude: 17.4500, longitude: 78.3800 }, // Hitech City
        { latitude: 17.4932, longitude: 78.3912 }, // JNTU Campus
      ],
      stops: [
        { id: '1', number: 'Stop 1', name: 'Kukatpally Bus Depot', time: '7:00 AM', coordinates: { latitude: 17.4849, longitude: 78.3899 } },
        { id: '2', number: 'Stop 2', name: 'Miyapur Metro Station', time: '7:15 AM', coordinates: { latitude: 17.4401, longitude: 78.3489 } },
        { id: '3', number: 'Stop 3', name: 'Hitech City Junction', time: '7:30 AM', coordinates: { latitude: 17.4500, longitude: 78.3800 } },
        { id: '4', number: 'Stop 4', name: 'JNTU Main Gate', time: '7:45 AM', coordinates: { latitude: 17.4932, longitude: 78.3912 } },
      ],
      fare: '₹25',
      type: 'College Bus',
      amenities: ['AC', 'WiFi', 'Charging Ports']
    },
    {
      id: '2',
      number: 'Bus 2',
      route: 'Ameerpet to JNTU Campus',
      code: 'JNTUH002',
      departureTime: '7:15 AM',
      returnTime: '5:45 PM',
      capacity: '45 seats',
      driver: {
        name: 'Suresh Reddy',
        phone: '9876543211'
      },
      routeCoordinates: [
        { latitude: 17.4375, longitude: 78.4484 }, // Ameerpet
        { latitude: 17.4250, longitude: 78.4500 }, // SR Nagar
        { latitude: 17.4500, longitude: 78.3800 }, // Hitech City
        { latitude: 17.4932, longitude: 78.3912 }, // JNTU Campus
      ],
      stops: [
        { id: '1', number: 'Stop 1', name: 'Ameerpet Metro Station', time: '7:15 AM', coordinates: { latitude: 17.4375, longitude: 78.4484 } },
        { id: '2', number: 'Stop 2', name: 'SR Nagar Bus Stop', time: '7:25 AM', coordinates: { latitude: 17.4250, longitude: 78.4500 } },
        { id: '3', number: 'Stop 3', name: 'Hitech City Junction', time: '7:40 AM', coordinates: { latitude: 17.4500, longitude: 78.3800 } },
        { id: '4', number: 'Stop 4', name: 'JNTU Main Gate', time: '7:55 AM', coordinates: { latitude: 17.4932, longitude: 78.3912 } },
      ],
      fare: '₹20',
      type: 'College Bus',
      amenities: ['AC', 'Charging Ports']
    }
  ],

  // Osmania University
  'OU': [
    {
      id: '1',
      number: 'Bus 1',
      route: 'Secunderabad to OU Campus',
      code: 'OU001',
      departureTime: '7:30 AM',
      returnTime: '5:00 PM',
      capacity: '40 seats',
      driver: {
        name: 'Mohan Singh',
        phone: '9876543212'
      },
      routeCoordinates: [
        { latitude: 17.4399, longitude: 78.4983 }, // Secunderabad
        { latitude: 17.4150, longitude: 78.4800 }, // Paradise
        { latitude: 17.4100, longitude: 78.4700 }, // MG Bus Station
        { latitude: 17.4131, longitude: 78.5276 }, // OU Campus
      ],
      stops: [
        { id: '1', number: 'Stop 1', name: 'Secunderabad Station', time: '7:30 AM', coordinates: { latitude: 17.4399, longitude: 78.4983 } },
        { id: '2', number: 'Stop 2', name: 'Paradise Circle', time: '7:40 AM', coordinates: { latitude: 17.4150, longitude: 78.4800 } },
        { id: '3', number: 'Stop 3', name: 'MG Bus Station', time: '7:50 AM', coordinates: { latitude: 17.4100, longitude: 78.4700 } },
        { id: '4', number: 'Stop 4', name: 'OU Main Gate', time: '8:10 AM', coordinates: { latitude: 17.4131, longitude: 78.5276 } },
      ],
      fare: '₹30',
      type: 'University Bus',
      amenities: ['AC', 'WiFi']
    }
  ],

  // Kakatiya University
  'KU': [
    {
      id: '1',
      number: 'Bus 1',
      route: 'Hanamkonda to KU Campus',
      code: 'KU001',
      departureTime: '8:00 AM',
      returnTime: '4:30 PM',
      capacity: '35 seats',
      driver: {
        name: 'Ravi Shankar',
        phone: '9876543213'
      },
      routeCoordinates: [
        { latitude: 18.0100, longitude: 79.5500 }, // Hanamkonda
        { latitude: 18.0050, longitude: 79.5450 }, // Subedari
        { latitude: 17.9950, longitude: 79.5400 }, // Kazipet
        { latitude: 17.9897, longitude: 79.5455 }, // KU Campus
      ],
      stops: [
        { id: '1', number: 'Stop 1', name: 'Hanamkonda Bus Stand', time: '8:00 AM', coordinates: { latitude: 18.0100, longitude: 79.5500 } },
        { id: '2', number: 'Stop 2', name: 'Subedari Crossroads', time: '8:10 AM', coordinates: { latitude: 18.0050, longitude: 79.5450 } },
        { id: '3', number: 'Stop 3', name: 'Kazipet Junction', time: '8:20 AM', coordinates: { latitude: 17.9950, longitude: 79.5400 } },
        { id: '4', number: 'Stop 4', name: 'KU Main Entrance', time: '8:30 AM', coordinates: { latitude: 17.9897, longitude: 79.5455 } },
      ],
      fare: '₹15',
      type: 'University Bus',
      amenities: ['Non-AC']
    }
  ]
};

// Get buses for a specific university
export const getBusesForUniversity = (universityCode) => {
  return BUS_DATA[universityCode] || [];
};

// Get bus by code
export const getBusByCode = (busCode) => {
  for (const universityBuses of Object.values(BUS_DATA)) {
    const bus = universityBuses.find(b => b.code === busCode);
    if (bus) return bus;
  }
  return null;
};

// Verify bus code
export const verifyBusCode = (busCode, enteredCode) => {
  const bus = getBusByCode(busCode);
  if (!bus) {
    return { success: false, message: 'Bus not found' };
  }
  
  if (bus.code !== enteredCode) {
    return { success: false, message: 'Invalid bus code' };
  }
  
  return { success: true, message: 'Bus code verified', bus };
};

// Get all universities
export const getAllUniversities = () => {
  return Object.keys(BUS_DATA).map(code => {
    const buses = BUS_DATA[code];
    return {
      code: code,
      name: getUniversityName(code),
      busCount: buses.length,
      location: getUniversityLocation(code)
    };
  });
};

// Helper functions
const getUniversityName = (code) => {
  const names = {
    'JNTUH': 'JNTU Hyderabad',
    'OU': 'Osmania University',
    'KU': 'Kakatiya University',
    'AU': 'Andhra University',
    'SVU': 'Sri Venkateswara University'
  };
  return names[code] || code;
};

const getUniversityLocation = (code) => {
  const locations = {
    'JNTUH': 'Kukatpally, Hyderabad',
    'OU': 'Hyderabad',
    'KU': 'Warangal'
  };
  return locations[code] || 'Unknown';
};

export default BUS_DATA;