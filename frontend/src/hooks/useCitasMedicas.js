import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  getMedicalAppointments,
  createMedicalAppointment,
  updateMedicalAppointment,
  deleteMedicalAppointment,
} from "../api/medicalAppointmentService";

export default function useCitasMedicas() {
  const [citas, setCitas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  const [doctor, setDoctor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [status, setStatus] = useState("Scheduled");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      const data = await getMedicalAppointments();
      if (data) {
        const transformedData = data.map((item) => {
          const appointmentDate = new Date(item.date);
          return {
            id: item.medical_appointment_id,
            doctor: item.doctor,
            descripcion: item.reason || "",
            fecha: appointmentDate.toLocaleDateString(),
            hora: appointmentDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: appointmentDate.getTime(),
            status: item.status_type || "Scheduled",
          };
        });
        const sorted = transformedData.sort((a, b) => a.timestamp - b.timestamp);
        setCitas(sorted);
      }
    } catch (error) {
      console.error("Error cargando citas:", error);
      Alert.alert("Error", "No se pudo cargar las citas médicas");
    } finally {
      setLoading(false);
    }
  };

  const agregarCita = async () => {
    if (!doctor.trim() || !descripcion.trim()) {
      Alert.alert("Campos vacíos", "Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        doctor: doctor,
        date: fecha.toISOString(),
        reason: descripcion,
        status_type: status,
      };

      console.log("Creando cita con payload:", payload);
      const nuevaCita = await createMedicalAppointment(payload);
      console.log("Cita creada exitosamente:", nuevaCita);

      if (nuevaCita) {
        await cargarCitas();
        cerrarModal();
      }
    } catch (error) {
      console.error("Error agregando cita:", error);
      console.error("Detalles del error:", error.response?.data);
      Alert.alert("Error", `No se pudo crear la cita médica: ${error.response?.data?.detail || error.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  const editarCita = (item) => {
    setEditando(item);
    setDoctor(item.doctor);
    setDescripcion(item.descripcion);
    setFecha(new Date(item.timestamp));
    setStatus(item.status || "Scheduled");
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
    if (!doctor.trim() || !descripcion.trim()) {
      Alert.alert("Campos vacíos", "Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        doctor: doctor,
        date: fecha.toISOString(),
        reason: descripcion,
        status_type: status,
      };

      await updateMedicalAppointment(editando.id, payload);
      await cargarCitas();
      cerrarModal();
    } catch (error) {
      console.error("Error editando cita:", error);
      Alert.alert("Error", "No se pudo actualizar la cita médica");
    } finally {
      setLoading(false);
    }
  };

  const eliminarCita = (id) => {
    Alert.alert("Eliminar cita", "¿Deseas eliminar esta cita médica?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteMedicalAppointment(id);
            await cargarCitas();
          } catch (error) {
            console.error("Error eliminando cita:", error);
            Alert.alert("Error", "No se pudo eliminar la cita médica");
          } finally {
            setLoading(false);
          }
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
          try {
            setLoading(true);
            const promesas = citas.map((cita) =>
              deleteMedicalAppointment(cita.id)
            );
            await Promise.all(promesas);
            await cargarCitas();
          } catch (error) {
            console.error("Error limpiando citas:", error);
            Alert.alert("Error", "No se pudo vaciar la agenda");
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
    setDoctor("");
    setDescripcion("");
    setFecha(new Date());
    setStatus("Scheduled");
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
    status,
    setStatus,
    agregarCita,
    editarCita,
    guardarEdicion,
    eliminarCita,
    limpiarCitas,
    cerrarModal,
    loading,
    refrescar: cargarCitas,
  };
}
