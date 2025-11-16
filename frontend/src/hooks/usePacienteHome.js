import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSettings } from "../context/SettingsContext";
import { getUserProfile } from "../api/userService";

export default function usePacienteHome() {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nombrePaciente, setNombrePaciente] = useState("Paciente");
  const [loading, setLoading] = useState(true); // 👈 nuevo estado
  const { settings } = useSettings();

  useFocusEffect(
    useCallback(() => {
      const fetchPaciente = async () => {
        try {
          setLoading(true); // 👈 inicia la carga
          const user = await getUserProfile();
          if (user) {
            setFotoPerfil(user.foto_perfil || null);
            setNombrePaciente(user.nombre_completo || "Paciente");
          } else {
            setFotoPerfil(null);
            setNombrePaciente("Paciente");
          }
        } catch (error) {
          console.error("Error al cargar datos del paciente:", error);
          setFotoPerfil(null);
          setNombrePaciente("Paciente");
        } finally {
          setLoading(false); // 👈 finaliza la carga
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

  return { fotoPerfil, nombrePaciente, theme: settings.theme, getFontSize, loading };
}
