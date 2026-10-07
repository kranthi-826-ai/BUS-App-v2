import * as Location from 'expo-location';
import { getAccessToken } from '../api/secure';
import { enqueueLocation, readQueue, removeUploaded } from './locationQueue';
const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
export async function publishCurrentLocation(tripId: string, deviceId: string): Promise<void> {
  const permission = await Location.getForegroundPermissionsAsync();
  if (permission.status !== Location.PermissionStatus.GRANTED) throw new Error('Location permission is required');
  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  await enqueueLocation({latitude:position.coords.latitude,longitude:position.coords.longitude,capturedAt:new Date(position.timestamp).toISOString(),speed:position.coords.speed ?? 0,heading:position.coords.heading ?? 0,accuracy:position.coords.accuracy ?? 999});
  const token = await getAccessToken();
  if (!token) throw new Error('Sign in again');
  const points = await readQueue();
  const response = await fetch(`${API_URL}/api/v1/trips/${tripId}/locations/batch`, { method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body:JSON.stringify({deviceId,points}) });
  if (!response.ok) throw new Error('Location queued; upload will retry');
  await removeUploaded(points.length);
}
