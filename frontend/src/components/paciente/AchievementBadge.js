import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AchievementBadge({ source, unlocked }) {
  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={[
          styles.image,
          !unlocked && styles.dimmed   // solo oscurece un poco
        ]}
      />

      {!unlocked && (
        <View style={styles.lockOverlay}>
          <FontAwesome5 name="lock" size={30} color="#FFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 85,
    height: 85,
    margin: 8,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  // ⭐ Gris translúcido suave SIN perder textura del parche
  dimmed: {
    opacity: 0.55, // deja ver los colores, pero suavizados
  },

  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.18)", // ⭐ gris muy suave
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
