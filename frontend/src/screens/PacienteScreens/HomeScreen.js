import React, { useEffect, useState } from "react";
import { View, StatusBar, ActivityIndicator, Text, BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from 'expo-location';
import { LOCATION_TASK_NAME, GEOFENCING_TASK_NAME } from '../../utils/locationTask';
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/axiosInstance';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import usePacienteHome from "../../hooks/usePacienteHome";
import HeaderPaciente from "../../components/paciente/HeaderPaciente";
import GridMenuPaciente from "../../components/paciente/GridMenuPaciente";
import { styles } from "../../styles/HomePacienteStyles";

export default function HomeScreenPaciente({ navigation }) {
  const insets = useSafeAreaInsets();
  const { fotoPerfil, nombrePaciente, theme, getFontSize, loading } = usePacienteHome();

  const [locationDebug, setLocationDebug] = useState(null);

  // Bloquear el botón de retroceso del sistema Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // 1. Obtener ubicación inicial inmediata (Foreground) con fallback
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          // Intentar obtener posición precisa con timeout
          let loc = await Promise.race([
            Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
          ]).catch(async () => {
            console.log("Timeout obteniendo posición precisa, usando última conocida...");
            return await Location.getLastKnownPositionAsync({});
          });

          if (loc && loc.coords) {
            setLocationDebug(loc.coords);

            // Enviar esta primera ubicación al backend inmediatamente (recortando decimales)
            await api.post('/api/safe-zone/location/update/', {
              latitude: parseFloat(loc.coords.latitude.toFixed(6)),
              longitude: parseFloat(loc.coords.longitude.toFixed(6)),
              is_out_of_zone: false
            });
          } else {
            setLocationDebug({ latitude: 0, longitude: 0 }); // Valor dummy para indicar fallo
          }
        }
      } catch (e) {
        console.error("Error getting initial location:", e);
      }
    })();
  }, []);


  // 2. Sincronizar Zona Segura para el tracking (Inicial + Periódica)
  useEffect(() => {
    const syncZone = async () => {
      try {
        const res = await api.get('/api/safe-zone/zone/');
        if (res.data && res.data.length > 0) {
          const zonaApi = res.data[0];
          // Adaptar formato API al formato local que espera locationTask
          const zonaLocal = {
            centro: {
              latitude: parseFloat(zonaApi.latitude),
              longitude: parseFloat(zonaApi.longitude)
            },
            radio: zonaApi.radius_meters
          };

          await AsyncStorage.setItem("zonaSegura", JSON.stringify(zonaLocal));

          // ✅ FIX CRÍTICO #1: Sync safe exit status periódicamente
          const newSalidaSegura = zonaApi.safe_exit_active || false;
          const oldSalidaSegura = await AsyncStorage.getItem("salidaSegura");

          // Solo actualizar si cambió
          if (oldSalidaSegura !== JSON.stringify(newSalidaSegura)) {
            await AsyncStorage.setItem("salidaSegura", JSON.stringify(newSalidaSegura));
            console.log(`[Sync] Salida Segura actualizada: ${newSalidaSegura}`);
          }
        }
      } catch (error) {
        console.error("Error syncing safe zone:", error);
      }
    };

    // Sync inicial
    syncZone();

    // ✅ FIX CRÍTICO #1: Sync periódico cada 30 segundos
    const interval = setInterval(syncZone, 30000);

    return () => clearInterval(interval);
  }, []);


  // 3. Iniciar Geofencing (Batería optimizada)
  useEffect(() => {
    (async () => {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === 'granted') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === 'granted') {

          // Obtener zona para configurar el Geofence
          const zonaStored = await AsyncStorage.getItem("zonaSegura");
          if (zonaStored) {
            const zona = JSON.parse(zonaStored);
            const region = {
              identifier: 'safe-zone',
              latitude: zona.centro.latitude,
              longitude: zona.centro.longitude,
              radius: zona.radio,
              notifyOnEnter: true,
              notifyOnExit: true,
            };

            // Iniciar Geofencing
            await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, [region])
              .then(() => console.log("Geofencing iniciado correctamente"))
              .catch(e => console.error("Error iniciando geofencing:", e));
          }
        }
      }
    })();
  }, []);

  // 4. Polling para actualizar la UI con la ubicación del background task
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const storedLoc = await AsyncStorage.getItem("ubicacionPaciente");
        if (storedLoc) {
          const { latitude, longitude } = JSON.parse(storedLoc);
          setLocationDebug({ latitude, longitude });
        }
      } catch (e) {
        // ignore
      }
    }, 2000); // Actualizar cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#0D0D0D" : "#F5F5F5" },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FEBA17" />
          <Text style={{ color: "#FEBA17", marginTop: 8 }}>Cargando perfil...</Text>
        </View>
      ) : (
        <>
          {/* Magic Header (Gradient is now internal) */}
          <HeaderPaciente
            navigation={navigation}
            fotoPerfil={fotoPerfil}
            nombrePaciente={nombrePaciente}
            theme={theme}
            getFontSize={getFontSize}
            insets={insets}
          />

          {/* Bento Grid Content */}
          <View style={{ flex: 1 }}>
            <GridMenuPaciente
              navigation={navigation}
              theme={theme}
              getFontSize={getFontSize}
            />
          </View>
        </>
      )}
    </View>
  );
}
