import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export default function useCitasMedicas() {
  const [citas, setCitas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  const [doctor, setDoctor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("citasMedicas");
        if (stored) setCitas(JSON.parse(stored));
      } catch (error) {
        console.error("Error cargando citas:", error);
      }
    })();
  }, []);

  const guardarCitas = async (data) => {
    try {
      await AsyncStorage.setItem("citasMedicas", JSON.stringify(data));
      setCitas(data);
    } catch (error) {
      console.error("Error guardando citas:", error);
    }
  };

  const agregarCita = () => {
    if (!doctor.trim() || !descripcion.trim()) {
      Alert.alert("Campos vacíos", "Por favor completa todos los campos.");
      return;
    }

    const nueva = {
      id: Date.now().toString(),
      doctor,
      descripcion,
      fecha: fecha.toLocaleDateString(),
      hora: fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: fecha.getTime(),
    };

    const actualizadas = [...citas, nueva].sort((a, b) => a.timestamp - b.timestamp);
    guardarCitas(actualizadas);
    cerrarModal();
  };

  const editarCita = (item) => {
    setEditando(item);
    setDoctor(item.doctor);
    setDescripcion(item.descripcion);
    setFecha(new Date(item.timestamp));
    setModalVisible(true);
  };

  const guardarEdicion = () => {
    const actualizadas = citas
      .map((c) =>
        c.id === editando.id
          ? {
              ...c,
              doctor,
              descripcion,
              fecha: fecha.toLocaleDateString(),
              hora: fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              timestamp: fecha.getTime(),
            }
          : c
      )
      .sort((a, b) => a.timestamp - b.timestamp);

    guardarCitas(actualizadas);
    cerrarModal();
  };

  const eliminarCita = (id) => {
    Alert.alert("Eliminar cita", "¿Deseas eliminar esta cita médica?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          const actualizadas = citas.filter((c) => c.id !== id);
          guardarCitas(actualizadas);
        },
      },
    ]);
  };

  const limpiarCitas = () => {
    Alert.alert("Vaciar agenda", "¿Deseas eliminar todas las citas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Vaciar",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("citasMedicas");
          setCitas([]);
        },
      },
    ]);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setEditando(null);
    setDoctor("");
    setDescripcion("");
    setFecha(new Date());
  };

  return {
    citas,
    modalVisible,
    setModalVisible,
    editando,
    doctor,
    setDoctor,
    descripcion,
    setDescripcion,
    fecha,
    setFecha,
    agregarCita,
    editarCita,
    guardarEdicion,
    eliminarCita,
    limpiarCitas,
    cerrarModal,
  };
}
