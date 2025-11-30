// src/screens/PacienteScreens/PerfilPacienteScreen.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import usePerfilPaciente from "../../hooks/usePerfilPaciente";
import GroupAccordion from "../../components/paciente/GroupAccordion";
import ModalSelectorImagen from "../../components/paciente/ModalSelectorImagen";

export default function PerfilPacienteScreen({ navigation }) {
  const {
    paciente,
    cuidador,
    modalVisible,
    setModalVisible,
    modalQR,
    setModalQR,
    openGroup,
    setOpenGroup,
    pickImage,
    removeImage,
    groups,
    uploading,
  } = usePerfilPaciente();

  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const dark = settings.theme === "dark";

  const getFontSizeStyle = (base = 16) =>
    settings.fontSize === "small"
      ? { fontSize: base - 2 }
      : settings.fontSize === "large"
        ? { fontSize: base + 2 }
        : { fontSize: base };

  // Magic Gradient for Profile (Matches Welcome Screen)
  const gradientColors = ["#6A5ACD", "#48D1CC"];

  return (
    <View style={[styles.container, { backgroundColor: dark ? "#0D0D0D" : "#F5F5F5" }]}>
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
          <Text style={[styles.headerTitle, { fontSize: 28 }]}>Perfil</Text>
          <TouchableOpacity onPress={() => setModalQR(true)} style={styles.qrButton}>
            <Ionicons name="qr-code-outline" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* PERFIL CARD */}
        <View style={[styles.profileCard, { backgroundColor: dark ? "#1E1E1E" : "#FFF" }]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => !uploading && setModalVisible(true)}
            style={styles.imageContainer}
            disabled={uploading}
          >
            {paciente.FotoPerfil ? (
              <>
                <Image
                  source={{ uri: paciente.FotoPerfil }}
                  style={styles.profileImage}
                />
                {!uploading && (
                  <LinearGradient
                    colors={["#6A5ACD", "#48D1CC"]}
                    style={styles.overlayCamera}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="camera" size={14} color="#FFF" />
                  </LinearGradient>
                )}
              </>
            ) : (
              <View style={[styles.placeholder, { backgroundColor: dark ? "#333" : "#F0F0F0" }]}>
                <FontAwesome5 name="user-plus" size={30} color={gradientColors[0]} />
                <Text style={[styles.placeholderText, { color: dark ? "#AAA" : "#666" }]}>
                  Foto
                </Text>
              </View>
            )}

            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color="#FFF" />
              </View>
            )}
          </TouchableOpacity>



          <Text style={[styles.profileName, { color: dark ? "#FFF" : "#333" }, getFontSizeStyle(22)]}>
            {paciente.NombreCompleto}
          </Text>
          <Text style={[styles.profileSubtitle, { color: dark ? "#AAA" : "#666" }, getFontSizeStyle(15)]}>
            Nivel de Alzheimer: {paciente.NivelAlzheimer}
          </Text>
        </View>

        {/* INFO SECTIONS */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: dark ? "#AAA" : "#666" }]}>DATOS PERSONALES</Text>

          <View style={[styles.infoCard, { backgroundColor: dark ? "#1E1E1E" : "#FFF" }]}>
            <InfoRow label="Género" value={paciente.Genero} dark={dark} getFontSizeStyle={getFontSizeStyle} />
            <Divider dark={dark} />
            <InfoRow label="Edad" value={paciente.Edad} dark={dark} getFontSizeStyle={getFontSizeStyle} />
            <Divider dark={dark} />
            <InfoRow label="Contacto de Emergencia" value={paciente.ContactoEmergencia} dark={dark} getFontSizeStyle={getFontSizeStyle} />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: dark ? "#AAA" : "#666" }]}>CUIDADOR ACTUAL</Text>

          <View style={[styles.infoCard, { backgroundColor: dark ? "#1E1E1E" : "#FFF" }]}>
            <InfoRow label="Nombre" value={cuidador.Nombre} dark={dark} getFontSizeStyle={getFontSizeStyle} />
            <Divider dark={dark} />
            <InfoRow label="Rol" value={cuidador.Rol} dark={dark} getFontSizeStyle={getFontSizeStyle} />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: dark ? "#AAA" : "#666" }]}>LOGROS DESBLOQUEADOS</Text>

          <View style={{ gap: 10 }}>
            {[
              { key: "Memorice", title: "Memorice", data: groups[0].data },
              { key: "Puzzle", title: "Puzzle", data: groups[1].data },
              { key: "Sudoku", title: "Sudoku", data: groups[2].data },
              { key: "Camino", title: "Camino Correcto", data: groups[3].data },
            ].map((g) => (
              <GroupAccordion
                key={g.key}
                title={g.title}
                items={g.data}
                open={openGroup === g.key}
                dark={dark}
                onToggle={() =>
                  setOpenGroup((prev) => (prev === g.key ? "" : g.key))
                }
                gradientColors={gradientColors}
              />
            ))}
          </View>
        </View>

      </ScrollView>

      {/* QR Modal */}
      {modalQR && (
        <Modal transparent visible={modalQR} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.qrContainer}>
              <Text style={styles.qrTitle}>Tu Código QR</Text>
              <QRCode value={JSON.stringify({ patientId: paciente.ID })} size={200} />
              <TouchableOpacity
                onPress={() => setModalQR(false)}
                style={styles.closeQrButton}
              >
                <Text style={styles.closeQrText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <ModalSelectorImagen
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCamera={() => pickImage("camera")}
        onSelectGallery={() => pickImage("gallery")}
      />
    </View>
  );
}

const InfoRow = ({ label, value, dark, getFontSizeStyle }) => (
  <View style={styles.infoRow}>
    <Text style={[styles.infoLabel, { color: dark ? "#AAA" : "#888", flex: 1 }, getFontSizeStyle(14)]}>
      {label}
    </Text>
    <Text style={[styles.infoValue, { color: dark ? "#FFF" : "#333", marginLeft: 10, textAlign: "right" }, getFontSizeStyle(16)]}>
      {value}
    </Text>
  </View>
);

const Divider = ({ dark }) => (
  <View style={[styles.divider, { backgroundColor: dark ? "#333" : "#F0F0F0" }]} />
);

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
  profileCard: {
    alignItems: "center",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "bold",
  },
  overlayCamera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  deleteButtonCircle: {
    backgroundColor: "#FF6B6B",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  profileSubtitle: {
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
    letterSpacing: 1,
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontWeight: "500",
  },
  infoValue: {
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  closeQrButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeQrText: {
    color: "#6a11cb",
    fontWeight: "bold",
    fontSize: 16,
  },
});
