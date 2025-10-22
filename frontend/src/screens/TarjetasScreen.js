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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";

const { width } = Dimensions.get("window");

export default function TarjetasScreen({ navigation }) {
  const [cards, setCards] = useState([]);
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

  // 🔄 Cargar tarjetas al enfocar
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadCards);
    return unsubscribe;
  }, [navigation]);

  const loadCards = async () => {
    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setCards(parsed);
      }
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
    }
  };

  const saveCards = async (newCards) => {
    try {
      await AsyncStorage.setItem("memoryCards", JSON.stringify(newCards));
    } catch (error) {
      console.error("Error guardando tarjetas:", error);
    }
  };

  const handleDeleteCard = (id) => {
    Alert.alert("Eliminar Tarjeta", "¿Seguro que quieres eliminar esta tarjeta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteCard(id),
      },
    ]);
  };

  const deleteCard = async (id) => {
    try {
      const updated = cards.filter((c) => c.id !== id);
      setCards(updated);
      await saveCards(updated);
    } catch (error) {
      console.error("Error eliminando tarjeta:", error);
    }
  };

  const renderCard = ({ item }) => {
    const isCuidador = item.creadoPor === "cuidador";
    const color = isCuidador
      ? settings.theme === "dark"
        ? "#3C3A1E"
        : "#FFF3CD"
      : settings.theme === "dark"
      ? "#2E3D2E"
      : "#D0F0C0";
    const bordeColor = isCuidador
      ? settings.theme === "dark"
        ? "#C9A13C"
        : "#FFB74D"
      : settings.theme === "dark"
      ? "#5FA77A"
      : "#81C784";

    return (
      <TouchableOpacity
        style={[
          styles.postIt,
          { backgroundColor: color, borderLeftColor: bordeColor },
        ]}
        onLongPress={() => handleDeleteCard(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.postItTipo, themeStyles.text, getFontSizeStyle(14)]}>
              {isCuidador ? "👨‍⚕️ Cuidador" : "🧠 Paciente"}
            </Text>
            <Text style={[styles.postItDate, themeStyles.subtext, getFontSizeStyle(12)]}>
              {item.date}
            </Text>
          </View>

          <Text
            style={[
              styles.postItMensaje,
              themeStyles.text,
              getFontSizeStyle(15),
            ]}
          >
            {item.mensaje}
          </Text>
          <Text
            style={[
              styles.postItTipoSecundario,
              themeStyles.subtext,
              getFontSizeStyle(12),
            ]}
          >
            {item.tipo}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.deleteButton, themeStyles.card]}
          onPress={() => handleDeleteCard(item.id)}
        >
          <FontAwesome5 name="trash" size={14} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const gradientColors =
    settings.theme === "dark"
      ? ["#008366", "#00C897"]
      : ["#00C897", "#00E0AC"];

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
              style={[
                styles.headerTitle,
                { textAlign: "center" },
                getFontSizeStyle(20),
              ]}
            >
              Tarjetas
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </LinearGradient>
      </View>

      {/* 🟨 Lista */}
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={
          cards.length === 0
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingBottom: 100 }
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, themeStyles.subtext, getFontSizeStyle(16)]}>
            No hay tarjetas todavía
          </Text>
        }
      />

      {/* ➕ Botón añadir */}
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor:
              settings.theme === "dark" ? "#009E7A" : "#00C897",
          },
        ]}
        onPress={() => navigation.navigate("AddTarjetas")}
      >
        <Text style={[styles.addButtonText, getFontSizeStyle(16)]}>
          + Añadir Tarjeta
        </Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
  },
  postIt: {
    flex: 1,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    minHeight: 130,
    justifyContent: "space-between",
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    transform: [{ rotate: "-1deg" }],
  },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  postItTipo: { fontWeight: "bold" },
  postItDate: {},
  postItMensaje: {
    fontStyle: "italic",
    marginVertical: 4,
  },
  postItTipoSecundario: { textAlign: "right" },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  addButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    margin: 20,
    marginBottom: 50,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  emptyText: { textAlign: "center" },
});

/* 🎨 Estilos por tema */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#333" },
  subtext: { color: "#666" },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFFFFF" },
  subtext: { color: "#AAAAAA" },
});
