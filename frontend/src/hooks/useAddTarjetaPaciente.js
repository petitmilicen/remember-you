import { useState } from "react";
import { Alert } from "react-native";
import { createCard } from "../api/cardService";

export default function useAddTarjetaPaciente(navigation) {
  const [tipo, setTipo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const guardarTarjeta = async () => {
    if (!tipo.trim() || !mensaje.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    try {
      const nuevaTarjeta = {
        card_type: tipo.trim(),
        message: mensaje.trim(),
      };

      await createCard(nuevaTarjeta); // 🔹 envía al backend
      Alert.alert("✅ Tarjeta guardada", "La tarjeta se ha añadido correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error guardando tarjeta:", error);
      Alert.alert("Error", "No se pudo guardar la tarjeta.");
    }
  };

  return { tipo, setTipo, mensaje, setMensaje, guardarTarjeta };
}
