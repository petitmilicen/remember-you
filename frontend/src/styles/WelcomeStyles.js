import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logo: {
    width: width * 0.55,
    height: width * 0.55,
    marginBottom: 40,
    alignSelf: "center",
  },

  button: {
    width: "80%",
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 8,
    elevation: 4,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 16,
  },

  footerText: {
    marginTop: 30,
    textAlign: "center",
    color: "#333",
    fontSize: 14,
  },
  linkText: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#000",
  },
});
