/**
 * Push Notifications Utility
 * Handles registration and management of Expo push notifications
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from '../api/axiosInstance';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
    }),
});

/**
 * Register for push notifications and get Expo push token
 * @returns {Promise<string|null>} Expo push token or null if failed
 */
export async function registerForPushNotificationsAsync() {
    let token = null;

    if (Device.isDevice) {
        // Request permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('❌ Failed to get push token: Permission denied');
            return null;
        }

        // Get the token
        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('✅ Push token obtained:', token);
        } catch (error) {
            console.error('❌ Error getting push token:', error);
            return null;
        }

        // Android-specific channel configuration for emergency alerts
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('emergency-alerts', {
                name: 'Alertas de Emergencia',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF0000',
                sound: 'default',
            });
        }
    } else {
        console.log('❌ Must use physical device for Push Notifications');
    }

    return token;
}

/**
 * Send push token to backend
 * @param {string} token - Expo push token
 * @returns {Promise<boolean>} Success status
 */
export async function savePushTokenToBackend(token) {
    if (!token) return false;

    try {
        await api.post('/api/user-data/register-push-token/', {
            push_token: token,
        });
        console.log('✅ Push token saved to backend');
        return true;
    } catch (error) {
        console.error('❌ Error saving push token to backend:', error);
        return false;
    }
}

/**
 * Setup push notifications for the app
 * Call this on app startup (caregiver only)
 * @returns {Promise<string|null>} Push token if successful
 */
export async function setupPushNotifications() {
    const token = await registerForPushNotificationsAsync();

    if (token) {
        await savePushTokenToBackend(token);
    }

    return token;
}

/**
 * Add notification received listener
 * @param {Function} callback - Function to call when notification is received
 * @returns {Subscription} Notification subscription
 */
export function addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add notification response listener (when user taps notification)
 * @param {Function} callback - Function to call when notification is tapped
 * @returns {Subscription} Notification subscription
 */
export function addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
}
