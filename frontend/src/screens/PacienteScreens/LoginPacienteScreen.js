import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, StatusBar, Dimensions, ScrollView } from 'react-native';
import { AuthContext } from '../../auth/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginPacienteScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate("Home");
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

          <LinearGradient
            colors={["#6A5ACD", "#48D1CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Image
              source={require("../../assets/images/logo2.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Bienvenido de nuevo</Text>
            <Text style={styles.headerSubtitle}>Ingresa a tu cuenta</Text>
          </LinearGradient>

          <Animated.View
            entering={FadeInUp.delay(300).duration(800)}
            style={styles.formContainer}
          >
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#6A5ACD" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6A5ACD" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
              <LinearGradient
                colors={["#6A5ACD", "#48D1CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              ¿No tienes una cuenta?{" "}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("RegisterPaciente")}
              >
                Regístrate aquí.
              </Text>
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    minHeight: Dimensions.get('window').height,
  },
  header: {
    height: Dimensions.get('window').height * 0.4,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 80,
    paddingTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E0E0E0",
  },
  formContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: -50,
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 25,
    paddingVertical: 5,
  },
  inputIcon: {
    marginRight: 10,
    width: 20,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingVertical: 8,
    textAlign: 'left',
  },
  button: {
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#6A5ACD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 25,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  linkText: {
    fontWeight: "bold",
    color: "#6A5ACD",
  },
  errorText: {
    color: "#FF4444",
    textAlign: "center",
    marginBottom: 15,
  },
});