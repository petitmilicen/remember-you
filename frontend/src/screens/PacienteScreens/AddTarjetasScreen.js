// src/screens/PacienteScreens/AddTarjetasScreen.js
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import useAddTarjetaPaciente from "../../hooks/useAddTarjetaPaciente";

export default function AddTarjetasScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { tipo, setTipo, mensaje, setMensaje, guardarTarjeta } = useAddTarjetaPaciente(navigation);

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
      settings.fontSize === "large" ? base + 2 : base;

  // Magic Gradient for Tarjetas (Mint to Blue)
  const gradientColors = ["#84fab0", "#8fd3f4"];

  return (
    <View style={[styles.container, { backgroundColor: settings.theme === "dark" ? "#0D0D0D" : "#F5F5F5" }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Magic Header */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={45} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 28 }]}>Nueva Tarjeta</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: settings.theme === "dark" ? "#1E1E1E" : "#FFF" }]}>

          <Text style={[styles.label, { color: settings.theme === "dark" ? "#DDD" : "#555", fontSize: getFontSize(16) }]}>
            Tipo de tarjeta
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: settings.theme === "dark" ? "#333" : "#F9F9F9" }]}>
            <Picker
              selectedValue={tipo}
              onValueChange={(itemValue) => setTipo(itemValue)}
              style={{ color: settings.theme === "dark" ? "#FFF" : "#333" }}
              dropdownIconColor={settings.theme === "dark" ? "#FFF" : "#333"}
            >
              <Picker.Item label="Seleccione tipo..." value="" />
              <Picker.Item label="Mensaje" value="Message" />
              <Picker.Item label="Otro" value="Other" />
              <Picker.Item label="Emergencia" value="Emergency" />
            </Picker>
          </View>

          <Text style={[styles.label, { color: settings.theme === "dark" ? "#DDD" : "#555", fontSize: getFontSize(16) }]}>
            Mensaje
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: settings.theme === "dark" ? "#333" : "#F9F9F9", height: 120 }]}>
            <TextInput
              style={[
                styles.input,
                { color: settings.theme === "dark" ? "#FFF" : "#333", fontSize: getFontSize(16) },
              ]}
              placeholder="Escribe el mensaje para ti o tu cuidador..."
              placeholderTextColor={settings.theme === "dark" ? "#888" : "#AAA"}
              multiline
              value={mensaje}
              onChangeText={setMensaje}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.saveButtonContainer}
            onPress={guardarTarjeta}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <Text style={[styles.saveButtonText, { fontSize: getFontSize(18) }]}>
                Guardar Tarjeta
              </Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  inputContainer: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden", // For Picker border radius
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  input: {
    flex: 1,
    padding: 15,
  },
  saveButtonContainer: {
    marginTop: 20,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#84fab0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
