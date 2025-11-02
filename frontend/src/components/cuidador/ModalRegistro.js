import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "../../styles/BitacoraCuidadorStyles";

export default function ModalRegistro({
  visible,
  onClose,
  onSave,
  categoria,
  setCategoria,
  descripcion,
  setDescripcion,
  editando = false,
  dark = false,
}) {
  const bgColor = dark ? "#1E1E1E" : "#FFFFFF";
  const textColor = dark ? "#FFF" : "#222";
  const inputBorder = dark ? "#444" : "#CCC";

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalBox, { backgroundColor: bgColor }]}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: dark ? "#A88BFF" : "#3C4FCE" },
                ]}
              >
                {editando ? "Editar Registro" : "Nuevo Registro"}
              </Text>

              <TextInput
                placeholder="Categoría (Medicación, Alimentación...)"
                placeholderTextColor={dark ? "#AAA" : "#777"}
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor: inputBorder,
                    backgroundColor: dark ? "#121212" : "#FAFAFA",
                  },
                ]}
                value={categoria}
                onChangeText={setCategoria}
              />

              <TextInput
                placeholder="Descripción del evento..."
                placeholderTextColor={dark ? "#AAA" : "#777"}
                style={[
                  styles.input,
                  {
                    height: 100,
                    textAlignVertical: "top",
                    color: textColor,
                    borderColor: inputBorder,
                    backgroundColor: dark ? "#121212" : "#FAFAFA",
                  },
                ]}
                multiline
                value={descripcion}
                onChangeText={setDescripcion}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    { backgroundColor: dark ? "#A88BFF" : "#3C4FCE" },
                  ]}
                  onPress={onSave}
                >
                  <Text style={styles.modalBtnText}>
                    {editando ? "Guardar" : "Agregar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    { backgroundColor: dark ? "#BDBDBD30" : "#BDBDBD" },
                  ]}
                  onPress={onClose}
                >
                  <Text style={styles.modalBtnText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
