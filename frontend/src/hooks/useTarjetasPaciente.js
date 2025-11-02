import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function useTarjetasPaciente(navigation) {
  const [cards, setCards] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [])
  );

  const loadCards = async () => {
    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setCards(parsed);
      }
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
    }
  };

  const saveCards = async (newCards) => {
    try {
      await AsyncStorage.setItem("memoryCards", JSON.stringify(newCards));
    } catch (error) {
      console.error("Error guardando tarjetas:", error);
    }
  };

  const deleteCard = async (id) => {
    try {
      const updated = cards.filter((c) => c.id !== id);
      setCards(updated);
      await saveCards(updated);
    } catch (error) {
      console.error("Error eliminando tarjeta:", error);
    }
  };

  const handleDeleteCard = (id) => {
    Alert.alert("Eliminar Tarjeta", "¿Seguro que quieres eliminar esta tarjeta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteCard(id) },
    ]);
  };

  return { cards, handleDeleteCard };
}
