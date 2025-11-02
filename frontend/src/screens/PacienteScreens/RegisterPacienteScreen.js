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
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useRegisterPaciente from "../../hooks/useRegisterPaciente";
import { styles } from "../../styles/RegisterPacienteStyles";

export default function RegisterPacienteScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const {
    nombre,
    setNombre,
    edad,
    setEdad,
    contacto,
    setContacto,
    nivel,
    setNivel,
    loading,
    handleRegister,
  } = useRegisterPaciente(navigation);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo centrado */}
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Tarjeta de registro */}
        <View style={styles.formCard}>
          <Text style={styles.welcomeText}>
            Bienvenido, por favor ingresa tus datos.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#777"
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            style={styles.input}
            placeholder="Edad"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={edad}
            onChangeText={setEdad}
          />

          <TextInput
            style={styles.input}
            placeholder="Contacto de emergencia"
            placeholderTextColor="#777"
            keyboardType="phone-pad"
            value={contacto}
            onChangeText={setContacto}
          />

          <TextInput
            style={styles.input}
            placeholder="Nivel de Alzheimer"
            placeholderTextColor="#777"
            value={nivel}
            onChangeText={setNivel}
          />

          <TouchableOpacity style={styles.faceButton}>
            <Text style={{ color: "#000", fontWeight: "500" }}>Escanear rostro</Text>
          </TouchableOpacity>

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
              onPress={() => navigation.navigate("LoginPaciente")}
            >
              Ingresa aquí.
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
