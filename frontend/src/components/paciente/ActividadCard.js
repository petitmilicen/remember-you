import React from "react";
import { TouchableOpacity, Text, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../styles/ActividadesStyles";

export default function ActividadCard({
  title,
  subtitle,
  image,
  onPress,
  theme,
  getFontSize,
}) {
  const overlayColors = theme === "dark"
    ? ["rgba(0,0,0,0.7)", "rgba(249,56,39,0.2)"]
    : ["rgba(249,56,39,0.85)", "rgba(249,56,39,0.2)"];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <ImageBackground
        source={image}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 20 }}
      >
        <LinearGradient colors={overlayColors} style={styles.overlay}>
          <Text style={[styles.cardTitle, { fontSize: getFontSize(18) }]}>{title}</Text>
          <Text style={[styles.cardCTA, { fontSize: getFontSize(14) }]}>{subtitle}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}
