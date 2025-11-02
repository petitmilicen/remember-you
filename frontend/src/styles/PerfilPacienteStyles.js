import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const GUTTER = 20;

export const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBleed: {
    marginLeft: -GUTTER,
    marginRight: -GUTTER,
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
    paddingHorizontal: GUTTER,
    paddingBottom: 16,
  },
  headerTitle: { color: "#FFF", fontWeight: "bold" },

  profileCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: { width: "100%", height: "100%" },
  profileName: { fontWeight: "bold", fontSize: 18, marginBottom: 4 },
  profileSubtext: { color: "#888" },

  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  groupTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  groupBody: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  groupBodyLight: { backgroundColor: "#F9F9F9" },
  groupBodyDark: { backgroundColor: "#1E1E1E" },
  hexRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  hexTri: {
    width: 0,
    height: 0,
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  hexMid: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "solid",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#FFF",
    width: width * 0.8,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  modalIcon: { marginRight: 10 },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});

export const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#F5F5F5" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#111" },
  subtext: { color: "#555" },
});

export const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFF" },
  subtext: { color: "#AAA" },
});
