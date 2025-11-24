import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { styles } from "../../styles/HomeCuidadorStyles.js";
import { Picker } from "@react-native-picker/picker";

export default function NuevaTarjetaModal({
  visible,
  onClose,
  nuevoTipo,
  setNuevoTipo,
  nuevoMensaje,
  setNuevoMensaje,
  onSave,
  accentColor,
}) {
  // Los valores deben coincidir EXACTAMENTE con Card.CardType del modelo:
  // MESSAGE = 'Message', OTHER = 'Other', EMERGENCY = 'Emergency'
  const cardOptions = [
    { label: "Seleccione tipo de tarjeta...", value: "" },
    { label: "Mensaje", value: "Message" },
    { label: "Otro", value: "Other" },
    { label: "Emergencia", value: "Emergency" },
  ];

  const handleSave = () => {
    // si quieres validación mínima antes de guardar:
    if (!nuevoTipo || !nuevoMensaje.trim()) {
      // aquí puedes usar Alert si quieres, o simplemente no guardar
      // Alert.alert("Campos incompletos", "Selecciona un tipo y escribe un mensaje");
      return;
    }
    onSave();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Nueva Tarjeta</Text>

          <View style={styles.input}>
            <Picker
              selectedValue={nuevoTipo}
              onValueChange={(itemValue) => setNuevoTipo(itemValue)}
            >
              {cardOptions.map((opt) => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>

          {/* Mensaje */}
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Mensaje"
            multiline
            value={nuevoMensaje}
            onChangeText={setNuevoMensaje}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: accentColor }]}
              onPress={handleSave}
            >
              <Text style={styles.modalBtnText}>Guardar</Text>
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
