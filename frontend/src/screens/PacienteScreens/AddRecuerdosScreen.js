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
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import { createMemory } from "../../api/memoryService";

const { width } = Dimensions.get("window");

export default function AddRecuerdosScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();

  const getFontSizeStyle = (baseSize = 16) => {
    switch (settings.fontSize) {
      case "small": return { fontSize: baseSize - 2 };
      case "large": return { fontSize: baseSize + 2 };
      default: return { fontSize: baseSize };
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
    if (!title.trim() || !description.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa el título y la descripción.");
      return;
    }

    if (!image) {
      Alert.alert("Falta imagen", "Debes seleccionar una imagen antes de guardar.");
      return;
    }

    setLoading(true);

    try {
      const fileName = image.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName ?? "");
      const type = match ? `image/${match[1]}` : "image/jpeg";

      const memoryData = {
        title,
        description,
        image: {
          uri: image,
          name: fileName,
          type,
        },
      };

      await createMemory(memoryData);
      Alert.alert("Éxito", "Recuerdo añadido correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error creando el recuerdo:", error);
      Alert.alert("Error", "No se pudo guardar el recuerdo.");
    } finally {
      setLoading(false);
    }
  };

  // Consistent Magic Gradient
  const gradientColors = ["#a18cd1", "#fbc2eb"];

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
          <Text style={[styles.headerTitle, { fontSize: 24 }]}>Añadir Recuerdo</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: settings.theme === "dark" ? "#CCC" : "#666" }]}>Título</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: settings.theme === "dark" ? "#1E1E1E" : "#FFF",
                color: settings.theme === "dark" ? "#FFF" : "#333"
              },
              getFontSizeStyle(16),
            ]}
            placeholder="Ej: Cumpleaños de la abuela"
            placeholderTextColor={settings.theme === "dark" ? "#666" : "#999"}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: settings.theme === "dark" ? "#CCC" : "#666" }]}>Descripción</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: settings.theme === "dark" ? "#1E1E1E" : "#FFF",
                color: settings.theme === "dark" ? "#FFF" : "#333"
              },
              getFontSizeStyle(16),
            ]}
            placeholder="Escribe algo bonito sobre este recuerdo..."
            placeholderTextColor={settings.theme === "dark" ? "#666" : "#999"}
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.imagePicker,
            { backgroundColor: settings.theme === "dark" ? "#1E1E1E" : "#FFF" }
          ]}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={50} color={settings.theme === "dark" ? "#444" : "#DDD"} />
              <Text style={[styles.imagePickerText, { color: settings.theme === "dark" ? "#666" : "#999" }]}>
                Toca para seleccionar una foto
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#a18cd1", "#fbc2eb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Text style={[styles.saveButtonText, getFontSizeStyle(18)]}>
              {loading ? "Guardando..." : "Guardar Recuerdo"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
  form: { padding: 25 },
  inputContainer: { marginBottom: 20 },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    marginLeft: 5,
  },
  input: {
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  textArea: { height: 120 },
  imagePicker: {
    borderRadius: 20,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  placeholderContainer: {
    alignItems: "center",
  },
  imagePickerText: {
    marginTop: 10,
    fontWeight: "500",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  saveButton: {
    borderRadius: 30,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#6A5ACD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 40,
  },
  saveButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
