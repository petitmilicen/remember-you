import React from "react";
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
  const headerGradient =
    theme === "dark" ? ["#5C3CA6", "#7E5AE1"] : ["#8A6DE9", "#A88BFF"];

  return (
    <LinearGradient
      colors={headerGradient}
      style={[styles.header, { paddingTop: insets.top + 10 }]}
    >
      <TouchableOpacity onPress={() => navigation.navigate("PerfilPaciente")}>
        {fotoPerfil ? (
          <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={60} color="#FFF" />
        )}
      </TouchableOpacity>

      <View style={styles.headerText}>
        <Text style={[styles.greeting, { color: "#FFF", fontSize: getFontSize(18) }]}>
          Hola, <Text style={{ fontWeight: "bold" }}>{nombrePaciente}</Text>
        </Text>
        <Text style={[styles.subText, { color: "#EEE", fontSize: getFontSize(12) }]}>
          #001
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("PerfilPaciente")}>
          <Text
            style={[
              styles.profileLink,
              { color: "#FFF", fontSize: getFontSize(14) },
            ]}
          >
            Ver perfil ➜
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
