import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function ModalSelectorImagen({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
}) {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>

          <Text style={styles.title}>Seleccionar imagen</Text>

          <TouchableOpacity style={styles.option} onPress={onSelectCamera}>
            <FontAwesome5 name="camera" size={20} color="#6F52D6" />
            <Text style={styles.optionText}>Tomar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onSelectGallery}>
            <FontAwesome5 name="images" size={20} color="#6F52D6" />
            <Text style={styles.optionText}>Elegir de la galería</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#6F52D6",
  },
  option: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  cancel: {
    marginTop: 15,
  },
  cancelText: {
    fontSize: 16,
    color: "#6F52D6",
    fontWeight: "bold",
  },
});
