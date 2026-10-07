import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { enqueueLocation } from './locationQueue';

export const DRIVER_LOCATION_TASK = 'smartbus-driver-location';

TaskManager.defineTask(DRIVER_LOCATION_TASK, async ({data,error}) => {
  if (error || !data) return;
  const locations=(data as {locations: Location.LocationObject[]}).locations;
  for(const item of locations) await enqueueLocation({latitude:item.coords.latitude,longitude:item.coords.longitude,capturedAt:new Date(item.timestamp).toISOString(),speed:item.coords.speed ?? 0,heading:item.coords.heading ?? 0,accuracy:item.coords.accuracy ?? 999});
});

export async function startBackgroundDriverLocation(): Promise<void> {
  const foreground=await Location.requestForegroundPermissionsAsync();
  if(foreground.status!=='granted') throw new Error('Foreground location permission is required');
  const background=await Location.requestBackgroundPermissionsAsync();
  if(background.status!=='granted') throw new Error('Background location permission is required');
  if(await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK)) return;
  await Location.startLocationUpdatesAsync(DRIVER_LOCATION_TASK,{accuracy:Location.Accuracy.High,timeInterval:10000,distanceInterval:20,foregroundService:{notificationTitle:'Bus trip active',notificationBody:'Sharing the bus location with subscribed students'}});
}

export async function stopBackgroundDriverLocation(): Promise<void> {
  if(await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK)) await Location.stopLocationUpdatesAsync(DRIVER_LOCATION_TASK);
}
