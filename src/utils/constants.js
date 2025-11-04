// App Constants
export const APP_CONSTANTS = {
  APP_NAME: 'BusAlarm',
  VERSION: '1.0.0',
  DEVELOPER: 'Student Team',
  SUPPORT_EMAIL: 'support@busalarm.com',
  WEBSITE: 'https://busalarm.com',
};

// Navigation Constants
export const NAVIGATION = {
  SCREENS: {
    LANGUAGE: 'Language',
    LOGIN: 'Login',
    SIGNUP: 'Signup',
    UNIVERSITY_SELECTION: 'UniversitySelection',
    BUS_SELECTION: 'BusSelection',
    STOP_SELECTION: 'StopSelection',
    ALARM_SETUP: 'AlarmSetup',
    TRACKING: 'Tracking',
    PROFILE: 'Profile',
  },
  PARAMS: {
    UNIVERSITY: 'university',
    BUS: 'bus',
    STOP: 'stop',
    ALARM_TIME: 'alarmTime',
  }
};

// Alarm Constants
export const ALARM_CONSTANTS = {
  MIN_ALARM_TIME: 5, // minutes
  MAX_ALARM_TIME: 30, // minutes
  DEFAULT_ALARM_TIME: 15, // minutes
  ALARM_OPTIONS: [5, 10, 15, 20, 25, 30],
  SNOOZE_TIME: 5, // minutes
};

// Notification Constants
export const NOTIFICATION_CONSTANTS = {
  CHANNELS: {
    BUS_ALERTS: 'bus-alerts',
    GENERAL: 'general',
    EMERGENCY: 'emergency',
  },
  TYPES: {
    BUS_ARRIVAL: 'bus_arrival',
    BUS_APPROACHING: 'bus_approaching',
    SERVICE_UPDATE: 'service_update',
    EMERGENCY: 'emergency',
  }
};

// Location Constants
export const LOCATION_CONSTANTS = {
  UPDATE_INTERVAL: 5000, // 5 seconds
  DISTANCE_INTERVAL: 10, // meters
  ACCURACY: 'balanced',
  ALERT_RADIUS: 0.5, // kilometers
  WALKING_SPEED: 5, // km/h
  BUS_AVERAGE_SPEED: 30, // km/h
};

// Storage Constants
export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  USER_PREFERENCES: 'user_preferences',
  BUS_SETTINGS: 'bus_settings',
  ALARM_SETTINGS: 'alarm_settings',
  TRACKING_HISTORY: 'tracking_history',
  NOTIFICATION_SETTINGS: 'notification_settings',
  LANGUAGE: 'app_language',
  THEME: 'app_theme',
  FIRST_LAUNCH: 'first_launch',
};

// API Constants (if using backend)
export const API_CONSTANTS = {
  BASE_URL: 'https://api.busalarm.com/v1',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    BUS_LOCATION: '/buses/location',
    BUS_ROUTES: '/buses/routes',
    NOTIFICATIONS: '/notifications',
  },
  TIMEOUT: 10000, // 10 seconds
};

// Theme Constants
export const THEME_CONSTANTS = {
  COLORS: {
    PRIMARY: '#1e90ff',
    SECONDARY: '#ff6b35',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
    WHITE: '#ffffff',
    BLACK: '#000000',
    GRAY: '#6c757d',
  },
  FONTS: {
    REGULAR: 'System',
    BOLD: 'System',
    LIGHT: 'System',
  },
  SIZES: {
    SMALL: 12,
    MEDIUM: 16,
    LARGE: 20,
    XLARGE: 24,
    XXLARGE: 32,
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
};

// Language Constants
export const LANGUAGE_CONSTANTS = {
  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  ],
  DEFAULT_LANGUAGE: 'en',
};

// University Constants
export const UNIVERSITY_CONSTANTS = {
  SUPPORTED_UNIVERSITIES: [
    { code: 'JNTUH', name: 'JNTU Hyderabad', location: 'Hyderabad' },
    { code: 'OU', name: 'Osmania University', location: 'Hyderabad' },
    { code: 'KU', name: 'Kakatiya University', location: 'Warangal' },
    { code: 'AU', name: 'Andhra University', location: 'Visakhapatnam' },
    { code: 'SVU', name: 'Sri Venkateswara University', location: 'Tirupati' },
    { code: 'LPU', name: 'Lovely Professional University', location: 'Punjab' },
    { code: 'VIT', name: 'VIT University', location: 'Vellore' },
    { code: 'SRM', name: 'SRM University', location: 'Chennai' },
  ],
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  LOCATION_ERROR: 'Unable to access location. Please enable location services.',
  NOTIFICATION_ERROR: 'Unable to send notifications. Please check app permissions.',
  LOGIN_ERROR: 'Invalid student ID or password.',
  SIGNUP_ERROR: 'Error creating account. Please try again.',
  BUS_CODE_ERROR: 'Invalid bus code. Please check with transport incharge.',
  GENERAL_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  BUS_CODE_SUCCESS: 'Bus code verified successfully!',
  ALARM_SET_SUCCESS: 'Alarm set successfully!',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
};

export default {
  APP_CONSTANTS,
  NAVIGATION,
  ALARM_CONSTANTS,
  NOTIFICATION_CONSTANTS,
  LOCATION_CONSTANTS,
  STORAGE_KEYS,
  API_CONSTANTS,
  THEME_CONSTANTS,
  LANGUAGE_CONSTANTS,
  UNIVERSITY_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};