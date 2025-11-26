import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/CitasMedicasStyles";

export default function CitaItem({ item, onEdit, onDelete }) {
  const futura = item.timestamp > Date.now();

  const getStatusColor = () => {
    switch (item.status) {
      case 'Completed':
        return '#4CAF50';
      case 'Cancelled':
        return '#F44336';
      case 'Scheduled':
      default:
        return '#2196F3';
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'Completed':
        return 'Completada';
      case 'Cancelled':
        return 'Cancelada';
      case 'Scheduled':
      default:
        return 'Programada';
    }
  };

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: futura ? "#64B5F6" : "#BDBDBD" },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text
            style={[
              styles.cardTitle,
              { color: futura ? "#0D47A1" : "#757575", flex: 1 },
            ]}
          >
            {item.doctor}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
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
