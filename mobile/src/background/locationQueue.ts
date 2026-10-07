import AsyncStorage from '@react-native-async-storage/async-storage';

export type QueuedLocation = {
  latitude: number;
  longitude: number;
  capturedAt: string;
  speed: number;
  heading: number;
  accuracy: number;
};

const KEY = 'smartbus.pendingLocations.v1';
const MAX_POINTS = 500;

export async function enqueueLocation(point: QueuedLocation): Promise<void> {
  const items = await readQueue();
  items.push(point);
  await AsyncStorage.setItem(KEY, JSON.stringify(items.slice(-MAX_POINTS)));
}

export async function readQueue(): Promise<QueuedLocation[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as QueuedLocation[] : [];
  } catch {
    await AsyncStorage.removeItem(KEY);
    return [];
  }
}

export async function removeUploaded(count: number): Promise<void> {
  const items = await readQueue();
  await AsyncStorage.setItem(KEY, JSON.stringify(items.slice(count)));
}
