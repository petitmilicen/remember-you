// src/hooks/usePaciente.js
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Hook para manejar el paciente vinculado al cuidador
 */
export default function usePaciente() {
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    const cargarPaciente = async () => {
      try {
        const pacienteStored = await AsyncStorage.getItem("pacienteAsignado");
        if (pacienteStored) {
          try {
            setPaciente(JSON.parse(pacienteStored));
          } catch {
            setPaciente(null);
          }
        } else {
          setPaciente(null);
        }
      } catch (error) {
        console.error("Error cargando paciente:", error);
      }
    };

    cargarPaciente();
  }, []);

  return { paciente, setPaciente };
}
