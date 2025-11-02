import React from "react";
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
import useLoginCuidador from "../../hooks/useLoginCuidador";
import { styles } from "../../styles/LoginCuidadorStyles";

export default function LoginCuidadorScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { email, setEmail, password, setPassword, loading, handleLogin } =
    useLoginCuidador(navigation);

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
          onPress={() => navigation.navigate("HomeCuidador")}
          //onPress={handleLogin}
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
