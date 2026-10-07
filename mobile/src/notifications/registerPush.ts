import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { registerPushToken } from '../api/client';
import { getAccessToken } from '../api/secure';

export async function registerForPushNotifications(): Promise<string> {
  if (!Device.isDevice) throw new Error('Push notifications require a physical device');
  const current = await Notifications.getPermissionsAsync();
  const permission = current.status === 'granted' ? current : await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') throw new Error('Notification permission was not granted');
  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  if (!projectId) throw new Error('EXPO_PUBLIC_EAS_PROJECT_ID is required');
  return (await Notifications.getExpoPushTokenAsync({projectId})).data;
}

export async function showArrivalAlarm(title: string, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({content:{title,body,sound:'default'},trigger:null});
}

export async function registerPushWithBackend(): Promise<void> {
  const [expoPushToken,accessToken]=await Promise.all([registerForPushNotifications(),getAccessToken()]);
  if(!accessToken) throw new Error('Sign in again');
  await registerPushToken(accessToken,expoPushToken);
}
