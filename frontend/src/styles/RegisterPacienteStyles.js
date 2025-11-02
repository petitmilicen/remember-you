import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  // 🔹 Logo centrado
  logo: {
    width: width * 0.45,
    height: width * 0.45,
    alignSelf: "center",
    marginBottom: 20,
  },

  // 🔹 Tarjeta de registro
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  welcomeText: {
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 18,
    color: "#333",
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    marginBottom: 16,
    paddingVertical: 6,
    fontSize: 15,
    color: "#000",
  },

  faceButton: {
    backgroundColor: "#EEE",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 5,
    elevation: 3,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  footerText: {
    marginTop: 14,
    textAlign: "center",
    color: "#333",
  },

  linkText: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#000",
  },
});
