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
      const userProfile = await getUserProfile();

      if (userProfile && userProfile.patient) {
        const patientData = await getPatientById(userProfile.patient);
        setPaciente(patientData);
        await AsyncStorage.setItem("pacienteAsignado", JSON.stringify(patientData));
      } else {
        await AsyncStorage.removeItem("pacienteAsignado");
        setPaciente(null);
      }
    } catch (error) {
      console.error("Error cargando paciente desde backend:", error.message);

      try {
        const pacienteStored = await AsyncStorage.getItem("pacienteAsignado");
        if (pacienteStored) {
          const parsed = JSON.parse(pacienteStored);
          setPaciente(parsed);
        } else {
          setPaciente(null);
        }
      } catch (storageError) {
        console.error("Error leyendo AsyncStorage:", storageError);
        setPaciente(null);
      }
    }
  }, []);

  useEffect(() => {
    cargarPaciente();
  }, [cargarPaciente]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarPaciente();
    });
    return unsubscribe;
  }, [navigation, cargarPaciente]);

  useEffect(() => {
    const handlePatientChanged = () => {
      cargarPaciente();
    };

    eventEmitter.on(EVENTS.PATIENT_CHANGED, handlePatientChanged);

    return () => {
      eventEmitter.off(EVENTS.PATIENT_CHANGED, handlePatientChanged);
    };
  }, [cargarPaciente]);

  return { paciente, setPaciente, recargarPaciente: cargarPaciente };
}
