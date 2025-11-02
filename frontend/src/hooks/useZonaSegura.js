// src/hooks/useZonaSegura.js
import { useState, useEffect } from "react";
import { Vibration, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calcularDistancia } from "../utils/helpers";
import useAudioAlert from "./useAudioAlert";

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

  /** 🔹 Cargar datos iniciales de AsyncStorage */
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [zona, ubicacion, salida] = await Promise.all([
          AsyncStorage.getItem("zonaSegura"),
          AsyncStorage.getItem("ubicacionPaciente"),
          AsyncStorage.getItem("salidaSegura"),
        ]);

        if (zona) setZonaSegura(JSON.parse(zona));
        if (ubicacion) setUbicacionPaciente(JSON.parse(ubicacion));
        if (salida) setSalidaSegura(JSON.parse(salida));
      } catch (error) {
        console.error("Error cargando datos de zona segura:", error);
      }
    };

    cargarDatos();
  }, []);

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
    if (!zonaSegura || !ubicacionPaciente || salidaSegura) return;

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
      setAlertas((prev) => [nueva, ...prev]);
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
      setAlertas((prev) => [nueva, ...prev]);
      setAlertaActiva(false);
    }
  }, [ubicacionPaciente, zonaSegura, salidaSegura]);

  /** 🔹 Alternar salida segura */
  const toggleSalidaSegura = async (value) => {
    setSalidaSegura(value);
    await AsyncStorage.setItem("salidaSegura", JSON.stringify(value));

    Alert.alert(
      value ? "Salida Segura activada" : "Salida Segura desactivada",
      value
        ? "Las alertas por salida de zona segura estarán deshabilitadas temporalmente."
        : "Las alertas se han reactivado."
    );
  };

  return {
    zonaSegura,
    ubicacionPaciente,
    alertaActiva,
    distanciaActual,
    salidaSegura,
    toggleSalidaSegura,
    alertas,
  };
}
