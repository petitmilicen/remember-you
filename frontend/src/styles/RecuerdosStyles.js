import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: { color: "#FFF", fontWeight: "bold", textAlign: "center", flex: 1 },
  memoryCard: { flex: 1, borderRadius: 15, margin: 8, overflow: "hidden", elevation: 3 },
  memoryImage: { width: "100%", height: 120 },
  memoryInfo: { padding: 10 },
  memoryTitle: { fontWeight: "bold" },
  memoryDate: { marginTop: 4 },
  addButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 45,
  },
  addButtonText: { color: "#FFF", fontWeight: "bold" },
  emptyText: { textAlign: "center" },
});

export const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#333" },
  subtext: { color: "#777" },
});

export const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFFFFF" },
  subtext: { color: "#AAAAAA" },
});
