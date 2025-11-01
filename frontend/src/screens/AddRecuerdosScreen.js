import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";
import { AuthContext } from "../auth/AuthContext";

const { width } = Dimensions.get("window");
const GUTTER = 20;

export default function AddRecuerdosScreen({ navigation }) {

  const { user, logout, loading } = useContext(AuthContext);

  console.log(user);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

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

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
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

  const gradientColors =
    settings.theme === "dark" ? ["#101A50", "#202E8A"] : ["#1A2A80", "#3C4FCE"];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 🔹 Header */}
      <View style={styles.headerBleed}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={[styles.headerTitle, { textAlign: "center" }, getFontSizeStyle(20)]}
            >
              Añadir Recuerdo
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </LinearGradient>
      </View>

      {/* 🧠 Formulario */}
      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          style={[styles.input, themeStyles.card, themeStyles.text, getFontSizeStyle(16)]}
          placeholder="Título"
          placeholderTextColor={settings.theme === "dark" ? "#AAA" : "#999"}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[
            styles.input,
            styles.textArea,
            themeStyles.card,
            themeStyles.text,
            getFontSizeStyle(16),
          ]}
          placeholder="Descripción"
          placeholderTextColor={settings.theme === "dark" ? "#AAA" : "#999"}
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={[styles.imagePicker, themeStyles.card]}
          onPress={pickImage}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <Text style={[styles.imagePickerText, themeStyles.subtext, getFontSizeStyle(16)]}>
              Seleccionar Imagen
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: settings.theme === "dark" ? "#2F3A9D" : "#1A2A80",
            },
          ]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, getFontSizeStyle(16)]}>
            Guardar Recuerdo
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* 🎨 Estilos base */
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBleed: {
    marginLeft: 0,
    marginRight: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 5,
  },
  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: GUTTER,
    paddingBottom: 16,
  },
  headerTitle: { color: "#FFF", fontWeight: "bold" },
  form: { padding: 20 },
  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
  },
  textArea: { height: 100 },
  imagePicker: {
    borderRadius: 12,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  imagePickerText: {},
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

/* 🎨 Estilos por tema */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#222" },
  subtext: { color: "#999" },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFF" },
  subtext: { color: "#AAA" },
});
