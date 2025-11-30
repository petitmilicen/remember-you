import React from "react";
import { View, ScrollView } from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { styles } from "../../styles/HomePacienteStyles";
import MagicCard from "./MagicCard";

export default function GridMenuPaciente({ navigation, theme, getFontSize }) {
  return (
    <ScrollView
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Row 1: Featured Card (Wide) */}
      <View style={styles.row}>
        <MagicCard
          title="Recuerdos"
          icon={<Entypo name="images" size={40} color="#FFF" />}
          colors={["#a18cd1", "#fbc2eb"]} // Soft Purple to Pink
          size="wide"
          delay={100}
          onPress={() => navigation.navigate("Recuerdos")}
          fontSize={getFontSize(20)}
        />
      </View>

      {/* Row 2: Two Standard Cards */}
      <View style={styles.row}>
        <MagicCard
          title="Actividades"
          icon={<FontAwesome5 name="puzzle-piece" size={32} color="#FFF" />}
          colors={["#ff9a9e", "#fecfef"]} // Peach to Pink
          size="small"
          delay={200}
          onPress={() => navigation.navigate("Actividades")}
          fontSize={getFontSize(16)}
        />
        <MagicCard
          title="Bitácora"
          icon={<FontAwesome5 name="book" size={32} color="#FFF" />}
          colors={["#f6d365", "#fda085"]} // Warm Orange
          size="small"
          delay={300}
          onPress={() => navigation.navigate("Bitacora")}
          fontSize={getFontSize(16)}
        />
      </View>

      {/* Row 3: Tall Card + Stacked Small Cards (Simulated with Columns) */}
      <View style={styles.row}>
        <MagicCard
          title="Tarjetas"
          icon={<FontAwesome5 name="sticky-note" size={32} color="#FFF" />}
          colors={["#84fab0", "#8fd3f4"]} // Mint to Blue
          size="small"
          delay={400}
          onPress={() => navigation.navigate("Tarjetas")}
          fontSize={getFontSize(16)}
        />
        <MagicCard
          title="Ajustes"
          icon={<Ionicons name="settings-outline" size={32} color="#FFF" />}
          colors={theme === "dark" ? ["#434343", "#000000"] : ["#cfd9df", "#e2ebf0"]} // Gray Gradient
          size="small"
          delay={500}
          onPress={() => navigation.navigate("Ajustes")}
          fontSize={getFontSize(16)}
        />
      </View>

      {/* Row 4: Logout (Wide or Standard) */}
      <View style={styles.row}>
        <MagicCard
          title="Cerrar Sesión"
          icon={<MaterialIcons name="logout" size={32} color="#FFF" />}
          colors={["#ff758c", "#ff7eb3"]} // Red/Pink
          size="wide"
          delay={600}
          onPress={() => navigation.navigate("Logout")}
          fontSize={getFontSize(16)}
        />
      </View>
    </ScrollView>
  );
}
