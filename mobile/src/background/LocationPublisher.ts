import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitLocations } from '../api/trip';

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

const TRACKING_SESSION_KEY = 'active_location_tracking_session';
const LOCATION_DEVICE_ID_KEY = 'location_device_id';
const LOCATION_SEQUENCE_KEY = 'location_sequence';
const MAX_QUEUED_POINTS = 100;
const LOCATION_BATCH_SIZE = 20;
let isQueueSyncInProgress = false;

interface TrackingSession {
    tripId: string;
    deviceId: string;
}

export const startLocationTracking = async (tripId: string) => {
    if (!(await TaskManager.isAvailableAsync())) {
        throw new Error('Background location requires an installed development or release build.');
    }
    if (!(await Location.hasServicesEnabledAsync())) {
        throw new Error('Enable device location services before starting a trip.');
    }

    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== 'granted') throw new Error('Foreground permission denied');

    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== 'granted') throw new Error('Background permission denied');

    const session = { tripId, deviceId: await getOrCreateDeviceId() };
    await AsyncStorage.setItem(TRACKING_SESSION_KEY, JSON.stringify(session));

    try {
        if (!(await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME))) {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: Location.Accuracy.High,
                timeInterval: 5000,
                distanceInterval: 10,
                foregroundService: {
                    notificationTitle: 'Smart Bus trip in progress',
                    notificationBody: 'Your bus location is being shared with enrolled students.',
                    notificationColor: '#155e4b',
                    killServiceOnDestroy: true,
                },
            });
        }
    } catch (error) {
        await AsyncStorage.removeItem(TRACKING_SESSION_KEY);
        throw error;
    }
};

export const stopLocationTracking = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (isRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
    const sessionValue = await AsyncStorage.getItem(TRACKING_SESSION_KEY);
    if (sessionValue) {
        const session = JSON.parse(sessionValue) as TrackingSession;
        await syncOfflineQueue(session);
    }
    await AsyncStorage.removeItem(TRACKING_SESSION_KEY);
};

const getOrCreateDeviceId = async (): Promise<string> => {
    const existingId = await AsyncStorage.getItem(LOCATION_DEVICE_ID_KEY);
    if (existingId) return existingId;
    const deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    await AsyncStorage.setItem(LOCATION_DEVICE_ID_KEY, deviceId);
    return deviceId;
};

const getNextSequence = async (): Promise<number> => {
    const sequence = Number(await AsyncStorage.getItem(LOCATION_SEQUENCE_KEY) ?? '0') + 1;
    await AsyncStorage.setItem(LOCATION_SEQUENCE_KEY, String(sequence));
    return sequence;
};

const getOfflineQueue = async (): Promise<LocationPoint[]> => {
    const data = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveOfflineQueue = async (queue: LocationPoint[]) => {
    const bounded = queue.slice(-MAX_QUEUED_POINTS);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(bounded));
};

const syncOfflineQueue = async (session?: TrackingSession) => {
    if (isQueueSyncInProgress) return;
    isQueueSyncInProgress = true;
    let queue: LocationPoint[] = [];
    try {
        queue = await getOfflineQueue();
        while (queue.length > 0) {
            let activeSession = session;
            if (!activeSession) {
                const sessionValue = await AsyncStorage.getItem(TRACKING_SESSION_KEY);
                if (!sessionValue) return;
                activeSession = JSON.parse(sessionValue) as TrackingSession;
            }
            const points = queue.filter((point) => point.tripId === activeSession.tripId && point.deviceId === activeSession.deviceId).slice(0, LOCATION_BATCH_SIZE);
            if (points.length === 0) return;

            try {
                await submitLocations(activeSession.tripId, activeSession.deviceId, points);
                const sentSequences = new Set(points.map((point) => point.sequenceNum));
                queue = queue.filter((point) => !sentSequences.has(point.sequenceNum));
                await saveOfflineQueue(queue);
            } catch (e) {
                console.warn('Failed to sync location updates; queued points will retry.', e);
                return;
            }
        }
    } finally {
        isQueueSyncInProgress = false;
    }
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Location task error', error);
        return;
    }
    
    if (typeof data === 'object' && data !== null && 'locations' in data && Array.isArray(data.locations)) {
        const sessionValue = await AsyncStorage.getItem(TRACKING_SESSION_KEY);
        if (!sessionValue) return;
        const session = JSON.parse(sessionValue) as TrackingSession;
        const validPoints: LocationPoint[] = [];

        for (const location of data.locations) {
            if (location.coords.accuracy != null && location.coords.accuracy > 100) continue;
            validPoints.push({
                tripId: session.tripId,
                deviceId: session.deviceId,
                sequenceNum: await getNextSequence(),
                capturedTime: new Date(location.timestamp).toISOString(),
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy ?? undefined,
                speed: location.coords.speed ?? undefined,
                heading: location.coords.heading ?? undefined,
            });
        }

        if (validPoints.length === 0) return;

        const queue = await getOfflineQueue();
        const updatedQueue = [...queue, ...validPoints];
        
        await saveOfflineQueue(updatedQueue);
        await syncOfflineQueue();
    }
});
