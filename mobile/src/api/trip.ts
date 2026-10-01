import { api } from './index';

export const startTrip = async (busId: string, routeId: string) => {
    const response = await api.post('/trip/start', { busId, routeId });
    return response.data; // Should return { id: 'trip-id' }
};

export const endTrip = async (tripId: string) => {
    await api.post(`/trip/${tripId}/end`);
};

export const getLatestLocation = async (busId: string) => {
    const response = await api.get(`/trip/locations/latest/${busId}`);
    return response.data;
};
