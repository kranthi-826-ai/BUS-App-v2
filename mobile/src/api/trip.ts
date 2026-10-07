import { api } from './index';

export const startTrip = async (busId: string, routeId: string) => {
    const response = await api.post('/v1/trips', { busId, routeId });
    return response.data; // Should return { id: 'trip-id' }
};

export const endTrip = async (tripId: string) => {
    await api.post(`/v1/trips/${tripId}/end`);
};

export const pauseTrip = async (tripId: string) => {
    const response = await api.post(`/v1/trips/${tripId}/pause`);
    return response.data;
};

export const resumeTrip = async (tripId: string) => {
    const response = await api.post(`/v1/trips/${tripId}/resume`);
    return response.data;
};

export const getLatestLocation = async (tripId: string) => {
    const response = await api.get(`/v1/trips/${tripId}/locations/latest`);
    return response.data;
};

export const submitLocations = async (tripId: string, deviceId: string, points: unknown[]) => {
    await api.post(`/v1/trips/${tripId}/locations`, { deviceId, points });
};
