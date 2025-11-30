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

  // Limpiar flag de logout al iniciar sesión
  await AsyncStorage.removeItem('isLoggingOut');

  return response.data;
};

export const logout = async () => {
  try {
    // Con JWT, simplemente eliminamos los tokens del cliente
    // No hay endpoint de logout porque JWT es stateless

    // Establecer flag para evitar intentos de refresh después del logout
    await AsyncStorage.setItem('isLoggingOut', 'true');

    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
    console.log('Usuario desconectado correctamente');
  } catch (error) {
    console.error('Error al cerrar sesión', error);
  }
};
