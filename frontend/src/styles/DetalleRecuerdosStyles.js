import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  scrollContent: { paddingBottom: 20 },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  date: { alignSelf: "flex-start", marginBottom: 10 },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  description: {
    marginBottom: 20,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  deleteButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  text: { color: "#333" },
  subtext: { color: "#555" },
});

export const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  text: { color: "#FFF" },
  subtext: { color: "#BBB" },
});
