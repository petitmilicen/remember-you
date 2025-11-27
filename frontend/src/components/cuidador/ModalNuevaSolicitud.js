import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/RedApoyoStyles";

const ACCENT = "#FF7043";

const MOTIVOS_COMUNES = [
  "Cita médica personal",
  "Emergencia familiar",
  "Descanso programado",
  "Compromiso laboral",
  "Otro motivo",
];

export default function ModalNuevaSolicitud({
  visible,
  onClose,
  motivo,
  setMotivo,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  nota,
  setNota,
  onCreate,
}) {
  const [motivoSeleccionado, setMotivoSeleccionado] = React.useState("");

  const handleSelectMotivo = (m) => {
    setMotivoSeleccionado(m);
    if (m !== "Otro motivo") {
      setMotivo(m);
    } else {
      setMotivo("");
    }
  };

  const handleCreate = () => {
    onCreate();
    setMotivoSeleccionado("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Ionicons name="add-circle-outline" size={24} color={ACCENT} />
            <Text style={styles.modalTitle}> Nueva Solicitud de Apoyo</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: "#455A64", marginBottom: 8 }}>
              Motivo del apoyo:
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {MOTIVOS_COMUNES.map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => handleSelectMotivo(m)}
                  style={{
                    backgroundColor: motivoSeleccionado === m ? ACCENT : "#F5F5F5",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: motivoSeleccionado === m ? ACCENT : "#E0E0E0",
                  }}
                >
                  <Text
                    style={{
                      color: motivoSeleccionado === m ? "#FFF" : "#757575",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {motivoSeleccionado === "Otro motivo" && (
              <TextInput
                style={styles.input}
                placeholder="Especifica el motivo"
                value={motivo}
                onChangeText={setMotivo}
              />
            )}

            <Text style={{ fontSize: 13, fontWeight: "600", color: "#455A64", marginBottom: 8, marginTop: 8 }}>
              Fecha y hora de inicio:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 14/12/2025 09:00"
              value={fechaDesde}
              onChangeText={setFechaDesde}
            />

            <Text style={{ fontSize: 13, fontWeight: "600", color: "#455A64", marginBottom: 8 }}>
              Fecha y hora de fin:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 14/12/2025 15:00"
              value={fechaHasta}
              onChangeText={setFechaHasta}
            />

            <Text style={{ fontSize: 13, fontWeight: "600", color: "#455A64", marginBottom: 8 }}>
              Notas para el suplente (opcional):
            </Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Ej: El paciente almuerza a las 13:00, medicamento a las 16:00"
              multiline
              value={nota}
              onChangeText={setNota}
            />
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: ACCENT }]}
              onPress={handleCreate}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFF" />
              <Text style={styles.modalBtnText}> Crear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#9E9E9E" }]}
              onPress={onClose}
            >
              <Ionicons name="close-circle" size={18} color="#FFF" />
              <Text style={styles.modalBtnText}> Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
