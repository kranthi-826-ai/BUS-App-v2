import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Storage keys
const STORAGE_KEYS = {
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

class StorageService {
  constructor() {
    this.initialized = false;
  }

  // Initialize storage service
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Check if first launch
      const firstLaunch = await this.isFirstLaunch();
      if (firstLaunch) {
        await this.setDefaultSettings();
      }
      
      this.initialized = true;
      console.log('Storage service initialized');
    } catch (error) {
      console.error('Error initializing storage service:', error);
    }
  }

  // Check if first app launch
  async isFirstLaunch() {
    try {
      const firstLaunch = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      return firstLaunch === null;
    } catch (error) {
      console.error('Error checking first launch:', error);
      return true;
    }
  }

  // Set default app settings
  async setDefaultSettings() {
    try {
      const defaultSettings = {
        language: 'en',
        theme: 'light',
        notifications: true,
        vibration: true,
        sound: true,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(defaultSettings));
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
      
      console.log('Default settings saved');
    } catch (error) {
      console.error('Error setting default settings:', error);
    }
  }

  // USER DATA METHODS

  // Save user data
  async saveUserData(userData) {
    try {
      const dataToSave = {
        ...userData,
        lastLogin: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(dataToSave));
      console.log('User data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  // Get user data
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Clear user data (logout)
  async clearUserData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.BUS_SETTINGS,
        STORAGE_KEYS.ALARM_SETTINGS,
      ]);
      console.log('User data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  }

  // BUS SETTINGS METHODS

  // Save bus settings
  async saveBusSettings(busSettings) {
    try {
      const settingsToSave = {
        ...busSettings,
        lastUpdated: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.BUS_SETTINGS, JSON.stringify(settingsToSave));
      console.log('Bus settings saved');
      return true;
    } catch (error) {
      console.error('Error saving bus settings:', error);
      return false;
    }
  }

  // Get bus settings
  async getBusSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.BUS_SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error getting bus settings:', error);
      return null;
    }
  }

  // ALARM SETTINGS METHODS

  // Save alarm settings
  async saveAlarmSettings(alarmSettings) {
    try {
      const settingsToSave = {
        ...alarmSettings,
        created: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.ALARM_SETTINGS, JSON.stringify(settingsToSave));
      console.log('Alarm settings saved');
      return true;
    } catch (error) {
      console.error('Error saving alarm settings:', error);
      return false;
    }
  }

  // Get alarm settings
  async getAlarmSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.ALARM_SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error getting alarm settings:', error);
      return null;
    }
  }

  // TRACKING HISTORY METHODS

  // Save tracking session
  async saveTrackingSession(sessionData) {
    try {
      const session = {
        ...sessionData,
        id: this.generateId(),
        timestamp: new Date().toISOString(),
      };

      // Get existing history
      const existingHistory = await this.getTrackingHistory();
      const updatedHistory = [session, ...existingHistory].slice(0, 100); // Keep last 100 sessions

      await AsyncStorage.setItem(STORAGE_KEYS.TRACKING_HISTORY, JSON.stringify(updatedHistory));
      console.log('Tracking session saved');
      return session.id;
    } catch (error) {
      console.error('Error saving tracking session:', error);
      return null;
    }
  }

  // Get tracking history
  async getTrackingHistory(limit = 50) {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_HISTORY);
      const sessions = history ? JSON.parse(history) : [];
      return sessions.slice(0, limit);
    } catch (error) {
      console.error('Error getting tracking history:', error);
      return [];
    }
  }

  // Clear tracking history
  async clearTrackingHistory() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TRACKING_HISTORY);
      console.log('Tracking history cleared');
      return true;
    } catch (error) {
      console.error('Error clearing tracking history:', error);
      return false;
    }
  }

  // PREFERENCES METHODS

  // Save user preferences
  async saveUserPreferences(preferences) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      console.log('User preferences saved');
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  }

  // Get user preferences
  async getUserPreferences() {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (preferences) {
        return JSON.parse(preferences);
      }
      
      // Return defaults if no preferences saved
      return {
        language: 'en',
        theme: 'light',
        notifications: true,
        vibration: true,
        sound: true,
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  // SECURE STORAGE METHODS (for sensitive data)

  // Save secure data (tokens, passwords)
  async saveSecureData(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      console.error('Error saving secure data:', error);
      return false;
    }
  }

  // Get secure data
  async getSecureData(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting secure data:', error);
      return null;
    }
  }

  // Delete secure data
  async deleteSecureData(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('Error deleting secure data:', error);
      return false;
    }
  }

  // APP SETTINGS METHODS

  // Save language preference
  async saveLanguage(language) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      return true;
    } catch (error) {
      console.error('Error saving language:', error);
      return false;
    }
  }

  // Get language preference
  async getLanguage() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    } catch (error) {
      console.error('Error getting language:', error);
      return 'en';
    }
  }

  // Save theme preference
  async saveTheme(theme) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
      return true;
    } catch (error) {
      console.error('Error saving theme:', error);
      return false;
    }
  }

  // Get theme preference
  async getTheme() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    } catch (error) {
      console.error('Error getting theme:', error);
      return 'light';
    }
  }

  // NOTIFICATION SETTINGS

  // Save notification settings
  async saveNotificationSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return false;
    }
  }

  // Get notification settings
  async getNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      return settings ? JSON.parse(settings) : {
        enabled: true,
        sound: true,
        vibration: true,
        led: true,
        priority: 'high',
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return null;
    }
  }

  // UTILITY METHODS

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get storage statistics
  async getStorageStats() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stats = {
        totalKeys: keys.length,
        totalSize: 0,
        keyDetails: [],
      };

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        const size = value ? new Blob([value]).size : 0;
        stats.totalSize += size;
        stats.keyDetails.push({
          key,
          size,
          hasValue: value !== null,
        });
      }

      return stats;
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return null;
    }
  }

  // Clear all storage (debug/cleanup)
  async clearAllStorage() {
    try {
      await AsyncStorage.clear();
      console.log('All storage cleared');
      return true;
    } catch (error) {
      console.error('Error clearing all storage:', error);
      return false;
    }
  }

  // Backup data (export)
  async exportData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = {};

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        data[key] = value;
      }

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  // Restore data (import)
  async importData(backupData) {
    try {
      const data = JSON.parse(backupData);
      
      for (const [key, value] of Object.entries(data)) {
        if (value !== null) {
          await AsyncStorage.setItem(key, value);
        }
      }

      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Check storage availability
  async checkStorageAvailability() {
    try {
      const testKey = 'storage_test';
      const testValue = 'test_value';
      
      await AsyncStorage.setItem(testKey, testValue);
      const retrievedValue = await AsyncStorage.getItem(testKey);
      await AsyncStorage.removeItem(testKey);
      
      return retrievedValue === testValue;
    } catch (error) {
      console.error('Storage availability check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const storageService = new StorageService();

// Initialize on import
storageService.initialize();

export default storageService;