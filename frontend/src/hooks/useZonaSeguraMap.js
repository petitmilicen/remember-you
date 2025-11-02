import { useState, useEffect, useRef } from "react";
import { Alert, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useZonaSegura() {
  const [centro, setCentro] = useState(null);
  const [radio, setRadio] = useState(200);
  const [guardado, setGuardado] = useState(false);
  const [ubicacionPaciente, setUbicacionPaciente] = useState(null);
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
          setCentro(data.centro);
          setRadio(data.radio);
          setGuardado(true);
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
      await AsyncStorage.setItem("zonaSegura", JSON.stringify({ centro, radio }));
      setGuardado(true);
      mostrarMensaje("✅ Zona guardada correctamente", "#2E7D32");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la zona segura.");
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

  // Simula movimiento del paciente
  useEffect(() => {
    let interval;
    if (centro) {
      const mover = async () => {
        const nuevaPos = {
          latitude: centro.latitude + (Math.random() - 0.5) * 0.002,
          longitude: centro.longitude + (Math.random() - 0.5) * 0.002,
        };
        setUbicacionPaciente(nuevaPos);
        await AsyncStorage.setItem("ubicacionPaciente", JSON.stringify(nuevaPos));
      };
      mover();
      interval = setInterval(mover, 5000);
    }
    return () => clearInterval(interval);
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
  };
}
