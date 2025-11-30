import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from '../auth/refreshToken';
import authManager from '../auth/authManager';

const api = axios.create({
  baseURL: 'http://192.168.1.87:8000/',
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
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

      // Verificar si el usuario está haciendo logout intencional
      const isLoggingOut = await AsyncStorage.getItem('isLoggingOut');

      if (isLoggingOut === 'true') {
        console.log('🔓 Sesión cerrada por el usuario');
        await AsyncStorage.removeItem('isLoggingOut');
        return Promise.reject(error);
      }

      try {
        const newAccess = await refreshAccessToken();
        if (newAccess) {
          originalRequest.headers.Authorization = `JWT ${newAccess}`;
          return api(originalRequest);
        } else {
          console.log('⏰ Sesión expirada - Por favor inicia sesión nuevamente');
          // Notificar al AuthContext que la sesión expiró
          authManager.notifySessionExpired('Token inválido o expirado');
        }
      } catch (err) {
        console.error('❌ Error al renovar token:', err);
        // Notificar al AuthContext que hubo un error al renovar
        authManager.notifySessionExpired('Error al renovar token');
      }

      await AsyncStorage.removeItem('access');
      await AsyncStorage.removeItem('refresh');
    }

    return Promise.reject(error);
  }
);

export default api;