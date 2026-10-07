import * as SecureStore from 'expo-secure-store';
const TOKEN_KEY = 'smartbus.access-token';
export const saveAccessToken = (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const getAccessToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const clearAccessToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);
