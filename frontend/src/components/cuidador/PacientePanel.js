import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../styles/HomeCuidadorStyles.js";
import { ACCENT } from "../../utils/constants";
import { unassignPatient } from "../../api/userService";

export default function PacientePanel({ paciente, navigation }) {
  const handleUnassign = async () => {
    Alert.alert(
      "Desvincular paciente",
      "¿Estás seguro de que deseas desvincular a este paciente? Se eliminará la zona segura asociada.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desvincular",
          style: "destructive",
          onPress: async () => {
            try {
              // 1️⃣ Desvincular paciente del backend
              await unassignPatient();

              // 2️⃣ Limpiar datos locales del paciente
              await AsyncStorage.removeItem("pacienteAsignado");

              // 3️⃣ 🗑️ Eliminar zona segura local
              await AsyncStorage.removeItem("zonaSegura");

              // 4️⃣ 🗑️ Limpiar ubicación guardada
              await AsyncStorage.removeItem("ubicacionPaciente");

              Alert.alert("Éxito", "Paciente y zona segura eliminados correctamente.", [
                { text: "OK", onPress: () => navigation.replace("HomeCuidador") }
              ]);
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.error || "No se pudo desvincular al paciente."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Paciente asignado</Text>

      {paciente ? (
        <>
          <Text style={styles.mainText}>{paciente.full_name || paciente.username || paciente.nombre || 'Sin nombre'}</Text>
          <Text style={styles.subText}>Edad: {paciente.age || paciente.edad || 'No especificada'}</Text>
          <Text style={styles.subText}>Nivel de Alzheimer: {paciente.alzheimer_level || paciente.nivel || 'No especificado'}</Text>

          <TouchableOpacity
            style={{
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#FF6B6B",
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
            onPress={handleUnassign}
          >
            <Ionicons name="remove-circle-outline" size={16} color="#FF6B6B" />
            <Text style={{ color: "#FF6B6B", fontSize: 13, fontWeight: "600" }}>
              Desvincular paciente
            </Text>
          </TouchableOpacity>
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
