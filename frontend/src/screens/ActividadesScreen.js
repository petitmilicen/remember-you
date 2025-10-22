import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";

const { width } = Dimensions.get("window");

export default function ActividadesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

  // ✅ Función para aplicar el tamaño de texto dinámico
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

  const gradientColors =
    settings.theme === "dark"
      ? ["#A82A2A", "#F93827"]
      : ["#F93827", "#FF6B6B"];

  const overlayColors = (isDark) => [
    isDark ? "rgba(0,0,0,0.7)" : "rgba(249,56,39,0.85)",
    "rgba(249,56,39,0.2)",
  ];

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
              Actividades
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </LinearGradient>
      </View>

      {/* 🔸 Contenido */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 🧠 Memorice */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Memorice")}
        >
          <ImageBackground
            source={require("../assets/images/memori.jpg")}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={overlayColors(settings.theme === "dark")}
              style={styles.overlay}
            >
              <Text style={[styles.cardTitle, getFontSizeStyle(18)]}>
                Memorice
              </Text>
              <Text style={[styles.cardCTA, getFontSizeStyle(14)]}>
                Jugar Memorice →
              </Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* 🧭 Camino Correcto */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("CaminoCorrecto")}
        >
          <ImageBackground
            source={require("../assets/images/caminocorrecto.png")}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={overlayColors(settings.theme === "dark")}
              style={styles.overlay}
            >
              <Text style={[styles.cardTitle, getFontSizeStyle(18)]}>
                Camino correcto
              </Text>
              <Text style={[styles.cardCTA, getFontSizeStyle(14)]}>
                Llega a la meta →
              </Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* 🔠 Sopa de letras */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Sudoku")}
        >
          <ImageBackground
            source={require("../assets/images/sudoku.png")}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={overlayColors(settings.theme === "dark")}
              style={styles.overlay}
            >
              <Text style={[styles.cardTitle, getFontSizeStyle(18)]}>
                Sopa de letras
              </Text>
              <Text style={[styles.cardCTA, getFontSizeStyle(14)]}>
                Resolver ahora →
              </Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* 🧩 Rompecabezas */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Puzzle")}
        >
          <ImageBackground
            source={require("../assets/images/rompecabezas.png")}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={overlayColors(settings.theme === "dark")}
              style={styles.overlay}
            >
              <Text style={[styles.cardTitle, getFontSizeStyle(18)]}>
                Rompecabezas
              </Text>
              <Text style={[styles.cardCTA, getFontSizeStyle(14)]}>
                Armar ahora →
              </Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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

  scroll: { padding: 20 },

  card: {
    height: 150,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    justifyContent: "flex-end",
    padding: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 6,
  },
  cardCTA: { color: "#FFF" },
});

/* 🎨 Estilos por tema */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
});
