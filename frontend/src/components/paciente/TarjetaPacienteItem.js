import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { styles } from "../../styles/TarjetasStyles";

export default function TarjetaPacienteItem({ item, themeStyles, settings, getFontSize, onDelete }) {
  const isCuidador = item.creadoPor === "cuidador";
  const fondo = isCuidador
    ? settings.theme === "dark"
      ? "#3C3A1E"
      : "#FFF3CD"
    : settings.theme === "dark"
    ? "#2E3D2E"
    : "#D0F0C0";

  const borde = isCuidador
    ? settings.theme === "dark"
      ? "#C9A13C"
      : "#FFB74D"
    : settings.theme === "dark"
    ? "#5FA77A"
    : "#81C784";

  return (
    <TouchableOpacity
      style={[styles.postIt, { backgroundColor: fondo, borderLeftColor: borde }]}
      onLongPress={() => onDelete(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.postItTipo, themeStyles.text, { fontSize: getFontSize(14) }]}>
            {isCuidador ? "👨‍⚕️ Cuidador" : "🧠 Paciente"}
          </Text>
          <Text style={[styles.postItDate, themeStyles.subtext, { fontSize: getFontSize(12) }]}>
            {item.created_at}
          </Text>
        </View>

        <Text style={[styles.postItMensaje, themeStyles.text, { fontSize: getFontSize(15) }]}>
          {item.message}
        </Text>

        <Text style={[styles.postItTipoSecundario, themeStyles.subtext, { fontSize: getFontSize(12) }]}>
          {item.card_type}
        </Text>
      </View>

      <TouchableOpacity style={[styles.deleteButton, themeStyles.card]} onPress={() => onDelete(item.card_id)}>
        <FontAwesome5 name="trash" size={14} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
