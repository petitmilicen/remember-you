import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AchievementBadge({ source, unlocked, title, description }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    // Solo mostrar modal si el logro está bloqueado
    if (!unlocked) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={unlocked ? 1 : 0.7} // Solo interactivo si está bloqueado
      >
        <Image
          source={source}
          style={[
            styles.image,
            !unlocked && styles.dimmed
          ]}
        />

        {!unlocked && (
          <View style={styles.lockOverlay}>
            <FontAwesome5 name="lock" size={30} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>

      {/* Modal con información del logro */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <FontAwesome5 name="lock" size={24} color="#F93827" />
              <Text style={styles.modalTitle}>{title}</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>¿Cómo desbloquear?</Text>
              <Text style={styles.modalDescription}>{description}</Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 85,
    height: 85,
    margin: 8,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  dimmed: {
    opacity: 0.55,
  },

  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },

  modalBody: {
    marginBottom: 20,
  },

  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F93827",
    marginBottom: 8,
  },

  modalDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },

  closeButton: {
    backgroundColor: "#F93827",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
