import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/HomeCuidadorStyles.js";

export default function AlertasPanel({ alertas, onClear }) {
  // Limitar a las últimas 5 alertas recientes
  const alertasRecientes = alertas.slice(0, 5);

  return (
    <View style={styles.panel}>
      <View style={styles.rowBetween}>
        <Text style={styles.panelTitle}>Alertas recientes</Text>
        {alertas.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Ionicons name="trash-outline" size={18} color="#757575" />
          </TouchableOpacity>
        )}
      </View>

      {alertasRecientes.length === 0 ? (
        <Text style={styles.muted}>Sin alertas activas</Text>
      ) : (
        <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
          {alertasRecientes.map((a) => (
            <View
              key={a.id}
              style={[
                styles.alertBox,
                { borderLeftColor: a.tipo === "Emergencia" ? "#E57373" : "#81C784" },
              ]}
            >
              <Ionicons
                name={a.tipo === "Emergencia" ? "alert-circle" : "notifications"}
                size={18}
                color={a.tipo === "Emergencia" ? "#E57373" : "#81C784"}
              />
              <Text style={styles.alertMessage}>{a.mensaje}</Text>
              <Text style={styles.alertDate}>{a.fecha}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
