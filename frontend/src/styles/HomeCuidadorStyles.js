import { StyleSheet, Dimensions } from "react-native";
import { ACCENT } from "../utils/constants";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#212121",
  },
  headerRole: {
    fontSize: 14,
    color: "#757575",
    marginTop: 2,
  },

  panel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 2,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#263238",
    marginBottom: 6,
  },
  mainText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#37474F",
  },
  subText: {
    fontSize: 13,
    color: "#607D8B",
    marginTop: 2,
  },
  muted: {
    fontStyle: "italic",
    color: "#9E9E9E",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  safeExitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  safeExitText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
  },
  zoneInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  zoneInfoText: {
    color: "#455A64",
    fontSize: 13,
  },
  zoneInfoStrong: {
    fontWeight: "700",
    color: "#263238",
  },

  mapWrap: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  map: {
    width: "100%",
    height: 220,
  },
  mapOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusPillText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  centerButton: {
    flexDirection: "row",
    backgroundColor: "#0D47A1",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    gap: 6,
  },
  centerButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12,
  },

  noZoneContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  noZoneText: {
    color: "#607D8B",
    fontStyle: "italic",
  },
  noZoneSub: {
    color: "#90A4AE",
    fontSize: 12,
    marginTop: 2,
  },
  editZoneButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
    gap: 8,
  },
  editZoneText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  alertBox: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#C0CA33",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  alertMessage: {
    flex: 1,
    color: "#37474F",
  },
  alertDate: {
    color: "#90A4AE",
    fontSize: 11,
  },

  cardNote: {
    backgroundColor: "#E3F2FD",
    borderLeftWidth: 5,
    borderLeftColor: "#64B5F6",
    borderRadius: 12,
    marginTop: 8,
    padding: 10,
  },
  tarjetaHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    paddingRight: 4,
  },
  tarjetaAutor: {
    fontWeight: "700",
    color: "#37474F",
  },
  tarjetaMensaje: {
    color: "#455A64",
    marginBottom: 4,
  },
  tarjetaTipo: {
    fontSize: 12,
    color: "#607D8B",
    textAlign: "right",
  },
  tarjetaFecha: {
    fontSize: 12,
    color: "#90A4AE",
    textAlign: "right",
  },

  quickMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    alignItems: "center",
    borderRadius: 16,
    justifyContent: "center",
    gap: 8,
    marginVertical: 12,
    paddingVertical: 20,
    width: (width - 16 * 2 - 40) / 2,
  },
  menuText: {
    color: "#212121",
    fontWeight: "700",
  },

  logoutButton: {
    alignItems: "center",
    backgroundColor: ACCENT,
    borderRadius: 16,
    elevation: 2,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginHorizontal: 60,
    marginTop: 8,
    marginBottom: 28,
    paddingVertical: 12,
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "700",
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#263238",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    color: "#37474F",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  modalBtn: {
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 6,
    paddingVertical: 10,
  },
  modalBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
