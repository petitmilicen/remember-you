import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";

const { width } = Dimensions.get("window");

/* 🖼️ Componente individual de Recuerdo */
const MemoryCard = ({ memory, onPress, onLongPress, themeStyles, getFontSizeStyle }) => (
  <TouchableOpacity
    style={[styles.memoryCard, themeStyles.card]}
    onPress={onPress}
    onLongPress={onLongPress}
  >
    {memory.image && <Image source={{ uri: memory.image }} style={styles.memoryImage} />}
    <View style={styles.memoryInfo}>
      <Text style={[styles.memoryTitle, themeStyles.text, getFontSizeStyle(14)]}>
        {memory.title}
      </Text>
      <Text style={[styles.memoryDate, themeStyles.subtext, getFontSizeStyle(12)]}>
        {memory.date}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function RecuerdosScreen({ navigation }) {
  const [memories, setMemories] = useState([]);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

  // ✅ Ajuste de tamaño de texto global
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

  useEffect(() => {
    if (isFocused) loadMemories();
  }, [isFocused]);

  const loadMemories = async () => {
    try {
      const stored = await AsyncStorage.getItem("imageMemories");
      if (stored) setMemories(JSON.parse(stored));
    } catch (error) {
      console.error("Error cargando recuerdos:", error);
    }
  };

  const handleDeleteMemory = (id) => {
    Alert.alert("Eliminar Recuerdo", "¿Seguro que quieres eliminar este recuerdo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteMemory(id),
      },
    ]);
  };

  const deleteMemory = async (id) => {
    try {
      const stored = await AsyncStorage.getItem("imageMemories");
      let current = stored ? JSON.parse(stored) : [];
      const updated = current.filter((m) => m.id !== id);
      setMemories(updated);
      await AsyncStorage.setItem("imageMemories", JSON.stringify(updated));
    } catch (error) {
      console.error("Error eliminando recuerdo:", error);
    }
  };

  const renderMemory = ({ item }) => (
    <MemoryCard
      memory={item}
      onPress={() => navigation.navigate("DetalleRecuerdos", { memory: item })}
      onLongPress={() => handleDeleteMemory(item.id)}
      themeStyles={themeStyles}
      getFontSizeStyle={getFontSizeStyle}
    />
  );

  // 🎨 Gradiente según tema
  const gradientColors =
    settings.theme === "dark"
      ? ["#101A50", "#202E8A"]
      : ["#1A2A80", "#3C4FCE"];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 🔹 Header */}
      <View style={styles.headerBleed}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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
              Recuerdos
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </LinearGradient>
      </View>

      {/* 📷 Lista de recuerdos */}
      <View style={styles.content}>
        <FlatList
          data={memories}
          renderItem={renderMemory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={
            memories.length === 0
              ? { flex: 1, justifyContent: "center", alignItems: "center" }
              : { paddingBottom: 100 }
          }
          ListEmptyComponent={
            <Text
              style={[styles.emptyText, themeStyles.subtext, getFontSizeStyle(16)]}
            >
              No hay recuerdos todavía
            </Text>
          }
        />

        {/* ➕ Botón Añadir */}
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: settings.theme === "dark" ? "#2F3A9D" : "#3C4FCE" },
          ]}
          onPress={() => navigation.navigate("AddRecuerdos")}
        >
          <Text style={[styles.addButtonText, getFontSizeStyle(16)]}>
            + Añadir Recuerdo
          </Text>
        </TouchableOpacity>
      </View>
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
    width: width,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
  },
  content: { flex: 1, justifyContent: "space-between" },
  memoryCard: {
    flex: 1,
    borderRadius: 15,
    margin: 8,
    overflow: "hidden",
    elevation: 3,
  },
  memoryImage: {
    width: "100%",
    height: 120,
  },
  memoryInfo: {
    padding: 10,
  },
  memoryTitle: { fontWeight: "bold" },
  memoryDate: { marginTop: 4 },
  addButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 45,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  emptyText: { textAlign: "center" },
});

/* 🌞 / 🌙 Estilos por tema */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#333" },
  subtext: { color: "#777" },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFFFFF" },
  subtext: { color: "#AAAAAA" },
});
