import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: {
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
    paddingBottom: 16,
  },
  headerTitle: { color: "#FFF", fontWeight: "bold", textAlign: "center", flex: 1 },
  form: { padding: 20 },
  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
  },
  textArea: { height: 100 },
  imagePicker: {
    borderRadius: 12,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  saveButtonText: { color: "#FFF", fontWeight: "bold" },
});

export const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#222" },
  subtext: { color: "#999" },
});

export const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFF" },
  subtext: { color: "#AAA" },
});
