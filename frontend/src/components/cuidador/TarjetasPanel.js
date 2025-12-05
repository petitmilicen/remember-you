import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { styles as homeStyles } from "../../styles/HomeCuidadorStyles.js";
import { ACCENT } from "../../utils/constants";

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

function TarjetaItem({ item, onDelete, index }) {
  const isCuidador = item.creadoPor === "cuidador";
  const gradientColors = isCuidador ? ["#64B5F6", "#1976D2"] : ["#81C784", "#388E3C"];

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={styles.cardContainer}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.iconContainer, { backgroundColor: isCuidador ? "#E3F2FD" : "#E8F5E9" }]}>
            <Text style={{ fontSize: 16 }}>{isCuidador ? "👨‍⚕️" : "🧠"}</Text>
          </View>
          <View>
            <Text style={styles.cardAuthor}>
              {isCuidador ? "Cuidador" : "Paciente"}
            </Text>
            <Text style={styles.cardDate}>
              {formatDate(item.created_at || item.date)}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardMessage}>{item.mensaje}</Text>

        <View style={[styles.tag, { borderColor: gradientColors[0] }]}>
          <Text style={[styles.tagText, { color: gradientColors[1] }]}>
            {getCardTypeLabel(item.tipo)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function TarjetasPanel({ tarjetas, onAddPress, onDelete }) {
  return (
    <View style={homeStyles.panel}>
      <View style={homeStyles.rowBetween}>
        <Text style={homeStyles.panelTitle}>Tarjetas compartidas</Text>
        <TouchableOpacity onPress={onAddPress}>
          <Ionicons name="add-circle" size={26} color={ACCENT} />
        </TouchableOpacity>
      </View>

      {tarjetas.length === 0 ? (
        <Text style={homeStyles.muted}>No hay tarjetas creadas aún</Text>
      ) : (
        tarjetas.map((t, index) => (
          <TarjetaItem key={t.id} item={t} onDelete={onDelete} index={index} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 15,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardHeaderLeft: {
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
  cardAuthor: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  cardDate: {
    fontSize: 10,
    marginTop: 2,
    color: "#888",
  },
  deleteButton: {
    padding: 5,
  },
  cardContent: {
    paddingLeft: 46,
  },
  cardMessage: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
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
