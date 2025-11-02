import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export default function useBitacoraCuidador() {
  const [bitacora, setBitacora] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("bitacoraCuidador");
        if (stored) setBitacora(JSON.parse(stored));
      } catch (error) {
        console.error("Error cargando bitácora:", error);
      }
    })();
  }, []);

  const guardarBitacora = async (datos) => {
    try {
      await AsyncStorage.setItem("bitacoraCuidador", JSON.stringify(datos));
      setBitacora(datos);
    } catch (error) {
      console.error("Error guardando bitácora:", error);
    }
  };

  const agregarRegistro = () => {
    if (!categoria.trim() || !nuevoEvento.trim()) {
      Alert.alert("Campos vacíos", "Por favor completa la categoría y descripción.");
      return;
    }

    const nuevo = {
      id: Date.now().toString(),
      categoria,
      descripcion: nuevoEvento,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const actualizada = [nuevo, ...bitacora];
    guardarBitacora(actualizada);
    cerrarModal();
  };

  const editarRegistro = (item) => {
    setEditando(item);
    setCategoria(item.categoria);
    setNuevoEvento(item.descripcion);
    setModalVisible(true);
  };

  const guardarEdicion = () => {
    const actualizada = bitacora.map((item) =>
      item.id === editando.id ? { ...item, categoria, descripcion: nuevoEvento } : item
    );
    guardarBitacora(actualizada);
    cerrarModal();
  };

  const eliminarRegistro = (id) => {
    Alert.alert("Eliminar registro", "¿Deseas eliminar este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          const actualizada = bitacora.filter((item) => item.id !== id);
          guardarBitacora(actualizada);
        },
      },
    ]);
  };

  const limpiarBitacora = () => {
    Alert.alert("Vaciar bitácora", "¿Deseas eliminar todos los registros?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Vaciar",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("bitacoraCuidador");
          setBitacora([]);
        },
      },
    ]);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setEditando(null);
    setCategoria("");
    setNuevoEvento("");
  };

  return {
    bitacora,
    modalVisible,
    setModalVisible,
    nuevoEvento,
    setNuevoEvento,
    categoria,
    setCategoria,
    editando,
    agregarRegistro,
    editarRegistro,
    guardarEdicion,
    eliminarRegistro,
    limpiarBitacora,
    cerrarModal,
  };
}
