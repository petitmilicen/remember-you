// src/hooks/usePaciente.js
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, getPatientById } from "../api/userService";
import { useNavigation } from "@react-navigation/native";
import eventEmitter, { EVENTS } from "../utils/eventEmitter";

/**
 * Hook para manejar el paciente vinculado al cuidador
 */
export default function usePaciente() {
  const [paciente, setPaciente] = useState(null);
  const navigation = useNavigation();

  const cargarPaciente = useCallback(async () => {
    try {
      console.log("🔍 Cargando paciente...");

      // ALWAYS check backend first for most up-to-date data
      console.log("🌐 Consultando backend...");
      const userProfile = await getUserProfile();
      console.log("👤 Patient ID en perfil:", userProfile?.patient || "Ninguno");

      if (userProfile && userProfile.patient) {
        console.log("🔗 Descargando datos del paciente ID:", userProfile.patient);
        // User has a patient assigned in the backend
        const patientData = await getPatientById(userProfile.patient);
        console.log("✅ Datos del paciente recibidos");
        setPaciente(patientData);
        // Store in AsyncStorage for offline access
        await AsyncStorage.setItem("pacienteAsignado", JSON.stringify(patientData));
        console.log("💾 Guardado en AsyncStorage");
      } else {
        console.log("❌ Sin paciente asignado en backend");
        // Clear AsyncStorage if no patient in backend
        await AsyncStorage.removeItem("pacienteAsignado");
        console.log("🗑️ AsyncStorage limpiado");
        setPaciente(null);
      }
    } catch (error) {
      console.error("❌ Error cargando paciente desde backend:", error.message);

      // If backend fails, try AsyncStorage as fallback
      try {
        const pacienteStored = await AsyncStorage.getItem("pacienteAsignado");
        if (pacienteStored) {
          const parsed = JSON.parse(pacienteStored);
          console.log("📦 Usando datos de AsyncStorage (modo offline)");
          setPaciente(parsed);
        } else {
          setPaciente(null);
        }
      } catch (storageError) {
        console.error("❌ Error leyendo AsyncStorage:", storageError);
        setPaciente(null);
      }
    }
  }, []);

  useEffect(() => {
    cargarPaciente();
  }, [cargarPaciente]);

  // Reload patient when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("🔄 Screen focused - reloading patient data");
      cargarPaciente();
    });
    return unsubscribe;
  }, [navigation, cargarPaciente]);

  // Listen for patient change events from anywhere in the app
  useEffect(() => {
    const handlePatientChanged = () => {
      console.log("🔔 Patient changed event received - reloading");
      cargarPaciente();
    };

    eventEmitter.on(EVENTS.PATIENT_CHANGED, handlePatientChanged);

    return () => {
      eventEmitter.off(EVENTS.PATIENT_CHANGED, handlePatientChanged);
    };
  }, [cargarPaciente]);

  return { paciente, setPaciente, recargarPaciente: cargarPaciente };
}
