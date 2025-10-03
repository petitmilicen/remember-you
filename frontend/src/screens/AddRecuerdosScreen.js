import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert, StatusBar, Platform, Dimensions, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const GUTTER = 20;
const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

function formatDate(date) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = date.toLocaleString("es-ES", { month: "long" });
  const year = date.getFullYear();
  return `${dayName}, ${day} de ${month} ${year}`;
}

export default function AddRecuerdosScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !image) {
      Alert.alert("Error", "Por favor completa todos los campos y selecciona una imagen.");
      return;
    }

    const newMemory = {
      id: Date.now().toString(),
      title,
      description,
      image,
      date: formatDate(new Date()),
    };

    try {
      const storedMemories = await AsyncStorage.getItem("imageMemories");
      let memories = storedMemories ? JSON.parse(storedMemories) : [];
      memories.unshift(newMemory);
      await AsyncStorage.setItem("imageMemories", JSON.stringify(memories));

      Alert.alert("Éxito", "Recuerdo añadido correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving memory:", error);
      Alert.alert("Error", "No se pudo guardar el recuerdo");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A2A80", "#3C4FCE"]}
        style={[styles.header, { paddingTop: TOP_PAD + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>
            Añadir Recuerdo
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción"
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Recuerdo</Text>
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
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    elevation: 2,
  },
  textArea: {
    height: 100,
  },
  imagePicker: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  imagePickerText: {
    fontSize: 16,
    color: "#999",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: "#1A2A80",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
