import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform} from "react-native";

export default function RegisterPacienteScreen({ navigation }) {
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState("");
    const [contacto, setContacto] = useState("");
    const [nivel, setNivel] = useState("");

    const handleRegister = () => {
        console.log("Registro: paciente", {
            nombre,
            edad,
            contacto,
            nivel,
            metodo: "Reconocimiento Facial"
        });
    }

    return (
        <KeyboardAvoidingView
        style = {styles.container}
        behavior = {Platform.OS === "ios" ? "padding" : undefined}
        >
            <Image 
                source = {require("../assets/images/Logo.png")}
                style = {styles.logo}
                resizeMode = "contain"
            />

            <View style = {styles.formContainer}>
                <Text style = {styles.welcomeText}>
                    Bienvenido, por favor ingresa tus datos.
                </Text>

                <TextInput 
                    style = {styles.input}
                    placeholder = "Nombre completo"
                    placeholderTextColor = "#999"
                    value = {nombre}
                    onChangeText = {setNombre}
                />

                <TextInput 
                    style = {styles.input}
                    placeholder = "Edad"
                    placeholderTextColor = "#999"
                    keyboardType = "numeric"
                    value = {edad}
                    onChangeText = {setEdad}
                />

                <TextInput 
                    style = {styles.input}
                    placeholder = "Contacto de emergencia"
                    placeholderTextColor = "#999"
                    keyboardType="phone-pad"
                    value = {contacto}
                    onChangeText = {setContacto}
                />

                <TextInput 
                    style = {styles.input}
                    placeholder = "Nivel de Alzheimer"
                    placeholderTextColor = "#999"
                    value = {nivel}
                    onChangeText = {setNivel}
                />

                <TouchableOpacity style = {styles.faceButton}>
                    <Text style = {styles.faceText}> 
                        Escanear Rostro
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style = {styles.button} onPress = {handleRegister}>
                    <Text style = {styles.buttonText}>
                        Registrarme
                    </Text>
                </TouchableOpacity>

                <Text style = {styles.footerText}>
                  ¿Ya tienes una cuenta? {""}
                    <Text 
                      style = {styles.linkText}
                      onPress = {() => navigation.navigate("WelcomeScreen")}
                      >
                        Ingresa aquí.    
                      </Text>    
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: "center",
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 18,
    paddingVertical: 6,
    fontSize: 14,
    color: "#000",
  },
  faceButton: {
    backgroundColor: "#EEE",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  faceText: {
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
    footerText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  linkText: {
    fontWeight: "bold",
  },
});

