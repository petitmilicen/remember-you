import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/HomeCuidadorStyles.js";
import { ACCENT } from "../../utils/constants";

export default function PacientePanel({ paciente, navigation }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Paciente asignado</Text>

      {paciente ? (
        <>
          <Text style={styles.mainText}>{paciente.nombre}</Text>
          <Text style={styles.subText}>Edad: {paciente.edad}</Text>
          <Text style={styles.subText}>Nivel de Alzheimer: {paciente.nivel}</Text>
        </>
      ) : (
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <Text style={[styles.subText, { marginBottom: 10 }]}>
            No hay paciente vinculado aún.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: ACCENT,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
            onPress={() => navigation.navigate("LectorQR")}
          >
            <Ionicons name="qr-code" size={18} color="#FFF" />
            <Text style={{ color: "#FFF", fontWeight: "700" }}>
              Escanear QR de paciente
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
