import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const GUTTER = 20;

export const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: GUTTER },

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
    paddingHorizontal: GUTTER,
    paddingBottom: 16,
  },
  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerTitle: { color: "#FFF", fontWeight: "bold" },

  content: { paddingVertical: 20 },

  noteCard: {
    borderRadius: 26,
    padding: 16,
    minHeight: 200,
    marginBottom: 20,
    elevation: 6,
  },
  noteInput: { height: 140 },

  fabSave: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEBA17",
    alignItems: "center",
    justifyContent: "center",
  },

  savedNoteCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  actions: { flexDirection: "row" },
  actionIcon: { marginLeft: 12 },
  savedDate: {},
  savedText: {},
});

export const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#111" },
  subtext: { color: "#999" },
});

export const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFFFFF" },
  subtext: { color: "#AAAAAA" },
});
