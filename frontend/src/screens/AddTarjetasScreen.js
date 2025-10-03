import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, StatusBar, Platform, Dimensions, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const GUTTER = 20;
const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function AddTarjetasScreen({ navigation }) {
  const [memoryText, setMemoryText] = useState("");

  const handleSave = () => {
    if (!memoryText.trim()) {
      Alert.alert("Error", "Por favor escribe una tarjeta");
      return;
    }

    Alert.alert("Guardar Tarjeta", "¿Deseas guardar esta tarjeta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Guardar", onPress: saveCard },
    ]);
  };

  const saveCard = async () => {
    try {
      const storedCards = await AsyncStorage.getItem("memoryCards");
      let cards = storedCards ? JSON.parse(storedCards) : [];

      const newCard = {
        id: Date.now().toString(),
        text: memoryText.trim(),
        date: new Date().toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        createdBy: "user",
      };

      cards.unshift(newCard);
      await AsyncStorage.setItem("memoryCards", JSON.stringify(cards));

      Alert.alert("Éxito", "Tarjeta guardada correctamente", [
        { text: "Aceptar", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error saving card:", error);
      Alert.alert("Error", "No se pudo guardar la tarjeta");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#00C897", "#00E0AC"]}
        style={[styles.header, { paddingTop: TOP_PAD + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>
            Añadir Tarjeta
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* Formulario */}
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Escribe tu tarjeta:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={6}
          placeholder="Escribe aquí tu tarjeta..."
          value={memoryText}
          onChangeText={setMemoryText}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            !memoryText.trim() && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!memoryText.trim()}
        >
          <Text style={styles.saveButtonText}>Guardar Tarjeta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEDED" },

  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: GUTTER,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  textInput: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: "#00C897",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
