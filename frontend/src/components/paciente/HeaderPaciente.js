import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/HomePacienteStyles";

export default function HeaderPaciente({
  navigation,
  fotoPerfil,
  nombrePaciente,
  theme,
  getFontSize,
  insets,
}) {
  const [greeting, setGreeting] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 19) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");

    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const dayName = days[now.getDay()];
    const dayNum = now.getDate();
    const monthName = months[now.getMonth()];

    setDate(`${dayName}, ${dayNum} de ${monthName} `);
  }, []);

  // Define gradient colors (match Login screen exactly, regardless of theme)
  const gradientColors = ["#6A5ACD", "#48D1CC"];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.headerGradient, { paddingTop: insets.top + 30 }]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigation.navigate("PerfilPaciente")}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={60} color="#FFF" />
          )}
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={[styles.subText, { color: "#E0E0E0", fontSize: getFontSize(14), textTransform: 'capitalize' }]}>
            {date}
          </Text>
          <Text style={[styles.greeting, { color: "#FFF", fontSize: getFontSize(24) }]}>
            {greeting},
          </Text>
          <Text style={[styles.greeting, { color: "#FFF", fontSize: getFontSize(24), fontWeight: "bold" }]}>
            {nombrePaciente}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
