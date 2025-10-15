import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function AddTarjetas({ navigation }) {
  const [tipo, setTipo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const guardarTarjeta = async () => {
    if (!tipo.trim() || !mensaje.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    const nueva = {
      id: Date.now().toString(),
      tipo: tipo.trim(),
      mensaje: mensaje.trim(),
      date: new Date().toLocaleDateString(),
      creadoPor: "paciente", // 👈 origen del paciente
    };

    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      const prev = stored ? JSON.parse(stored) : [];
      const updated = [nueva, ...prev];
      await AsyncStorage.setItem("memoryCards", JSON.stringify(updated));

      Alert.alert("✅ Tarjeta guardada", "La tarjeta se ha añadido correctamente.");
      navigation.goBack(); // volver a la lista
    } catch (error) {
      console.error("Error guardando tarjeta:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#00C897", "#00E0AC"]}
      style={[styles.container, { paddingTop: TOP_PAD + 12 }]}
    >
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Tarjeta</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 📝 Formulario */}
      <View style={styles.form}>
        <Text style={styles.label}>Tipo de tarjeta</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: Recordatorio, Mensaje..."
          placeholderTextColor="#999"
          value={tipo}
          onChangeText={setTipo}
        />

        <Text style={styles.label}>Mensaje</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          placeholder="Escribe el mensaje para ti o tu cuidador"
          placeholderTextColor="#999"
          multiline
          value={mensaje}
          onChangeText={setMensaje}
        />

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={guardarTarjeta}>
          <Text style={styles.saveButtonText}>💾 Guardar Tarjeta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    backgroundColor: "#FFF",
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    elevation: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#00C897",
    padding: 14,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
