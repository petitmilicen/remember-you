import { useEffect, useContext } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { AuthContext } from "../../auth/AuthContext";
import * as Location from 'expo-location';
import { LOCATION_TASK_NAME, GEOFENCING_TASK_NAME } from '../../utils/locationTask';

export default function LogoutScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const doLogout = async () => {
      try {
        await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME).catch(() => { });
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => { });
        console.log('[Logout] Tracking detenido correctamente');
      } catch (error) {
        console.error('[Logout] Error deteniendo tracking:', error);
      }

      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    };

    doLogout();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#000" />
      <Text>Cerrando sesión...</Text>
    </View>
  );
}
