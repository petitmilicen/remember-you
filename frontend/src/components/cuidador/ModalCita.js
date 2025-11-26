import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
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
  status,
  setStatus,
  editando = false,
}) {
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [tempDate, setTempDate] = useState(fecha);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setMostrarPicker(false);

      if (event.type === "set" && selectedDate) {
        if (pickerMode === "date") {
          setTempDate(selectedDate);
          setPickerMode("time");
          setMostrarPicker(true);
        } else {
          const finalDate = new Date(tempDate);
          finalDate.setHours(selectedDate.getHours());
          finalDate.setMinutes(selectedDate.getMinutes());
          setFecha(finalDate);
        }
      }
    } else {
      if (event.type === "set" && selectedDate) {
        setFecha(selectedDate);
      }
      setMostrarPicker(false);
    }
  };

  const openPicker = () => {
    setTempDate(fecha);
    if (Platform.OS === 'android') {
      setPickerMode("date");
    }
    setMostrarPicker(true);
  };

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
            onPress={openPicker}
          >
            <Ionicons name="calendar" size={18} color="#1976D2" />
            <Text style={styles.dateBtnText}>
              {fecha.toLocaleDateString()} —{" "}
              {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>

          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Estado:</Text>
            <View style={styles.statusOptions}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  status === 'Scheduled' && styles.statusOptionActive,
                  { borderColor: '#2196F3' },
                ]}
                onPress={() => setStatus('Scheduled')}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === 'Scheduled' && { color: '#2196F3', fontWeight: 'bold' },
                  ]}
                >
                  Programada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusOption,
                  status === 'Completed' && styles.statusOptionActive,
                  { borderColor: '#4CAF50' },
                ]}
                onPress={() => setStatus('Completed')}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === 'Completed' && { color: '#4CAF50', fontWeight: 'bold' },
                  ]}
                >
                  Completada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusOption,
                  status === 'Cancelled' && styles.statusOptionActive,
                  { borderColor: '#F44336' },
                ]}
                onPress={() => setStatus('Cancelled')}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === 'Cancelled' && { color: '#F44336', fontWeight: 'bold' },
                  ]}
                >
                  Cancelada
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {mostrarPicker && (
            <DateTimePicker
              value={Platform.OS === 'android' && pickerMode === 'time' ? tempDate : fecha}
              mode={Platform.OS === 'android' ? pickerMode : "datetime"}
              display="default"
              onChange={handleDateChange}
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
