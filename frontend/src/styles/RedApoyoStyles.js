import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#212121" },

  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    elevation: 2,
  },
  summaryText: { color: "#455A64", fontWeight: "600" },
  summaryStrong: { color: "#212121", fontWeight: "700" },

  mapContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFF",
    elevation: 3,
  },
  map: { height: 180 },
  mapLabel: {
    textAlign: "center",
    backgroundColor: "#FFF",
    fontSize: 12,
    color: "#607D8B",
    paddingVertical: 6,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#263238",
    marginLeft: 18,
    marginTop: 14,
  },
  muted: {
    textAlign: "center",
    color: "#9E9E9E",
    marginTop: 10,
    fontStyle: "italic",
  },

  // Card
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontWeight: "700", fontSize: 15, color: "#212121" },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: "#212121",
    fontWeight: "700",
    fontSize: 12,
  },
  cardText: { color: "#455A64", fontSize: 13, marginTop: 2 },
  cardNote: { fontStyle: "italic", color: "#607D8B", marginTop: 6 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnText: { color: "#FFF", fontWeight: "700", fontSize: 12 },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalBox: { backgroundColor: "#FFF", borderRadius: 18, padding: 18, width: "88%" },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#263238", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    color: "#000",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: { color: "#FFF", fontWeight: "700" },
});
