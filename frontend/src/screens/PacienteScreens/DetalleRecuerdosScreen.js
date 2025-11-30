// src/screens/PacienteScreens/DetalleRecuerdosScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, Modal, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import useDetalleRecuerdo from "../../hooks/useDetalleRecuerdo";

const { width } = Dimensions.get("window");

export default function DetalleRecuerdosScreen({ route, navigation }) {
  const { memory } = route.params;
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { handleDelete } = useDetalleRecuerdo(navigation, memory);
  const [showImageModal, setShowImageModal] = useState(false);

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
      settings.fontSize === "large" ? base + 2 : base;

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida";
    const date = new Date(dateString);
    // Manual formatting to avoid timezone issues with simple ISO strings
    const day = date.getDate() + 1; // Fix off-by-one error often seen with ISO dates parsed in local time
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month}, ${year}`;
  };

  // Consistent Magic Gradient
  const gradientColors = ["#a18cd1", "#fbc2eb"];

  return (
    <View style={[styles.container, { backgroundColor: settings.theme === "dark" ? "#0D0D0D" : "#F5F5F5" }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Magic Header */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={45} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 20 }]}>Detalle del Recuerdo</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Unified Polaroid Card */}
        <View style={[styles.polaroidCard, { backgroundColor: settings.theme === "dark" ? "#1E1E1E" : "#FFF" }]}>
          {memory.image && (
            <TouchableOpacity
              onPress={() => setShowImageModal(true)}
              activeOpacity={0.9}
              style={styles.imageContainer}
            >
              <Image source={{ uri: memory.image }} style={styles.image} />
              <View style={styles.expandIcon}>
                <Ionicons name="expand-outline" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.detailsContainer}>
            <Text style={[styles.title, { color: settings.theme === "dark" ? "#FFF" : "#333", fontSize: getFontSize(24) }]}>
              {memory.title}
            </Text>

            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color={settings.theme === "dark" ? "#AAA" : "#888"} />
              <Text style={[styles.date, { color: settings.theme === "dark" ? "#AAA" : "#888", fontSize: getFontSize(14) }]}>
                {formatDate(memory.created_at ? memory.created_at.split("T")[0] : null)}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: settings.theme === "dark" ? "#333" : "#F0F0F0" }]} />

            <Text style={[styles.description, { color: settings.theme === "dark" ? "#DDD" : "#555", fontSize: getFontSize(16) }]}>
              {memory.description}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButtonContainer}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#FF416C", "#FF4B2B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.deleteButtonGradient}
          >
            <Ionicons name="trash-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={[styles.deleteButtonText, { fontSize: getFontSize(16) }]}>Eliminar Recuerdo</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Full Screen Image Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setShowImageModal(false)}
          >
            <Image
              source={{ uri: memory.image }}
              style={styles.fullImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowImageModal(false)}
            >
              <Ionicons name="close-circle" size={50} color="#FFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    paddingBottom: 50,
    paddingTop: 20,
    alignItems: "center",
  },
  polaroidCard: {
    width: width - 40,
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  imageContainer: {
    width: "100%",
    height: 350,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  expandIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 15,
  },
  detailsContainer: {
    paddingHorizontal: 5,
    alignItems: "flex-start",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
    lineHeight: 30,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  date: {
    fontWeight: "500",
    marginLeft: 6,
    color: "#888",
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 15,
  },
  description: {
    lineHeight: 24,
    textAlign: "left",
    width: "100%",
    opacity: 0.9,
  },
  deleteButtonContainer: {
    width: width - 40,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#FF416C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  deleteButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: width,
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
});
