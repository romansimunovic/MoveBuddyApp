import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// učitava URL iz zaštićenih okolišnih varijabli (.env)
// Ako iz nekog razloga nije učitan, stavljamo tvoj Render URL kao zadani (fallback)
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://movebuddy-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Prije svakog HTTP zahtjeva, automatski lijepi JWT token u zaglavlje
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Greška prilikom dohvaćanja JWT tokena iz SecureStore-a:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;