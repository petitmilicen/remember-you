import React, { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../../styles/LoginCuidadorStyles";

export default function LoginCuidadorScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  try {
    await login(email, password);
    navigation.navigate("HomeCuidador");
  } catch (err) {

    setError('Correo o contraseña incorrectos');
  }
};

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.formContainer}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
        />

        <Text style={styles.welcomeText}>
          Bienvenido cuidador, {"\n"}te extrañamos.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          ¿No tienes una cuenta?{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("RegisterCuidador")}
          >
            Regístrate aquí.
          </Text>
        </Text>

        <Text style={styles.footerText}>
          ¿No eres cuidador o familiar?{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("Welcome")}
          >
            Ingresa aquí.
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
