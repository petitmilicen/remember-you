import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/CitasMedicasStyles";

export default function CitaItem({ item, onEdit, onDelete }) {
  const futura = item.timestamp > Date.now();

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: futura ? "#64B5F6" : "#BDBDBD" },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.cardTitle,
            { color: futura ? "#0D47A1" : "#757575" },
          ]}
        >
          {item.doctor}
        </Text>
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
