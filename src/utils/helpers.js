import { ALARM_CONSTANTS, THEME_CONSTANTS } from './constants';

// Date and Time Helpers
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getTimeDifference = (startTime, endTime) => {
  const diff = Math.abs(new Date(endTime) - new Date(startTime));
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
};

// Distance and Location Helpers
export const haversineDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = deg2rad(coord2.latitude - coord1.latitude);
  const dLon = deg2rad(coord2.longitude - coord1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c;
  
  return distance;
};

export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else {
    return `${distanceKm.toFixed(1)}km`;
  }
};

export const calculateETA = (distanceKm, speedKmH = 30) => {
  const timeHours = distanceKm / speedKmH;
  const minutes = Math.ceil(timeHours * 60);
  
  return {
    minutes: minutes,
    arrivalTime: new Date(Date.now() + minutes * 60000),
    distance: distanceKm
  };
};

// Alarm Helpers
export const validateAlarmTime = (minutes) => {
  return minutes >= ALARM_CONSTANTS.MIN_ALARM_TIME && 
         minutes <= ALARM_CONSTANTS.MAX_ALARM_TIME;
};

export const getAlarmOptions = () => {
  return ALARM_CONSTANTS.ALARM_OPTIONS.map(minutes => ({
    minutes,
    label: `${minutes} minutes before`
  }));
};

// String Helpers
export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatStudentId = (studentId) => {
  // Format: 2023-001-2345
  if (studentId.length === 11) {
    return `${studentId.substring(0, 4)}-${studentId.substring(4, 7)}-${studentId.substring(7)}`;
  }
  return studentId;
};

// Validation Helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const isValidStudentId = (studentId) => {
  // Basic validation - adjust based on your university ID format
  return studentId.length >= 8 && studentId.length <= 15 && /^\d+$/.test(studentId);
};

// Number Helpers
export const generateRandomId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Theme Helpers
export const getThemeColor = (colorName) => {
  return THEME_CONSTANTS.COLORS[colorName.toUpperCase()] || THEME_CONSTANTS.COLORS.PRIMARY;
};

export const getFontSize = (sizeName) => {
  return THEME_CONSTANTS.SIZES[sizeName.toUpperCase()] || THEME_CONSTANTS.SIZES.MEDIUM;
};

// Storage Helpers
export const serializeData = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error serializing data:', error);
    return null;
  }
};

export const deserializeData = (dataString) => {
  try {
    return JSON.parse(dataString);
  } catch (error) {
    console.error('Error deserializing data:', error);
    return null;
  }
};

// Utility Functions
const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Export all helpers
export default {
  formatTime,
  formatDate,
  getTimeDifference,
  haversineDistance,
  formatDistance,
  calculateETA,
  validateAlarmTime,
  getAlarmOptions,
  capitalizeFirst,
  truncateText,
  formatStudentId,
  isValidEmail,
  isValidPhone,
  isValidStudentId,
  generateRandomId,
  formatNumber,
  getThemeColor,
  getFontSize,
  serializeData,
  deserializeData,
  debounce,
  throttle,
};