import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
export default function useTarjetas() {
  const [tarjetas, setTarjetas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  useEffect(() => {
    const cargarTarjetas = async () => {
      try {
        const stored = await AsyncStorage.getItem("memoryCards");
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          setTarjetas(parsed);
        }
      } catch (error) {
        console.error("Error cargando tarjetas:", error);
      }
    };
    cargarTarjetas();
  }, []);

  const agregarTarjeta = async () => {
    if (!nuevoTipo.trim() || !nuevoMensaje.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    const nuevaTarjeta = {
      id: Date.now().toString(),
      tipo: nuevoTipo.trim(),
      mensaje: nuevoMensaje.trim(),
      date: new Date().toLocaleDateString(),
      creadoPor: "cuidador",
    };

    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      const prev = stored ? JSON.parse(stored) : [];
      const updated = [nuevaTarjeta, ...prev];
      await AsyncStorage.setItem("memoryCards", JSON.stringify(updated));
      setTarjetas(updated);
    } catch (error) {
      console.error("Error guardando tarjeta:", error);
    }

    setModalVisible(false);
    setNuevoTipo("");
    setNuevoMensaje("");
  };

  const eliminarTarjeta = async (id) => {
    Alert.alert("Eliminar tarjeta", "¿Seguro que deseas eliminar esta tarjeta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const updated = tarjetas.filter((t) => t.id !== id);
            setTarjetas(updated);
            await AsyncStorage.setItem("memoryCards", JSON.stringify(updated));
          } catch (error) {
            console.error("Error eliminando tarjeta:", error);
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
  };
}
