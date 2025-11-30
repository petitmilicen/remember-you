import { StyleSheet, Platform, StatusBar } from "react-native";
const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
const ACCENT = "#FF7043";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    paddingTop: TOP_PAD + 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#212121", flex: 1, textAlign: "center" },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 },
  emptyText: { color: "#455A64", fontSize: 16, fontWeight: "600", marginTop: 10 },
  emptySub: { color: "#90A4AE", fontSize: 13 },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 14,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#64B5F6",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  cardCategory: { fontSize: 15, fontWeight: "700", color: "#263238" },
  cardDesc: { color: "#455A64", fontSize: 14, marginBottom: 4 },
  cardDate: { color: "#90A4AE", fontSize: 12 },
  cardActions: { flexDirection: "row", gap: 12 },

  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: ACCENT,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalBox: {
    width: "88%",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#263238", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    color: "#37474F",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
});
