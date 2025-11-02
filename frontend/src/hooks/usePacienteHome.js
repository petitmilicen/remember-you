import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useSettings } from "../context/SettingsContext";

export default function usePacienteHome() {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nombrePaciente, setNombrePaciente] = useState("Paciente");
  const { settings } = useSettings();

  useFocusEffect(
    useCallback(() => {
      const fetchPaciente = async () => {
        try {
          const stored = await AsyncStorage.getItem("pacienteData");
          if (stored) {
            const data = JSON.parse(stored);
            setFotoPerfil(data.FotoPerfil || null);
            setNombrePaciente(data.NombreCompleto || "Paciente");
          }
        } catch (error) {
          console.error("Error al cargar datos del paciente:", error);
        }
      };
      fetchPaciente();
    }, [])
  );

  const getFontSize = (baseSize = 16) => {
    switch (settings.fontSize) {
      case "small":
        return baseSize - 2;
      case "large":
        return baseSize + 2;
      default:
        return baseSize;
    }
  };

  return { fotoPerfil, nombrePaciente, theme: settings.theme, getFontSize };
}
