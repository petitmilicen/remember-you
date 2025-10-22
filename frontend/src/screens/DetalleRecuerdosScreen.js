import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";

const { width } = Dimensions.get("window");

export default function DetalleRecuerdosScreen({ route, navigation }) {
  const { memory } = route.params;
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

  // ✅ Tamaño de texto dinámico
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

  const handleDelete = async () => {
    Alert.alert(
      "Eliminar Recuerdo",
      "¿Seguro que quieres eliminar este recuerdo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const stored = await AsyncStorage.getItem("imageMemories");
            let memories = stored ? JSON.parse(stored) : [];
            memories = memories.filter((m) => m.id !== memory.id);
            await AsyncStorage.setItem("imageMemories", JSON.stringify(memories));
            navigation.goBack();
          },
        },
      ]
    );
  };

  const gradientColors =
    settings.theme === "dark" ? ["#101A50", "#202E8A"] : ["#1A2A80", "#3C4FCE"];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 🔹 Header */}
      <LinearGradient
        colors={gradientColors}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.headerTitle,
              { textAlign: "center" },
              getFontSizeStyle(20),
            ]}
          >
            Detalle del Recuerdo
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* 🧠 Contenido */}
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {memory.image && (
            <Image source={{ uri: memory.image }} style={styles.image} />
          )}

          <Text
            style={[styles.date, themeStyles.subtext, getFontSizeStyle(13)]}
          >
            {memory.date}
          </Text>
          <Text
            style={[styles.title, themeStyles.text, getFontSizeStyle(22)]}
          >
            {memory.title}
          </Text>
          <Text
            style={[styles.description, themeStyles.subtext, getFontSizeStyle(16)]}
          >
            {memory.description}
          </Text>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.deleteButton,
            {
              backgroundColor:
                settings.theme === "dark" ? "#B22A2A" : "#E53935",
            },
          ]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteButtonText, getFontSizeStyle(16)]}>
            Eliminar Recuerdo
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
    width,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  scrollContent: { paddingBottom: 20 },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  date: { alignSelf: "flex-start", marginBottom: 10 },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  description: {
    marginBottom: 20,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  deleteButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

/* 🌞 Tema Claro */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  text: { color: "#333" },
  subtext: { color: "#555" },
});

/* 🌙 Tema Oscuro */
const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  text: { color: "#FFF" },
  subtext: { color: "#BBB" },
});
