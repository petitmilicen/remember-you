import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AchievementBadge({ source, unlocked }) {
  return (
    <View style={styles.wrapper}>
      <Image
        source={source}
        style={[styles.image, !unlocked && styles.locked]}
      />

      {/* Candado si está bloqueado */}
      {!unlocked && (
        <View style={styles.lockOverlay}>
          <FontAwesome5 name="lock" size={26} color="#FFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 85,
    height: 85,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  locked: {
    tintColor: "#808080",
    opacity: 0.45,
  },

  lockOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
});
