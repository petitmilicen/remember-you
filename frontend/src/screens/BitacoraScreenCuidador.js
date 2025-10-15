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
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
const ACCENT = "#FF7043";

export default function BitacoraScreenCuidador() {
  const [bitacora, setBitacora] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [editando, setEditando] = useState(null);

  // 🧠 Cargar datos guardados
  useEffect(() => {
    const cargarBitacora = async () => {
      try {
        const stored = await AsyncStorage.getItem("bitacoraCuidador");
        if (stored) setBitacora(JSON.parse(stored));
      } catch (error) {
        console.error("Error cargando bitácora:", error);
      }
    };
    cargarBitacora();
  }, []);

  // 💾 Guardar cambios
  const guardarBitacora = async (datos) => {
    try {
      await AsyncStorage.setItem("bitacoraCuidador", JSON.stringify(datos));
      setBitacora(datos);
    } catch (error) {
      console.error("Error guardando bitácora:", error);
    }
  };

  // ➕ Agregar nuevo registro
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
    setModalVisible(false);
    setCategoria("");
    setNuevoEvento("");
  };

  // ✏️ Editar registro
  const editarRegistro = (item) => {
    setEditando(item);
    setCategoria(item.categoria);
    setNuevoEvento(item.descripcion);
    setModalVisible(true);
  };

  const guardarEdicion = () => {
    const actualizada = bitacora.map((item) =>
      item.id === editando.id
        ? { ...item, categoria, descripcion: nuevoEvento }
        : item
    );
    guardarBitacora(actualizada);
    setEditando(null);
    setModalVisible(false);
    setCategoria("");
    setNuevoEvento("");
  };

  // 🗑️ Eliminar registro
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

  // 🧹 Vaciar toda la bitácora
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
        
        <Text style={styles.headerTitle}>Bitácora del Cuidador</Text>
        {bitacora.length > 0 && (
          <TouchableOpacity onPress={limpiarBitacora}>
            <Ionicons name="trash-outline" size={22} color="#B71C1C" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de registros */}
      {bitacora.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#CFD8DC" />
          <Text style={styles.emptyText}>No hay registros aún</Text>
          <Text style={styles.emptySub}>Agrega tus primeras observaciones</Text>
        </View>
      ) : (
        <FlatList
          data={bitacora}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardCategory}>{item.categoria}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => editarRegistro(item)}>
                    <Ionicons name="create-outline" size={18} color="#1976D2" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarRegistro(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.cardDesc}>{item.descripcion}</Text>
              <Text style={styles.cardDate}>
                📅 {item.fecha} • ⏰ {item.hora}
              </Text>
            </View>
          )}
        />
      )}

      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Modal de creación / edición */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editando ? "Editar Registro" : "Nuevo Registro"}
            </Text>

            <TextInput
              placeholder="Categoría (Medicación, Alimentación, etc.)"
              style={styles.input}
              value={categoria}
              onChangeText={setCategoria}
            />

            <TextInput
              placeholder="Descripción del evento..."
              multiline
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              value={nuevoEvento}
              onChangeText={setNuevoEvento}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: ACCENT }]}
                onPress={editando ? guardarEdicion : agregarRegistro}
              >
                <Text style={styles.modalBtnText}>
                  {editando ? "Guardar Cambios" : "Agregar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#BDBDBD" }]}
                onPress={() => {
                  setModalVisible(false);
                  setEditando(null);
                  setCategoria("");
                  setNuevoEvento("");
                }}
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
    borderLeftColor: "#64B5F6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardCategory: { fontSize: 15, fontWeight: "700", color: "#263238" },
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
  modalBox: {
    width: "88%",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#263238", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    color: "#37474F",
  },
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
