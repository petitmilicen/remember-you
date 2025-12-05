import { useState, useEffect, useRef } from "react";
import { Alert, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axiosInstance";

export default function useZonaSegura() {
  const [centro, setCentro] = useState(null);
  const [radio, setRadio] = useState(200);
  const [guardado, setGuardado] = useState(false);
  const [ubicacionPaciente, setUbicacionPaciente] = useState(null);
  const [historial, setHistorial] = useState([]); // Nuevo estado para el path
  const [mensaje, setMensaje] = useState(null);
  const [colorMensaje, setColorMensaje] = useState("#2E7D32");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  const regionInicial = {
    latitude: -33.45694,
    longitude: -70.64827,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("zonaSegura");
        if (stored) {
          const data = JSON.parse(stored);
          if (data.centro && data.centro.latitude !== undefined && data.centro.longitude !== undefined) {
            setCentro(data.centro);
            setRadio(data.radio || 200);
            setGuardado(true);
          }
        }
      } catch (error) {
        console.error("Error cargando zona segura:", error);
      }
    })();
  }, []);

  const seleccionarCentro = (e) => {
    setCentro(e.nativeEvent.coordinate);
    setGuardado(false);
  };

  const guardarZona = async () => {
    if (!centro) return;
    try {
      // 1. Guardar en Backend
      await api.post('/api/safe-zone/zone/', {
        latitude: parseFloat(centro.latitude.toFixed(6)),
        longitude: parseFloat(centro.longitude.toFixed(6)),
        radius_meters: Math.round(radio),
        address: "Zona Segura Personalizada"
      });

      // 2. Guardar Localmente (para acceso rápido y offline)
      await AsyncStorage.setItem("zonaSegura", JSON.stringify({ centro, radio }));

      setGuardado(true);
      mostrarMensaje("✅ Zona guardada correctamente", "#2E7D32");
    } catch (error) {
      console.error("Error guardando zona:", error);
      Alert.alert("Error", "No se pudo guardar la zona segura en el servidor.");
    }
  };

  const eliminarZona = async () => {
    try {
      await AsyncStorage.removeItem("zonaSegura");
      setCentro(null);
      setGuardado(false);
      mostrarMensaje("🗑️ Zona eliminada", "#C62828");
    } catch (error) {
      console.error("Error eliminando zona segura:", error);
    }
  };

  // 🔋 OPTIMIZACIÓN #2: Polling Inteligente - Frecuencia variable según estado
  useEffect(() => {
    let interval;
    if (centro) {
      const fetchLocation = async () => {
        try {
          const res = await api.get('/api/safe-zone/location/history/');
          const history = res.data;

          if (history && history.length > 0) {
            // La más reciente es la primera (según ordenamiento del backend)
            const latest = history[0];

            if (latest && latest.latitude !== undefined && latest.longitude !== undefined) {
              const nuevaPos = {
                latitude: parseFloat(latest.latitude),
                longitude: parseFloat(latest.longitude),
              };

              setUbicacionPaciente(nuevaPos);
              setHistorial(history.map(h => ({
                latitude: parseFloat(h.latitude),
                longitude: parseFloat(h.longitude)
              })));

              await AsyncStorage.setItem("ubicacionPaciente", JSON.stringify(nuevaPos));

              // 🔋 Ajustar intervalo dinámicamente según estado de zona
              const isOutOfZone = latest.is_out_of_zone;
              const nextInterval = isOutOfZone ? 5000 : 15000; // 5s fuera, 15s dentro

              console.log(`[Polling] Paciente ${isOutOfZone ? 'FUERA' : 'DENTRO'} - Próximo poll en ${nextInterval / 1000}s`);

              // Reprogramar con nuevo intervalo
              if (interval) clearInterval(interval);
              interval = setInterval(fetchLocation, nextInterval);
            }
          }
        } catch (error) {
          console.error("Error fetching location history:", error);
        }
      };

      fetchLocation(); // Primer fetch inmediato
      interval = setInterval(fetchLocation, 15000); // Empezar con 15s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [centro]);

  const pacienteFuera =
    centro && ubicacionPaciente
      ? Math.hypot(
        (ubicacionPaciente.latitude - centro.latitude) * 111000,
        (ubicacionPaciente.longitude - centro.longitude) * 111000
      ) > radio
      : false;

  const recentrar = () => {
    if (mapRef.current && centro)
      mapRef.current.animateToRegion(
        { ...centro, latitudeDelta: 0.01, longitudeDelta: 0.01 },
        800
      );
  };

  const mostrarMensaje = (texto, color) => {
    setMensaje(texto);
    setColorMensaje(color);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setMensaje(null));
      }, 1600);
    });
  };

  return {
    centro,
    setCentro,
    radio,
    setRadio,
    guardado,
    ubicacionPaciente,
    pacienteFuera,
    mensaje,
    colorMensaje,
    fadeAnim,
    regionInicial,
    mapRef,
    seleccionarCentro,
    guardarZona,
    eliminarZona,
    recentrar,
    historial,
  };
}
