import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/index';

const LOCATION_TASK_NAME = 'background-location-task';
const OFFLINE_QUEUE_KEY = 'location_offline_queue';

interface LocationPoint {
    tripId: string;
    deviceId: string;
    sequenceNum: number;
    capturedTime: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
}

// Global states to inject into the task (not reliable across reloads, but good enough for active tracking in-memory)
let currentTripId: string | null = null;
let currentDeviceId: string = "device-" + Math.random().toString(36).substring(7); // In reality, use Application.androidId
let sequenceCounter = 0;

export const startLocationTracking = async (tripId: string) => {
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== 'granted') throw new Error('Foreground permission denied');

    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== 'granted') throw new Error('Background permission denied');

    currentTripId = tripId;
    sequenceCounter = 0;

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
        foregroundService: {
            notificationTitle: 'Smart Bus',
            notificationBody: 'Sharing live location with students',
            notificationColor: '#007bff'
        }
    });
};

export const stopLocationTracking = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (isRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
    currentTripId = null;
    await syncOfflineQueue();
};

const getOfflineQueue = async (): Promise<LocationPoint[]> => {
    const data = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveOfflineQueue = async (queue: LocationPoint[]) => {
    // Bound the queue to latest 100 points
    const bounded = queue.slice(-100);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(bounded));
};

const syncOfflineQueue = async () => {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return;

    try {
        await api.post('/trip/locations/batch', { points: queue });
        await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch (e) {
        console.warn('Failed to sync offline queue, will retry later', e);
    }
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Location task error', error);
        return;
    }
    
    if (data && (data as any).locations) {
        const locations = (data as any).locations;
        const newPoints: LocationPoint[] = locations.map((loc: any) => {
            sequenceCounter++;
            return {
                tripId: currentTripId,
                deviceId: currentDeviceId,
                sequenceNum: sequenceCounter,
                capturedTime: new Date(loc.timestamp).toISOString(),
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                accuracy: loc.coords.accuracy,
                speed: loc.coords.speed,
                heading: loc.coords.heading
            };
        });

        // Filter out if tripId is somehow missing
        const validPoints = newPoints.filter(p => p.tripId);
        if (validPoints.length === 0) return;

        const queue = await getOfflineQueue();
        const updatedQueue = [...queue, ...validPoints];
        
        await saveOfflineQueue(updatedQueue);
        await syncOfflineQueue();
    }
});
