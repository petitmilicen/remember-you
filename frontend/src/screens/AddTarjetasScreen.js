import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";

export default function AddTarjetas({ navigation }) {
  const [tipo, setTipo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

  // 🔠 Ajuste de tamaño de fuente dinámico
  const getFontSizeStyle = (baseSize = 16) => {
    switch (settings.fontSize) {
      case "small":
        return { fontSize: baseSize - 2 };
      case "large":
        return { fontSize: baseSize + 2 };
      default:
        return { fontSize: baseSize };
    }
  };

  // 💾 Guardar nueva tarjeta
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
      creadoPor: "paciente",
    };

    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      const prev = stored ? JSON.parse(stored) : [];
      const updated = [nueva, ...prev];
      await AsyncStorage.setItem("memoryCards", JSON.stringify(updated));

      Alert.alert("✅ Tarjeta guardada", "La tarjeta se ha añadido correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error guardando tarjeta:", error);
    }
  };

  const gradientColors =
    settings.theme === "dark" ? ["#007E67", "#009E7A"] : ["#00C897", "#00E0AC"];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 🔹 Header con degradado */}
      <LinearGradient
        colors={gradientColors}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, getFontSizeStyle(20)]}>Nueva Tarjeta</Text>

        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* 📝 Formulario */}
      <View style={[styles.form, themeStyles.card]}>
        <Text style={[styles.label, themeStyles.text, getFontSizeStyle(16)]}>
          Tipo de tarjeta
        </Text>
        <TextInput
          style={[styles.input, themeStyles.input, getFontSizeStyle(16)]}
          placeholder="Ejemplo: Recordatorio, Mensaje..."
          placeholderTextColor={settings.theme === "dark" ? "#AAA" : "#999"}
          value={tipo}
          onChangeText={setTipo}
        />

        <Text style={[styles.label, themeStyles.text, getFontSizeStyle(16)]}>
          Mensaje
        </Text>
        <TextInput
          style={[
            styles.input,
            { height: 100, textAlignVertical: "top" },
            themeStyles.input,
            getFontSizeStyle(16),
          ]}
          placeholder="Escribe el mensaje para ti o tu cuidador"
          placeholderTextColor={settings.theme === "dark" ? "#AAA" : "#999"}
          multiline
          value={mensaje}
          onChangeText={setMensaje}
        />

        {/* 💾 Botón Guardar */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: settings.theme === "dark" ? "#007E67" : "#00C897",
            },
          ]}
          onPress={guardarTarjeta}
        >
          <Text style={[styles.saveButtonText, getFontSizeStyle(16)]}>
            💾 Guardar Tarjeta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🎨 Estilos base */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: { color: "#FFF", fontWeight: "bold" },
  form: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    elevation: 5,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  saveButton: {
    padding: 14,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

/* 🌞 Tema claro */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#333" },
  input: { borderColor: "#CCC", color: "#333", backgroundColor: "#FFF" },
});

/* 🌙 Tema oscuro */
const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFF" },
  input: { borderColor: "#333", color: "#FFF", backgroundColor: "#1E1E1E" },
});
