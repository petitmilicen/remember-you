// src/screens/PacienteScreens/AjustesScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAjustes from "../../hooks/useAjustes";
import AjusteOpcion from "../../components/paciente/AjusteOpcion";

export default function AjustesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    settings,
    toggleTheme,
    changeFontSize,
    getFontSizeStyle,
    activeColor,
    circleBg,
    circleBorder,
  } = useAjustes();

  // Magic Gradient for Ajustes (Gray/Black)
  const gradientColors = settings.theme === "dark"
    ? ["#434343", "#000000"]
    : ["#cfd9df", "#e2ebf0"];

  const headerTextColor = settings.theme === "dark" ? "#FFF" : "#333";
  const iconColor = settings.theme === "dark" ? "#FFF" : "#333";

  return (
    <View style={[styles.container, { backgroundColor: settings.theme === "dark" ? "#0D0D0D" : "#F5F5F5" }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={settings.theme === "dark" ? "light-content" : "dark-content"} />

      {/* Magic Header */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={45} color={iconColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 28, color: headerTextColor }]}>Ajustes</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Apariencia Section */}
        <Text style={[styles.sectionTitle, { color: settings.theme === "dark" ? "#AAA" : "#666" }]}>
          APARIENCIA
        </Text>

        <View style={styles.sectionContainer}>
          <AjusteOpcion
            icon={
              <Ionicons
                name={settings.theme === "dark" ? "moon" : "sunny"}
                size={24}
                color={activeColor}
              />
            }
            title={`Modo ${settings.theme === "dark" ? "Oscuro" : "Claro"}`}
            subtitle={settings.theme === "dark" ? "Activado" : "Desactivado"}
            onPress={toggleTheme}
            settings={settings}
            getFontSizeStyle={getFontSizeStyle}
            right={
              <View
                style={[
                  styles.toggle,
                  settings.theme === "dark" ? { backgroundColor: activeColor } : { backgroundColor: "#CCC" },
                ]}
              >
                <View style={[styles.toggleCircle, settings.theme === "dark" && { transform: [{ translateX: 20 }] }]} />
              </View>
            }
          />
        </View>

        {/* Tamaño de Texto Section */}
        <Text style={[styles.sectionTitle, { color: settings.theme === "dark" ? "#AAA" : "#666", marginTop: 25 }]}>
          TAMAÑO DE TEXTO
        </Text>

        <View style={styles.sectionContainer}>
          {["small", "medium", "large"].map((size, index) => (
            <AjusteOpcion
              key={size}
              delay={index * 100}
              icon={
                <View
                  style={[
                    styles.sizeCircle,
                    {
                      backgroundColor: settings.fontSize === size ? activeColor : circleBg,
                      borderColor: circleBorder
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeLetter,
                      {
                        color: settings.fontSize === size ? "#FFF" : (settings.theme === "dark" ? "#FFF" : "#333"),
                        fontSize: size === "small" ? 12 : size === "medium" ? 16 : 20
                      }
                    ]}
                  >
                    A
                  </Text>
                </View>
              }
              title={
                size === "small" ? "Pequeño" : size === "medium" ? "Mediano" : "Grande"
              }
              subtitle={
                size === "small" ? "Texto compacto" : size === "medium" ? "Estándar" : "Más legible"
              }
              onPress={() => changeFontSize(size)}
              settings={settings}
              getFontSizeStyle={getFontSizeStyle}
              right={
                settings.fontSize === size && (
                  <Ionicons name="checkmark-circle" size={24} color={activeColor} />
                )
              }
            />
          ))}
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
    fontWeight: "bold",
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
    letterSpacing: 1,
  },
  sectionContainer: {
    gap: 15,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: "center",
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sizeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  sizeLetter: {
    fontWeight: "bold",
  },
});
