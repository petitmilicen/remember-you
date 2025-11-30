// src/hooks/useZonaSegura.js
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Vibration, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calcularDistancia } from "../utils/helpers";
import useAudioAlert from "./useAudioAlert";
import api from "../api/axiosInstance";

/**
 * Hook que controla la zona segura, las alertas, la distancia del paciente
 * y la activación/desactivación de la salida segura.
 */
export default function useZonaSegura(paciente) {
  const [zonaSegura, setZonaSegura] = useState(null);
  const [ubicacionPaciente, setUbicacionPaciente] = useState(null);
  const [alertaActiva, setAlertaActiva] = useState(false);
  const [distanciaActual, setDistanciaActual] = useState(0);
  const [salidaSegura, setSalidaSegura] = useState(false);
  const [alertas, setAlertas] = useState([]);

  // Hook de audio
  const { reproducirSonido } = useAudioAlert();



  /** 🔹 Cargar datos iniciales de AsyncStorage y recargar al enfocar */
  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        try {
          const [zona, ubicacion, salida] = await Promise.all([
            AsyncStorage.getItem("zonaSegura"),
            AsyncStorage.getItem("ubicacionPaciente"),
            AsyncStorage.getItem("salidaSegura"),
          ]);

          // Actualizar estado, permitiendo null si se eliminó
          setZonaSegura(zona ? JSON.parse(zona) : null);
          if (ubicacion) setUbicacionPaciente(JSON.parse(ubicacion));
          if (salida) setSalidaSegura(JSON.parse(salida));
        } catch (error) {
          console.error("Error cargando datos de zona segura:", error);
        }
      };

      cargarDatos();
    }, [])
  );

  /** 🔹 Actualizar ubicación del paciente cada 5 segundos */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const stored = await AsyncStorage.getItem("ubicacionPaciente");
        if (stored) setUbicacionPaciente(JSON.parse(stored));
      } catch (error) {
        console.error("Error actualizando ubicación del paciente:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /** 🔹 Calcular distancia y manejar alertas de salida/entrada */
  useEffect(() => {
    if (!zonaSegura || !zonaSegura.centro || !ubicacionPaciente || salidaSegura) return;

    // Validar que existan coordenadas
    if (ubicacionPaciente.latitude === undefined || ubicacionPaciente.longitude === undefined ||
      zonaSegura.centro.latitude === undefined || zonaSegura.centro.longitude === undefined) {
      return;
    }

    const distancia = calcularDistancia(ubicacionPaciente, zonaSegura.centro);
    setDistanciaActual(distancia);

    // Si el paciente sale de la zona segura
    if (distancia > zonaSegura.radio && !alertaActiva) {
      const nueva = {
        id: Date.now().toString(),
        tipo: "Zona Segura",
        mensaje: `${paciente?.nombre || "El paciente"} ha salido de la zona segura`,
        fecha: new Date().toLocaleTimeString(),
      };
      // Limitar a máximo 10 alertas para evitar acumulación excesiva
      setAlertas((prev) => [nueva, ...prev].slice(0, 10));
      setAlertaActiva(true);
      Vibration.vibrate(900);
      reproducirSonido(require("../assets/sounds/alert.mp3"));
    }

    // Si el paciente regresa a la zona segura
    else if (distancia <= zonaSegura.radio && alertaActiva) {
      const nueva = {
        id: Date.now().toString(),
        tipo: "Zona Segura",
        mensaje: `${paciente?.nombre || "El paciente"} ha regresado a la zona segura`,
        fecha: new Date().toLocaleTimeString(),
      };
      // Limitar a máximo 10 alertas para evitar acumulación excesiva
      setAlertas((prev) => [nueva, ...prev].slice(0, 10));
      setAlertaActiva(false);
    }
  }, [ubicacionPaciente, zonaSegura, salidaSegura]);

  /** 🔹 Alternar salida segura */
  const toggleSalidaSegura = async (value) => {
    try {
      // Call backend API to sync across devices
      const response = await api.post('/api/safe-zone/safe-exit/toggle/', {
        active: value
      });

      // Update local state
      setSalidaSegura(value);
      await AsyncStorage.setItem("salidaSegura", JSON.stringify(value));

      Alert.alert(
        value ? "Salida Segura activada" : "Salida Segura desactivada",
        value
          ? "Las alertas por salida de zona segura estarán deshabilitadas temporalmente."
          : "Las alertas se han reactivado."
      );
    } catch (error) {
      console.error("Error toggling safe exit:", error);
      Alert.alert(
        "Error",
        "No se pudo actualizar el modo de salida segura. Intenta nuevamente."
      );
    }
  };

  /** 🔹 Limpiar alertas */
  const limpiarAlertas = () => {
    setAlertas([]);
  };

  return {
    zonaSegura,
    ubicacionPaciente,
    alertaActiva,
    distanciaActual,
    salidaSegura,
    toggleSalidaSegura,
    alertas,
    limpiarAlertas,
  };
}
