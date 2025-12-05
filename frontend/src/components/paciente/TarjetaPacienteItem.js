import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function TarjetaPacienteItem({ item, settings, getFontSize, onDelete, gradientColors }) {

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Función para traducir tipos de tarjetas a español
  const getCardTypeLabel = (type) => {
    const typeMap = {
      Message: "Mensaje",
      Other: "Otro",
      Emergency: "Emergencia",
    };
    return typeMap[type] || type;
  };

  const isCuidador = item.created_by === "cuidador";

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      style={[
        styles.container,
        { backgroundColor: settings.theme === "dark" ? "#1E1E1E" : "#FFF" }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: isCuidador ? "#E3F2FD" : "#E8F5E9" }]}>
            <Text style={{ fontSize: 16 }}>{isCuidador ? "👨‍⚕️" : "🧠"}</Text>
          </View>
          <View>
            <Text style={[styles.author, { color: settings.theme === "dark" ? "#FFF" : "#333" }]}>
              {isCuidador ? "Cuidador" : "Tú"}
            </Text>
            <Text style={[styles.date, { color: settings.theme === "dark" ? "#AAA" : "#888" }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>

        {!isCuidador && (
          <TouchableOpacity onPress={() => onDelete(item.card_id)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[
          styles.message,
          { color: settings.theme === "dark" ? "#DDD" : "#444" },
          { fontSize: getFontSize(16) }
        ]}>
          {item.message}
        </Text>

        <View style={[styles.tag, { borderColor: gradientColors[0] }]}>
          <Text style={[styles.tagText, { color: gradientColors[1] }]}>
            {getCardTypeLabel(item.card_type)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  author: {
    fontWeight: "bold",
    fontSize: 14,
  },
  date: {
    fontSize: 10,
    marginTop: 2,
  },
  deleteButton: {
    padding: 5,
  },
  content: {
    paddingLeft: 46, // Align with text start
  },
  message: {
    lineHeight: 24,
    marginBottom: 10,
  },
  tag: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 5,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
