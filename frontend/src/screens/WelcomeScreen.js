import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return(
        <View style={styles.container}>
            <Image
                source={require("../assets/images/Logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Home")}
            >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("RegisterCuidador")}
            >
                <Text style={styles.buttonText}>Registrarme</Text>
            </TouchableOpacity>

            <Text style={styles.footerText} onPress={() => navigation.navigate("LoginCuidador")}>
                ¿Eres Familiar o cuidador?{""}
                <Text style={styles.linkText}> Ingresa aquí.</Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  linkText: {
    fontWeight: "bold",
  },
});