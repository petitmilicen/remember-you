import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";

const { width } = Dimensions.get("window");
const GUTTER = 20;

export default function AjustesScreen({ navigation }) {
  const { settings, toggleTheme, changeFontSize } = useSettings();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;
  const insets = useSafeAreaInsets();

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
    settings.theme === "dark" ? ["#5B3AB4", "#7D5FE5"] : ["#8A6DE9", "#A88BFF"];

  const activeColor = settings.theme === "dark" ? "#BB86FC" : "#6200EE";
  const circleBg = settings.theme === "dark" ? "#1E1E1E" : "rgba(98,0,238,0.1)";
  const circleBorder = settings.theme === "dark" ? "#BB86FC" : "#6200EE";

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 🔹 HEADER */}
      <View style={styles.headerWrap}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Ajustes</Text>
          </View>

          <View style={{ width: 28 }} />
        </LinearGradient>
      </View>

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <SafeAreaView style={styles.safeContent} edges={["bottom", "left", "right"]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* 🌈 Apariencia */}
          <Text style={[styles.sectionTitle, themeStyles.text, getFontSizeStyle(18)]}>
            Apariencia
          </Text>

          <TouchableOpacity style={styles.option} onPress={toggleTheme}>
            <Ionicons
              name={settings.theme === "dark" ? "moon" : "sunny"}
              size={28}
              color={activeColor}
            />
            <View style={styles.textContainer}>
              <Text style={[styles.optionText, themeStyles.text, getFontSizeStyle()]}>
                Modo {settings.theme === "dark" ? "Oscuro" : "Claro"}
              </Text>
              <Text
                style={[
                  styles.optionSubtext,
                  themeStyles.subtext,
                  getFontSizeStyle(14),
                ]}
              >
                {settings.theme === "dark" ? "Activado" : "Desactivado"}
              </Text>
            </View>
            <View
              style={[styles.toggle, settings.theme === "dark" && styles.toggleActive]}
            >
              <View style={styles.toggleCircle} />
            </View>
          </TouchableOpacity>

          {/* 🔤 Tamaño de texto */}
          <Text
            style={[
              styles.sectionTitle,
              themeStyles.text,
              getFontSizeStyle(18),
              styles.sectionSpacing,
            ]}
          >
            Tamaño de Texto
          </Text>

          {["small", "medium", "large"].map((size) => (
            <TouchableOpacity
              key={size}
              style={styles.option}
              onPress={() => changeFontSize(size)}
            >
              <View
                style={[
                  styles.sizeCircle,
                  { backgroundColor: circleBg, borderColor: circleBorder },
                  settings.fontSize === size && {
                    backgroundColor: activeColor,
                    shadowColor: activeColor,
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    borderWidth: 0,
                    elevation: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sizeLetter,
                    settings.fontSize === size
                      ? { color: "#FFF", transform: [{ scale: 1.1 }] }
                      : { color: themeStyles.text.color },
                    size === "small" && styles.sizeLetterSmall,
                    size === "large" && styles.sizeLetterLarge,
                  ]}
                >
                  A
                </Text>
              </View>

              <View style={styles.textContainer}>
                <Text style={[styles.optionText, themeStyles.text, getFontSizeStyle()]}>
                  {size === "small" && "Pequeño"}
                  {size === "medium" && "Mediano"}
                  {size === "large" && "Grande"}
                </Text>
                <Text
                  style={[
                    styles.optionSubtext,
                    themeStyles.subtext,
                    getFontSizeStyle(14),
                  ]}
                >
                  {size === "small" && "Texto compacto"}
                  {size === "medium" && "Tamaño estándar"}
                  {size === "large" && "Texto más legible"}
                </Text>
              </View>

              {settings.fontSize === size && (
                <Ionicons name="checkmark" size={22} color={activeColor} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEDED", paddingHorizontal: GUTTER },

  headerWrap: {
    marginLeft: -GUTTER,
    marginRight: -GUTTER,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 5,
  },
  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: GUTTER,
    paddingBottom: 16,
  },
  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },

  safeContent: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingVertical: 20 },
  sectionTitle: { fontWeight: "bold", marginBottom: 20, marginTop: 10 },
  sectionSpacing: { marginTop: 40 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 10,
  },
  textContainer: { flex: 1, marginLeft: 15 },
  optionText: { fontWeight: "500" },
  optionSubtext: { marginTop: 2, opacity: 0.7 },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E0E0",
    padding: 2,
  },
  toggleActive: { backgroundColor: "#6200EE" },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  sizeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  sizeLetter: { fontWeight: "bold", fontSize: 16 },
  sizeLetterSmall: { fontSize: 13 },
  sizeLetterLarge: { fontSize: 20 },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#FFFFFF" },
  text: { color: "#000000" },
  subtext: { color: "#666666" },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  text: { color: "#FFFFFF" },
  subtext: { color: "#AAAAAA" },
});
