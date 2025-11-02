import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export default function useAddTarjetaPaciente(navigation) {
  const [tipo, setTipo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const guardarTarjeta = async () => {
    if (!tipo.trim() || !mensaje.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    const nueva = {
      id: Date.now().toString(),
      tipo: tipo.trim(),
      mensaje: mensaje.trim(),
      date: new Date().toLocaleDateString(),
      creadoPor: "paciente",
    };

    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      const prev = stored ? JSON.parse(stored) : [];
      const updated = [nueva, ...prev];
      await AsyncStorage.setItem("memoryCards", JSON.stringify(updated));

      Alert.alert("✅ Tarjeta guardada", "La tarjeta se ha añadido correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error guardando tarjeta:", error);
    }
  };

  return { tipo, setTipo, mensaje, ssetMensaje, guardarTarjeta };
}
