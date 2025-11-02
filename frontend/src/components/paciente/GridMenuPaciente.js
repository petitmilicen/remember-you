import React from "react";
import { View } from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { styles } from "../../styles/HomePacienteStyles";
import MenuCard from "./MenuCard";

export default function GridMenuPaciente({ navigation, theme, getFontSize }) {
  return (
    <View style={styles.grid}>
      <MenuCard
        icon={<FontAwesome5 name="puzzle-piece" size={42} color="#FFF" />}
        color="#F93827"
        label="Actividades"
        onPress={() => navigation.navigate("Actividades")}
        fontSize={getFontSize(15)}
      />

      <MenuCard
        icon={<FontAwesome5 name="book" size={38} color="#FFF" />}
        color="#FEBA17"
        label="Bitácora"
        onPress={() => navigation.navigate("Bitacora")}
        fontSize={getFontSize(15)}
      />

      <MenuCard
        icon={<FontAwesome5 name="sticky-note" size={42} color="#FFF" />}
        color="#00C897"
        label="Tarjetas"
        onPress={() => navigation.navigate("Tarjetas")}
        fontSize={getFontSize(15)}
      />

      <MenuCard
        icon={<Entypo name="images" size={40} color="#FFF" />}
        color="#1A2A80"
        label="Recuerdos"
        onPress={() => navigation.navigate("Recuerdos")}
        fontSize={getFontSize(15)}
      />

      <MenuCard
        icon={<Ionicons name="settings-outline" size={42} color="#FFF" />}
        color={theme === "dark" ? "#444" : "#888"}
        label="Ajustes"
        onPress={() => navigation.navigate("Ajustes")}
        fontSize={getFontSize(15)}
      />

      <MenuCard
        icon={<MaterialIcons name="logout" size={42} color="#FFF" />}
        color="#FF9BDE"
        label="Salida"
        onPress={() => navigation.navigate("Welcome")}
        fontSize={getFontSize(15)}
      />
    </View>
  );
}
