// src/screens/PacienteScreens/DetalleRecuerdosScreen.js
import React from "react";
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import useDetalleRecuerdo from "../../hooks/useDetalleRecuerdo";
import { styles, lightStyles, darkStyles } from "../../styles/DetalleRecuerdosStyles";

export default function DetalleRecuerdosScreen({ route, navigation }) {
  const { memory } = route.params;
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;
  const { handleDelete } = useDetalleRecuerdo(navigation, memory);

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
    settings.fontSize === "large" ? base + 2 : base;

  const gradientColors =
    settings.theme === "dark" ? ["#101A50", "#202E8A"] : ["#1A2A80", "#3C4FCE"];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={gradientColors} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { flex: 1, textAlign: "center", fontSize: getFontSize(20) }]}>
          Detalle del Recuerdo
        </Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* Contenido */}
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {memory.image && <Image source={{ uri: memory.image }} style={styles.image} />}
          <Text style={[styles.date, themeStyles.subtext, { fontSize: getFontSize(13) }]}>{memory.date}</Text>
          <Text style={[styles.title, themeStyles.text, { fontSize: getFontSize(22) }]}>{memory.title}</Text>
          <Text style={[styles.description, themeStyles.subtext, { fontSize: getFontSize(16) }]}>
            {memory.description}
          </Text>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.deleteButton,
            { backgroundColor: settings.theme === "dark" ? "#B22A2A" : "#E53935" },
          ]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteButtonText, { fontSize: getFontSize(16) }]}>Eliminar Recuerdo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
