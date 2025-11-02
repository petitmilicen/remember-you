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
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  scroll: { padding: 20 },

  card: {
    height: 150,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
  },
  cardImage: { flex: 1, justifyContent: "flex-end" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    justifyContent: "flex-end",
    padding: 16,
  },
  cardTitle: { fontWeight: "bold", color: "#FFF", marginBottom: 6 },
  cardCTA: { color: "#FFF" },
});

export const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
});

export const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
});
