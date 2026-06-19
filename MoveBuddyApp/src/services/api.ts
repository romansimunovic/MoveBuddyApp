import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 10.0.2.2 je Android IP za tvoj lokalni Spring Boot (localhost:8080)
const API_URL = 'http://172.20.10.2:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Prije svakog zahtjeva, provjeri imamo li JWT token i dodaj ga
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;