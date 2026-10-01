import { api } from './index';

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const logout = async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken });
};
