import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { styles } from "../../styles/HomeCuidadorStyles.js";

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
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Nueva Tarjeta</Text>

          <TextInput
            style={styles.input}
            placeholder="Tipo de tarjeta (recordatorio, foto, etc.)"
            value={nuevoTipo}
            onChangeText={setNuevoTipo}
          />

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
              onPress={onSave}
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
