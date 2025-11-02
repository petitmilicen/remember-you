import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1 },
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
  },
  postIt: {
    flex: 1,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    minHeight: 130,
    justifyContent: "space-between",
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    transform: [{ rotate: "-1deg" }],
  },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  postItTipo: { fontWeight: "bold" },
  postItMensaje: { fontStyle: "italic", marginVertical: 4 },
  postItTipoSecundario: { textAlign: "right" },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  addButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    margin: 20,
    marginBottom: 50,
  },
  addButtonText: { color: "#FFF", fontWeight: "bold" },
  emptyText: { textAlign: "center" },
});

export const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#333" },
  subtext: { color: "#666" },
});

export const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFF" },
  subtext: { color: "#AAA" },
});
