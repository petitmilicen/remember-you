import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { styles } from "../../styles/RedApoyoStyles";

const ACCENT = "#FF7043";

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
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Nueva solicitud</Text>

          <TextInput
            style={styles.input}
            placeholder="Motivo del apoyo"
            value={motivo}
            onChangeText={setMotivo}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha y hora de inicio (ej: 14/10/2025 09:00)"
            value={fechaDesde}
            onChangeText={setFechaDesde}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha y hora de fin (ej: 14/10/2025 15:00)"
            value={fechaHasta}
            onChangeText={setFechaHasta}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Nota para el suplente (opcional)"
            multiline
            value={nota}
            onChangeText={setNota}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: ACCENT }]}
              onPress={onCreate}
            >
              <Text style={styles.modalBtnText}>Crear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#BDBDBD" }]}
              onPress={onClose}
            >
              <Text style={styles.modalBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
