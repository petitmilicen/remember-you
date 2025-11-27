import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { getCards, createCard, deleteCard } from "../api/cardService";

export default function useTarjetas() {
  const [tarjetas, setTarjetas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  useEffect(() => {
    cargarTarjetas();
  }, []);

  const cargarTarjetas = async () => {
    try {
      const data = await getCards();
      if (data) {
        const formatted = data.map((card) => ({
          id: card.card_id,
          tipo: card.card_type || "Message",
          mensaje: card.message,
          date: new Date(card.created_at).toLocaleDateString(),
          creadoPor: card.created_by || "paciente",
        }));
        setTarjetas(formatted);
      }
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
    }
  };

  const agregarTarjeta = async () => {
    if (!nuevoTipo.trim() || !nuevoMensaje.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    try {
      const cardData = {
        card_type: nuevoTipo.trim(),
        message: nuevoMensaje.trim(),
      };

      await createCard(cardData);
      await cargarTarjetas();

      setModalVisible(false);
      setNuevoTipo("");
      setNuevoMensaje("");
    } catch (error) {
      console.error("Error guardando tarjeta:", error);
      Alert.alert("Error", "No se pudo guardar la tarjeta.");
    }
  };

  const eliminarTarjeta = async (id) => {
    Alert.alert("Eliminar tarjeta", "¿Seguro que deseas eliminar esta tarjeta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCard(id);
            await cargarTarjetas();
          } catch (error) {
            console.error("Error eliminando tarjeta:", error);
            Alert.alert("Error", "No se pudo eliminar la tarjeta.");
          }
        },
      },
    ]);
  };

  return {
    tarjetas,
    modalVisible,
    setModalVisible,
    nuevoTipo,
    setNuevoTipo,
    nuevoMensaje,
    setNuevoMensaje,
    agregarTarjeta,
    eliminarTarjeta,
    recargarTarjetas: cargarTarjetas,
  };
}
