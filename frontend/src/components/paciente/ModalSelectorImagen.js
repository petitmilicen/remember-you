import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export default function ModalSelectorImagen({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
}) {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View entering={FadeInDown.springify()} style={styles.box}>
              <LinearGradient
                colors={["#6A5ACD", "#48D1CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
              >
                <Text style={styles.title}>Cambiar Foto</Text>
              </LinearGradient>

              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.option}
                  onPress={onSelectCamera}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconContainer, { backgroundColor: "#E3F2FD" }]}>
                    <Ionicons name="camera" size={24} color="#2575fc" />
                  </View>
                  <Text style={styles.optionText}>Tomar foto</Text>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.option}
                  onPress={onSelectGallery}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconContainer, { backgroundColor: "#F3E5F5" }]}>
                    <Ionicons name="images" size={24} color="#6a11cb" />
                  </View>
                  <Text style={styles.optionText}>Galería</Text>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    letterSpacing: 1,
  },
  optionsContainer: {
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 5,
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FAFAFA",
  },
  cancelText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
});
