import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
const ACCENT = "#FF7043";

export default function CitasMedicasScreen() {
  const [citas, setCitas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);

  const [doctor, setDoctor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  // 🧠 Cargar citas guardadas
  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const stored = await AsyncStorage.getItem("citasMedicas");
        if (stored) setCitas(JSON.parse(stored));
      } catch (error) {
        console.error("Error cargando citas:", error);
      }
    };
    cargarCitas();
  }, []);

  // 💾 Guardar cambios
  const guardarCitas = async (data) => {
    try {
      await AsyncStorage.setItem("citasMedicas", JSON.stringify(data));
      setCitas(data);
    } catch (error) {
      console.error("Error guardando citas:", error);
    }
  };

  // ➕ Agregar nueva cita
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

  // ✏️ Editar cita
  const editarCita = (item) => {
    setEditando(item);
    setDoctor(item.doctor);
    setDescripcion(item.descripcion);
    setFecha(new Date(item.timestamp));
    setModalVisible(true);
  };

  const guardarEdicion = () => {
    const actualizadas = citas.map((c) =>
      c.id === editando.id
        ? { ...c, doctor, descripcion, fecha: fecha.toLocaleDateString(), hora: fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), timestamp: fecha.getTime() }
        : c
    ).sort((a, b) => a.timestamp - b.timestamp);
    guardarCitas(actualizadas);
    cerrarModal();
  };

  // 🗑️ Eliminar cita
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

  // 🧹 Vaciar todas las citas
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

  // 🎨 UI principal
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
        <Text style={styles.headerTitle}>Citas Médicas</Text>
        {citas.length > 0 && (
          <TouchableOpacity onPress={limpiarCitas}>
            <Ionicons name="trash-outline" size={22} color="#B71C1C" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista */}
      {citas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={60} color="#CFD8DC" />
          <Text style={styles.emptyText}>No hay citas agendadas</Text>
          <Text style={styles.emptySub}>Agrega una cita médica para comenzar</Text>
        </View>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const futura = item.timestamp > Date.now();
            return (
              <View
                style={[
                  styles.card,
                  { borderLeftColor: futura ? "#64B5F6" : "#BDBDBD" },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: futura ? "#0D47A1" : "#757575" },
                    ]}
                  >
                    {item.doctor}
                  </Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => editarCita(item)}>
                      <Ionicons name="create-outline" size={18} color="#1976D2" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => eliminarCita(item.id)}>
                      <Ionicons name="trash-outline" size={18} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.cardDesc}>{item.descripcion}</Text>
                <Text style={styles.cardDate}>
                  📅 {item.fecha} • ⏰ {item.hora}
                </Text>
              </View>
            );
          }}
        />
      )}

      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Modal para crear/editar */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editando ? "Editar Cita Médica" : "Nueva Cita Médica"}
            </Text>

            <TextInput
              placeholder="Nombre del médico o centro"
              style={styles.input}
              value={doctor}
              onChangeText={setDoctor}
            />

            <TextInput
              placeholder="Descripción (motivo, indicaciones...)"
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              value={descripcion}
              multiline
              onChangeText={setDescripcion}
            />

            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setMostrarPicker(true)}
            >
              <Ionicons name="calendar" size={18} color="#1976D2" />
              <Text style={styles.dateBtnText}>
                {fecha.toLocaleDateString()} — {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {mostrarPicker && (
              <DateTimePicker
                value={fecha}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                    if (event.type === "dismissed") {
                    // usuario canceló
                    setMostrarPicker(false);
                    return;
                    }
                    setMostrarPicker(false);
                    if (selectedDate) setFecha(selectedDate);
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: ACCENT }]}
                onPress={editando ? guardarEdicion : agregarCita}
              >
                <Text style={styles.modalBtnText}>
                  {editando ? "Guardar Cambios" : "Agregar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#BDBDBD" }]}
                onPress={cerrarModal}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 Estilos coherentes con el resto del sistema
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#212121" },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 },
  emptyText: { color: "#455A64", fontSize: 16, fontWeight: "600", marginTop: 10 },
  emptySub: { color: "#90A4AE", fontSize: 13 },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 14,
    elevation: 2,
    borderLeftWidth: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardDesc: { color: "#455A64", fontSize: 14, marginBottom: 4 },
  cardDate: { color: "#90A4AE", fontSize: 12 },
  cardActions: { flexDirection: "row", gap: 12 },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: ACCENT,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalBox: { width: "88%", backgroundColor: "#FFF", borderRadius: 18, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#263238", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    color: "#37474F",
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 8,
  },
  dateBtnText: { color: "#0D47A1", fontWeight: "600" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
});
