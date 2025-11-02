import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/BitacoraCuidadorStyles";

export default function RegistroItem({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardCategory}>{item.categoria}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => onEdit(item)}>
            <Ionicons name="create-outline" size={18} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Ionicons name="trash-outline" size={18} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.cardDesc}>{item.descripcion}</Text>
      <Text style={styles.cardDate}>
        📅 {item.fecha} • ⏰ {item.hora}
      </Text>
    </View>
  );
}
