import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'https://movebuddy-db.onrender.com';

export type StoredUser = { id: number; name: string; email: string };

export const session = {
  async save(token: string, user: StoredUser) {
    await SecureStore.setItemAsync('jwt_token', token);
    await SecureStore.setItemAsync('movebuddy_user', JSON.stringify(user));
  },
  async user(): Promise<StoredUser | null> {
    const value = await SecureStore.getItemAsync('movebuddy_user');
    return value ? JSON.parse(value) as StoredUser : null;
  },
  async clear() {
    await Promise.all([
      SecureStore.deleteItemAsync('jwt_token'),
      SecureStore.deleteItemAsync('movebuddy_user'),
    ]);
  },
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const readableError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.response?.data?.error;
    if (typeof message === 'string') return message;
    if (!error.response) return 'Ne možemo dosegnuti poslužitelj. Provjerite internetsku vezu i pokušajte ponovno.';
  }
  return fallback;
};

export default api;