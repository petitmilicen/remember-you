/**
 * Token Refresh Utility
 * Separated from authService to avoid circular dependency with axiosInstance
 */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.87:8000/';

/**
 * Refresh access token using refresh token
 * @returns {Promise<string|null>} New access token or null
 */
export async function refreshAccessToken() {
    const refresh = await AsyncStorage.getItem('refresh');

    if (!refresh) {
        console.log('No refresh token available');
        return null;
    }

    try {
        // Use raw axios (NOT api instance) to avoid circular dependency
        const response = await axios.post(`${BASE_URL}auth/jwt/refresh/`, { refresh });
        const { access } = response.data;

        await AsyncStorage.setItem('access', access);
        console.log('✅ Access token refreshed successfully');
        return access;
    } catch (error) {
        console.error('❌ Could not refresh token:', error.response?.data || error.message);
        return null;
    }
}
