import api from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = async (userData) => {
  try {
    const response = await api.post("auth/users/", userData);
    return response.data;
  } catch (error) {
    console.error("Error en register:", error.response?.data || error);
    throw error;
  }
};

export const login = async (email, password) => {
  const response = await api.post('auth/jwt/create/', { email, password });

  const { access, refresh } = response.data;

  await AsyncStorage.setItem('access', access);
  await AsyncStorage.setItem('refresh', refresh);
  return response.data;
};

export const logout = async () => {
  try {
    const access = await AsyncStorage.getItem('access');

    if (access) {
      await api.post(
        '/auth/token/logout/',
        {},
        { headers: { Authorization: `JWT ${access}` } }
      );
    }

    console.log('Usuario desconectado correctamente');
  } catch (error) {
    console.error('Error al cerrar sesión', error);
  } finally {
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
  }
};

export const refreshAccessToken = async () => {
  const refresh = await AsyncStorage.getItem('refresh');
  
  if (!refresh) return null;

  try {
    const response = await api.post('auth/jwt/refresh/', { refresh });
    const { access } = response.data;
    await AsyncStorage.setItem('access', access);
    return access;
  } catch (error) {
    console.error('No se pudo refrescar el token:', error);
    return null;
  }
};

