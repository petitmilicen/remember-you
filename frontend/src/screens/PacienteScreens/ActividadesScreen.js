// src/screens/PacienteScreens/ActividadesScreen.js
import React from "react";
import { View, Text, FlatList, StatusBar, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import ActividadCard from "../../components/paciente/ActividadCard";

export default function ActividadesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const theme = settings.theme;

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
      settings.fontSize === "large" ? base + 2 : base;

  // Magic Gradient for Actividades (Peach to Pink)
  const gradientColors = ["#ff9a9e", "#fecfef"];

  const actividades = [
    {
      title: "Memorice",
      subtitle: "Jugar Memorice →",
      image: require("../../assets/images/memori.jpg"),
      route: "Memorice",
    },
    {
      title: "Camino correcto",
      subtitle: "Llega a la meta →",
      image: require("../../assets/images/caminocorrecto.png"),
      route: "CaminoCorrecto",
    },
    {
      title: "Sudoku",
      subtitle: "Resolver ahora →",
      image: require("../../assets/images/sudoku.png"),
      route: "Sudoku",
    },
    {
      title: "Rompecabezas",
      subtitle: "Armar ahora →",
      image: require("../../assets/images/rompecabezas.png"),
      route: "Puzzle",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#0D0D0D" : "#F5F5F5" }]}>
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
          <Text style={[styles.headerTitle, { fontSize: 28 }]}>Actividades</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      {/* Lista de actividades */}
      <FlatList
        data={actividades}
        keyExtractor={(item) => item.title}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ActividadCard
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            onPress={() => navigation.navigate(item.route)}
            theme={theme}
            getFontSize={getFontSize}
            delay={index * 100}
            gradientColors={gradientColors}
            small // Prop to indicate small card size
          />
        )}
      />
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
  listContent: {
    padding: 10,
    paddingBottom: 50,
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap: 10,
  },
});
