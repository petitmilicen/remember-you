import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from '../auth/authService';

const api = axios.create({
    baseURL: 'http://192.168.1.84:8000/',
    timeout: 5000,
    headers: {"Content-Type": "application/json"}
});

api.interceptors.request.use(async (config) => {
    const accessToken = await AsyncStorage.getItem('access');
    if (accessToken) {
        config.headers.Authorization = `JWT ${accessToken}`;
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
        const newAccess = await refreshAccessToken();
        if (newAccess) {
          originalRequest.headers.Authorization = `JWT ${newAccess}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error('Error at getting new token:', err);
      }

      await AsyncStorage.removeItem('access');
      await AsyncStorage.removeItem('refresh');
    }

    return Promise.reject(error);
  }
);

export default api;