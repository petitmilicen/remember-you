import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1 },

  /* --- Encabezado --- */
  headerBleed: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 5,
  },
  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: { color: "#FFF", fontWeight: "bold" },

  /* --- Perfil --- */
  profileCard: {
    alignItems: "center",
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    marginBottom: 25,
  },
  imageContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#8A6DE9",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE8FF",
  },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  overlayCamera: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(106,65,224,0.5)",
    alignItems: "center",
    paddingVertical: 6,
  },
  placeholder: { justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#6F52D6", fontWeight: "500" },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF4E4E",
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
  profileName: { fontWeight: "bold", marginTop: 10 },
  profileSubtitle: { marginBottom: 10 },
  sectionTitle: { fontWeight: "bold", marginBottom: 10 },
  infoSection: { marginBottom: 25 },
  infoBox: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  infoLabel: { fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 12 },

  /* --- Acordeón --- */
  groupHeader: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupTitle: {
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  groupBody: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    elevation: 3,
  },
  groupBodyLight: { backgroundColor: "#FFFFFF" },
  groupBodyDark: { backgroundColor: "#1E1E1E", borderWidth: 1, borderColor: "#2C2C2C" },
  hexRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  /* --- Partes del hexágono --- */
  hexTri: { width: 0, height: 0 },
  hexMid: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 6,
    paddingHorizontal: 6,
  },

  /* --- Modales --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    borderRadius: 16,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalQRBox: {
    borderRadius: 20,
    padding: 30,
    width: "85%",
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: { fontWeight: "bold", marginBottom: 15 },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 5,
  },
  modalButtonText: { color: "#FFF", marginLeft: 10, fontWeight: "bold" },
  cancelButton: { marginTop: 10 },
  cancelText: { color: "#8A6DE9", fontWeight: "bold" },
  qrText: { marginTop: 10 },
});

/* 🌙 Estilos temáticos */
export const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#222" },
  subtext: { color: "#666" },
  sectionTitle: { color: "#8A6DE9" },
});

export const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1A1A1A", borderColor: "#2C2C2C", borderWidth: 1 },
  text: { color: "#FFF" },
  subtext: { color: "#AAA" },
  sectionTitle: { color: "#A88BFF" },
});
