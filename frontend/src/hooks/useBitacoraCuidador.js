import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  getCaregiverLogs,
  createCaregiverLog,
  updateCaregiverLog,
  deleteCaregiverLog,
} from "../api/caregiverLogService";

export default function useBitacoraCuidador() {
  const [bitacora, setBitacora] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarBitacora();
  }, []);

  const cargarBitacora = async () => {
    try {
      setLoading(true);
      const data = await getCaregiverLogs();
      if (data) {
        const transformedData = data.map((item) => ({
          id: item.log_id,
          categoria: item.category,
          descripcion: item.description,
          fecha: new Date(item.created_at).toLocaleDateString(),
          hora: new Date(item.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          created_at: item.created_at,
        }));
        setBitacora(transformedData);
      }
    } catch (error) {
      console.error("Error cargando bitácora:", error);
      Alert.alert("Error", "No se pudo cargar la bitácora");
    } finally {
      setLoading(false);
    }
  };

  const agregarRegistro = async () => {
    if (!categoria.trim() || !nuevoEvento.trim()) {
      Alert.alert(
        "Campos vacíos",
        "Por favor completa la categoría y descripción."
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        category: categoria,
        description: nuevoEvento,
      };

      const nuevoRegistro = await createCaregiverLog(payload);

      if (nuevoRegistro) {
        await cargarBitacora();
        cerrarModal();
      }
    } catch (error) {
      console.error("Error agregando registro:", error);
      Alert.alert("Error", "No se pudo crear el registro");
    } finally {
      setLoading(false);
    }
  };

  const editarRegistro = (item) => {
    setEditando(item);
    setCategoria(item.categoria);
    setNuevoEvento(item.descripcion);
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
    if (!categoria.trim() || !nuevoEvento.trim()) {
      Alert.alert(
        "Campos vacíos",
        "Por favor completa la categoría y descripción."
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        category: categoria,
        description: nuevoEvento,
      };

      await updateCaregiverLog(editando.id, payload);
      await cargarBitacora();
      cerrarModal();
    } catch (error) {
      console.error("Error editando registro:", error);
      Alert.alert("Error", "No se pudo actualizar el registro");
    } finally {
      setLoading(false);
    }
  };

  const eliminarRegistro = (id) => {
    Alert.alert("Eliminar registro", "¿Deseas eliminar este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteCaregiverLog(id);
            await cargarBitacora();
          } catch (error) {
            console.error("Error eliminando registro:", error);
            Alert.alert("Error", "No se pudo eliminar el registro");
          } finally {
            setLoading(false);
          }
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
          try {
            setLoading(true);
            const promesas = bitacora.map((item) =>
              deleteCaregiverLog(item.id)
            );
            await Promise.all(promesas);
            await cargarBitacora();
          } catch (error) {
            console.error("Error limpiando bitácora:", error);
            Alert.alert("Error", "No se pudo vaciar la bitácora");
          } finally {
            setLoading(false);
          }
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
    loading,
    refrescar: cargarBitacora,
  };
}
