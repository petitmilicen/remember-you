import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/HomeCuidadorStyles.js";

export default function AlertasPanel({ alertas }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Alertas recientes</Text>

      {alertas.length === 0 ? (
        <Text style={styles.muted}>Sin alertas activas</Text>
      ) : (
        alertas.map((a) => (
          <View key={a.id} style={styles.alertBox}>
            <Ionicons
              name={a.tipo === "Emergencia" ? "alert-circle" : "notifications"}
              size={18}
              color={a.tipo === "Emergencia" ? "#E57373" : "#81C784"}
            />
            <Text style={styles.alertMessage}>{a.mensaje}</Text>
            <Text style={styles.alertDate}>{a.fecha}</Text>
          </View>
        ))
      )}
    </View>
  );
}
