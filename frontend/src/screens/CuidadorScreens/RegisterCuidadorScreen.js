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
import useRegisterCuidador from "../../hooks/useRegisterCuidador";
import { styles } from "../../styles/RegisterCuidadorStyles";

export default function RegisterCuidadorScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    relacion,
    setRelacion,
    telefono,
    setTelefono,
    correo,
    setCorreo,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
    loading,
  } = useRegisterCuidador(navigation);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <Image
        source={require("../../assets/images/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>
          Bienvenido, por favor ingresa tus datos.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Apellido"
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder="Relación con el paciente"
          placeholderTextColor="#999"
          value={relacion}
          onChangeText={setRelacion}
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Registrarme</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          ¿Ya tienes una cuenta?{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("LoginCuidador")}
          >
            Ingresa aquí.
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
