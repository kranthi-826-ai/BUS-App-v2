import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.isConfigured = false;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize notifications
  async initialize() {
    if (this.isConfigured) return true;

    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // Get Expo push token (for remote notifications)
      if (Device.isDevice) {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: 'your-expo-project-id', // You'll get this from Expo
        });
        console.log('Expo push token:', token);
        this.expoPushToken = token.data;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('bus-alerts', {
          name: 'Bus Arrival Alerts',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#1e90ff',
        });
      }

      this.isConfigured = true;
      console.log('Notification service initialized');
      return true;

    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  // Schedule a bus arrival alarm
  async scheduleBusAlarm({ 
    busNumber, 
    stopName, 
    minutesUntilArrival, 
    arrivalTime 
  }) {
    try {
      await this.initialize();

      const trigger = new Date(Date.now() + minutesUntilArrival * 60000);
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚍 Bus Arrival Alert!',
          body: `Bus ${busNumber} will arrive at ${stopName} in ${minutesUntilArrival} minutes`,
          data: { 
            type: 'bus_arrival',
            busNumber,
            stopName,
            minutesUntilArrival 
          },
          sound: 'default',
          priority: 'high',
          autoDismiss: false,
          sticky: true,
        },
        trigger,
      });

      console.log(`Bus alarm scheduled: ${notificationId}`);
      return notificationId;

    } catch (error) {
      console.error('Error scheduling bus alarm:', error);
      throw error;
    }
  }

  // Schedule immediate bus alert (for testing/demo)
  async scheduleImmediateBusAlert(busNumber, stopName, minutesAway) {
    try {
      await this.initialize();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚍 Bus Approaching!',
          body: `Bus ${busNumber} is ${minutesAway} minutes away from ${stopName}`,
          data: { 
            type: 'bus_approaching',
            busNumber,
            stopName,
            minutesAway 
          },
          sound: 'default',
          priority: 'max',
        },
        trigger: null, // Show immediately
      });

      return notificationId;

    } catch (error) {
      console.error('Error scheduling immediate alert:', error);
      throw error;
    }
  }

  // Schedule recurring bus reminder
  async scheduleDailyBusReminder(busNumber, stopName, departureTime) {
    try {
      await this.initialize();

      const [hours, minutes] = departureTime.split(':');
      const trigger = {
        hour: parseInt(hours),
        minute: parseInt(minutes),
        repeats: true,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Daily Bus Reminder',
          body: `Don't forget your ${busNumber} bus from ${stopName} is coming soon!`,
          data: { type: 'daily_reminder', busNumber, stopName },
          sound: 'default',
        },
        trigger,
      });

      return notificationId;

    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      throw error;
    }
  }

  // Cancel a specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`Cancelled notification: ${notificationId}`);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Set up notification listeners
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    // Listen for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      onNotificationReceived
    );

    // Listen for user interaction with notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      onNotificationResponse
    );

    return () => {
      // Cleanup function
      if (this.notificationListener) {
        Notifications.removeNotificationSubscription(this.notificationListener);
      }
      if (this.responseListener) {
        Notifications.removeNotificationSubscription(this.responseListener);
      }
    };
  }

  // Create custom notification sounds (if needed)
  async configureCustomSounds() {
    // You can add custom notification sounds here
    // This requires additional setup in app.json and sound files
  }

  // Badge management
  async setBadgeCount(count) {
    if (Platform.OS === 'ios') {
      await Notifications.setBadgeCountAsync(count);
    }
  }

  async getBadgeCount() {
    if (Platform.OS === 'ios') {
      return await Notifications.getBadgeCountAsync();
    }
    return 0;
  }

  // Emergency/important notifications
  async sendEmergencyAlert(message, busNumber) {
    try {
      await this.initialize();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 Bus Service Alert',
          body: message,
          data: { 
            type: 'emergency_alert',
            busNumber,
            message 
          },
          sound: 'default',
          priority: 'max',
        },
        trigger: null, // Show immediately
      });

      return notificationId;

    } catch (error) {
      console.error('Error sending emergency alert:', error);
      throw error;
    }
  }

  // Test notification (for development)
  async sendTestNotification() {
    try {
      await this.initialize();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification from BusAlarm App',
          data: { type: 'test' },
          sound: 'default',
        },
        trigger: null,
      });

      console.log('Test notification sent:', notificationId);
      return notificationId;

    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }

  // Check notification permissions
  async checkPermissions() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return 'undetermined';
    }
  }

  // Request permissions explicitly
  async requestPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return 'denied';
    }
  }

  // Cleanup
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;