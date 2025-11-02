import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/CitasMedicasStyles";

export default function ModalCita({
  visible,
  onClose,
  onSave,
  doctor,
  setDoctor,
  descripcion,
  setDescripcion,
  fecha,
  setFecha,
  editando,
}) {
  const [mostrarPicker, setMostrarPicker] = useState(false);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>
            {editando ? "Editar Cita Médica" : "Nueva Cita Médica"}
          </Text>

          <TextInput
            placeholder="Nombre del médico o centro"
            style={styles.input}
            value={doctor}
            onChangeText={setDoctor}
          />

          <TextInput
            placeholder="Descripción (motivo, indicaciones...)"
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            multiline
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setMostrarPicker(true)}
          >
            <Ionicons name="calendar" size={18} color="#1976D2" />
            <Text style={styles.dateBtnText}>
              {fecha.toLocaleDateString()} —{" "}
              {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>

          {mostrarPicker && (
            <DateTimePicker
              value={fecha}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setMostrarPicker(false);
                if (selectedDate) setFecha(selectedDate);
              }}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#FF7043" }]}
              onPress={onSave}
            >
              <Text style={styles.modalBtnText}>
                {editando ? "Guardar Cambios" : "Agregar"}
              </Text>
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
