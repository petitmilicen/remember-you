import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/HomeCuidadorStyles.js";
import { ACCENT } from "../../utils/constants";

export default function TarjetasPanel({ tarjetas, onAddPress, onDelete }) {
  return (
    <View style={styles.panel}>
      <View style={styles.rowBetween}>
        <Text style={styles.panelTitle}>Tarjetas compartidas</Text>
        <TouchableOpacity onPress={onAddPress}>
          <Ionicons name="add-circle" size={26} color={ACCENT} />
        </TouchableOpacity>
      </View>

      {tarjetas.length === 0 ? (
        <Text style={styles.muted}>No hay tarjetas creadas aún</Text>
      ) : (
        tarjetas.map((t) => {
          const isCuidador = t.creadoPor === "cuidador";
          const fondo = isCuidador ? "#E3F2FD" : "#E8F5E9";
          const borde = isCuidador ? "#64B5F6" : "#81C784";

          return (
            <View
              key={t.id}
              style={[styles.cardNote, { backgroundColor: fondo, borderLeftColor: borde }]}
            >
              <View style={styles.tarjetaHeaderRow}>
                <Text style={styles.tarjetaAutor}>
                  {isCuidador ? "👨‍⚕️ Cuidador" : "🧠 Paciente"}
                </Text>
                <TouchableOpacity onPress={() => onDelete(t.id)}>
                  <Ionicons name="trash-outline" size={18} color="#E53935" />
                </TouchableOpacity>
              </View>

              <Text style={styles.tarjetaMensaje}>{t.mensaje}</Text>
              <Text style={styles.tarjetaTipo}>{t.tipo}</Text>
              <Text style={styles.tarjetaFecha}>{t.date}</Text>
            </View>
          );
        })
      )}
    </View>
  );
}
