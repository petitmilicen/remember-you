import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import { getCards, deleteCard } from "../api/cardService";

export default function useTarjetasPaciente() {

  const [cards, setCards] = useState([]);

  const loadCards = async () => {
    try {
      const data = await getCards();
      setCards(data);
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
    }
  };

  const handleDeleteCard = async (id) => {
    Alert.alert("Eliminar Tarjeta", "¿Seguro que quieres eliminar esta tarjeta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("Eliminando tarjeta con id:", id);
            await deleteCard(id);
            await loadCards(); // recarga la lista
          } catch (err) {
            console.error("Error eliminando tarjeta:", err);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [])
  );

  return { cards, loadCards, handleDeleteCard };
}
