import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "../../styles/HomePacienteStyles";

export default function MenuCard({ icon, color, label, onPress, fontSize }) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.cardText, { fontSize }]}>{label}</Text>
    </TouchableOpacity>
  );
}
