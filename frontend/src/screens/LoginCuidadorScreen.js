import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform} from 'react-native';

export default function LoginCuidadorScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPasword] = useState("");

    const handleLogin = () => {
        console.log("login con :", email, password);
    };

    return(
        <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Image
                source={require("../assets/images/Logo.png")}
                style={styles.logo}
                rsizeMode="contain"
            />

            <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>
                    Bienvenido cuidador, {"\n"}te extrañamos.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder='Correo electronico'
                    placeholdelTectColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder='Contraseña'
                    placeholdelTectColor="#999"
                    value={password}
                    onChangeText={setPasword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    ¿No tienes una cuenta? {""}
                    <Text 
                        style={styles.linkText} 
                        onPress={() => navigation.navigate("RegisterCuidador")}
                    >
                        Ingresa aquí.
                    </Text>
                </Text>

                <Text style = {styles.footerText}>
                  ¿No eres familiar o cuidador? {""}
                    <Text 
                      style = {styles.linkText}
                      onPress = {() => navigation.navigate("Welcome")}
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
    alignItems: "center",  
    justifyContent: "center",
    paddingHorizontal: 20,   
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#FFF",
    width: "100%",           
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