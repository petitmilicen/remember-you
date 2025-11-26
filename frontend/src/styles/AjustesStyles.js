import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const GUTTER = 20;

export const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: GUTTER },
  headerWrap: {
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
  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  safeContent: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingVertical: 20 },
  sectionTitle: { fontWeight: "bold", marginBottom: 20, marginTop: 10 },
  sectionSpacing: { marginTop: 40 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  textContainer: { flex: 1, marginLeft: 15 },
  optionText: { fontWeight: "500" },
  optionSubtext: { marginTop: 2, opacity: 0.7 },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E0E0",
    padding: 2,
  },
  toggleActive: { backgroundColor: "#6200EE" },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  sizeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  sizeLetter: { fontWeight: "bold", fontSize: 16 },
  sizeLetterSmall: { fontSize: 13 },
  sizeLetterLarge: { fontSize: 20 },
  groupContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
  },
});

export const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#FFFFFF" },
  text: { color: "#000000" },
  subtext: { color: "#666666" },
  groupContainer: { backgroundColor: "#F5F5F5" },
});

export const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  text: { color: "#FFFFFF" },
  subtext: { color: "#AAAAAA" },
  groupContainer: { backgroundColor: "#1E1E1E" },
});
