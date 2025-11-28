import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 50,
    alignSelf: "center",
  },
  button: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#6A5ACD",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  footerText: {
    marginTop: 40,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  linkText: {
    fontWeight: "bold",
    color: "#FFD700",
  },
});
