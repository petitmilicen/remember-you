// src/screens/PacienteScreens/ActividadesScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import ActividadCard from "../../components/paciente/ActividadCard";
import { styles, lightStyles, darkStyles } from "../../styles/ActividadesStyles";

export default function ActividadesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const theme = settings.theme;
  const themeStyles = theme === "dark" ? darkStyles : lightStyles;

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
    settings.fontSize === "large" ? base + 2 : base;

  const gradientColors =
    theme === "dark" ? ["#A82A2A", "#F93827"] : ["#F93827", "#FF6B6B"];

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
      title: "Sopa de letras",
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
        <Text style={[styles.headerTitle, { fontSize: getFontSize(20) }]}>
          Actividades
        </Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* 🔸 Lista de actividades */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {actividades.map((item) => (
          <ActividadCard
            key={item.title}
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            onPress={() => navigation.navigate(item.route)}
            theme={theme}
            getFontSize={getFontSize}
          />
        ))}
      </ScrollView>
    </View>
  );
}
