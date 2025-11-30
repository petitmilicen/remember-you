import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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

  // Date picker states
  const [dateDesde, setDateDesde] = React.useState(new Date());
  const [timeDesde, setTimeDesde] = React.useState(new Date());
  const [dateHasta, setDateHasta] = React.useState(new Date());
  const [timeHasta, setTimeHasta] = React.useState(new Date());

  const [showDateDesde, setShowDateDesde] = React.useState(false);
  const [showTimeDesde, setShowTimeDesde] = React.useState(false);
  const [showDateHasta, setShowDateHasta] = React.useState(false);
  const [showTimeHasta, setShowTimeHasta] = React.useState(false);

  const handleSelectMotivo = (m) => {
    setMotivoSeleccionado(m);
    if (m !== "Otro motivo") {
      setMotivo(m);
    } else {
      setMotivo("");
    }
  };

  const formatDateTime = (date, time) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const onChangeDateDesde = (event, selectedDate) => {
    setShowDateDesde(Platform.OS === 'ios');
    if (selectedDate) {
      setDateDesde(selectedDate);
      setFechaDesde(formatDateTime(selectedDate, timeDesde));
    }
  };

  const onChangeTimeDesde = (event, selectedTime) => {
    setShowTimeDesde(Platform.OS === 'ios');
    if (selectedTime) {
      setTimeDesde(selectedTime);
      setFechaDesde(formatDateTime(dateDesde, selectedTime));
    }
  };

  const onChangeDateHasta = (event, selectedDate) => {
    setShowDateHasta(Platform.OS === 'ios');
    if (selectedDate) {
      setDateHasta(selectedDate);
      setFechaHasta(formatDateTime(selectedDate, timeHasta));
    }
  };

  const onChangeTimeHasta = (event, selectedTime) => {
    setShowTimeHasta(Platform.OS === 'ios');
    if (selectedTime) {
      setTimeHasta(selectedTime);
      setFechaHasta(formatDateTime(dateHasta, selectedTime));
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
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              <TouchableOpacity
                style={[styles.input, { flex: 1, justifyContent: "center", paddingHorizontal: 12 }]}
                onPress={() => setShowDateDesde(true)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="calendar-outline" size={20} color="#757575" />
                  <Text style={{ color: dateDesde ? "#212121" : "#9E9E9E", fontSize: 14 }}>
                    {dateDesde.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.input, { flex: 1, justifyContent: "center", paddingHorizontal: 12 }]}
                onPress={() => setShowTimeDesde(true)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="time-outline" size={20} color="#757575" />
                  <Text style={{ color: timeDesde ? "#212121" : "#9E9E9E", fontSize: 14 }}>
                    {timeDesde.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {showDateDesde && (
              <DateTimePicker
                value={dateDesde}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDateDesde}
                minimumDate={new Date()}
              />
            )}

            {showTimeDesde && (
              <DateTimePicker
                value={timeDesde}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeTimeDesde}
                is24Hour={true}
              />
            )}

            <Text style={{ fontSize: 13, fontWeight: "600", color: "#455A64", marginBottom: 8 }}>
              Fecha y hora de fin:
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              <TouchableOpacity
                style={[styles.input, { flex: 1, justifyContent: "center", paddingHorizontal: 12 }]}
                onPress={() => setShowDateHasta(true)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="calendar-outline" size={20} color="#757575" />
                  <Text style={{ color: dateHasta ? "#212121" : "#9E9E9E", fontSize: 14 }}>
                    {dateHasta.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.input, { flex: 1, justifyContent: "center", paddingHorizontal: 12 }]}
                onPress={() => setShowTimeHasta(true)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="time-outline" size={20} color="#757575" />
                  <Text style={{ color: timeHasta ? "#212121" : "#9E9E9E", fontSize: 14 }}>
                    {timeHasta.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {showDateHasta && (
              <DateTimePicker
                value={dateHasta}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDateHasta}
                minimumDate={dateDesde}
              />
            )}

            {showTimeHasta && (
              <DateTimePicker
                value={timeHasta}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeTimeHasta}
                is24Hour={true}
              />
            )}

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
