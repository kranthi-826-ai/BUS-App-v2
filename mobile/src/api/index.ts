import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../storage/secureStore';

// Assuming local dev server IP (change if running on device)
const BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) throw new Error('No refresh token');

                const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
                const { accessToken, refreshToken: newRefreshToken, role } = response.data;

                await saveTokens(accessToken, newRefreshToken, role);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (e) {
                await clearTokens();
                // We should also dispatch a global event or context update to log the user out
            }
        }
        return Promise.reject(error);
    }
);
