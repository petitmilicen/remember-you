// src/hooks/usePaciente.js
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, getPatientById } from "../api/userService";

/**
 * Hook para manejar el paciente vinculado al cuidador
 */
export default function usePaciente() {
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    const cargarPaciente = async () => {
      try {
        console.log("🔍 Cargando paciente...");

        // First, try to get from AsyncStorage
        const pacienteStored = await AsyncStorage.getItem("pacienteAsignado");
        console.log("📦 AsyncStorage:", pacienteStored ? "Encontrado" : "Vacío");

        if (pacienteStored) {
          try {
            const parsed = JSON.parse(pacienteStored);
            console.log("✅ Cargado desde AsyncStorage");
            setPaciente(parsed);
            return;
          } catch {
            console.log("⚠️ Error parseando, consultando backend...");
          }
        }

        console.log("🌐 Consultando backend...");
        // If not in AsyncStorage, fetch from backend
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
          setPaciente(null);
        }
      } catch (error) {
        console.error("❌ Error cargando paciente:", error.message);
        if (error.response) {
          console.error("Error del backend:", error.response.data);
        }
        setPaciente(null);
      }
    };

    cargarPaciente();
  }, []);

  return { paciente, setPaciente };
}
