import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

export default function RegisterScreen ({ navigation }) {
    const [nombre, setNombre] = useState("");
    const [relacion, setRelacion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        console.log("Registro cuidador:", {
            nombre,
            relacion,
            telefono,
            correo,
            password,
            rol: "cuidador",
        });
    };

    return(
        <KeyboardAvoidingView 
            style = {styles.container}
            behavior = {Platform.OS == "ios" ? "padding" : undefined}
        >
            <StatusBar style="auto" />
                <Image
                    source = {require("../assets/images/Logo.png")}
                    style = {styles.logo}
                    resizeMode="contain"
                />

                <View style = {styles.formContainer}>
                    <Text style = {styles.welcomeText}>
                        Bienvenido, por favor ingresa tus datos.
                    </Text>

                    <TextInput 
                        style = {styles.input}
                        placeholder="Nombre completo"
                        placeholderTextColor="#999"
                        value={nombre}
                        onChangeText ={setNombre}
                    />

                    <TextInput 
                        style = {styles.input}
                        placeholder = "Relación con el paciente"
                        placeholderTextColor = "#999"
                        value = {relacion}
                        onChangeText = {setRelacion}
                    />

                    <TextInput 
                        style = {styles.input}
                        placeholder = "Teléfono"
                        placeholderTextColor = "#999"
                        keyboardType = "phone-pad"
                        value = {telefono}
                        onChangeText = {setTelefono}
                    />

                    <TextInput 
                        style = {styles.input}
                        placeholder = "Correo electrónico"
                        placeholderTextColor = "#999"
                        keyboardType = "email-address"
                        autoCapitalize="none"
                        value = {correo}
                        onChangeText = {setCorreo}
                    />

                    <TextInput 
                        style = {styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#999"
                        secureTextEntry
                        autoCapitalize="none"
                        value={password}
                        onChangeText = {setPassword}
                    />

                    <TextInput 
                        style = {styles.input}
                        placeholder="Confirmar contraseña"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        value={confirmPassword}
                        onChangeText = {setConfirmPassword}
                    />

                    <TouchableOpacity style = {styles.button} onPress = {handleRegister}>
                        <Text style = {styles.buttonText}>Registrarme</Text>
                    </TouchableOpacity>

                    <Text style = {styles.footerText}>
                        ¿Ya tienes una cuenta? {""}
                        <Text 
                            style = {styles.linkText}
                            onPress = {() => navigation.navigate("LoginCuidador")}
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
    paddingBottom: 30, 
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
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 14,
    color: "#000",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    marginVertical: 10,
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
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  linkText: {
    fontWeight: "bold",
  },
});