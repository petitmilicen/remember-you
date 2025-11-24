import React, { useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useRegisterPaciente from "../../hooks/useRegisterPaciente";
import { styles } from "../../styles/RegisterPacienteStyles";

export default function RegisterPacienteScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Opciones del backend
  const genderOptions = [
    { label: "Hombre", value: "Hombre" },
    { label: "Mujer", value: "Mujer" },
  ];

  const alzheimerOptions = [
    { label: "Ninguno", value: "Ninguno" },
    { label: "Leve", value: "Leve" },
    { label: "Moderado", value: "Moderado" },
    { label: "Severo", value: "Severo" },
  ];

  const [gender, setGender] = useState("");
  const [alzheimerLevel, setAlzheimerLevel] = useState("");

  const {
    edad,
    setEdad,
    contacto,
    setContacto,
    password,
    setPassword,
    loading,
    handleRegister: registerHook,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail
  } = useRegisterPaciente(navigation);

  const handleRegister = () => {
    registerHook({
      gender,
      alzheimerLevel,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.formCard}>
          <Text style={styles.welcomeText}>Bienvenido, por favor ingresa tus datos.</Text>

          {/* ➕ first_name */}
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#777"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* ➕ last_name */}
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#777"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* ➕ email */}
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#777"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
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
            placeholder="Contacto"
            placeholderTextColor="#777"
            keyboardType="phone-pad"
            value={contacto}
            onChangeText={setContacto}
          />

          {/* Picker del género */}
          <Text style={styles.label}>Género</Text>
          <Picker
            style={styles.picker}
            selectedValue={gender}
            onValueChange={setGender}
          >
            <Picker.Item label="Seleccione género..." value="" />
            {genderOptions.map(opt => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>

          {/* Picker nivel Alzheimer */}
          <Text style={styles.label}>Nivel de Alzheimer</Text>
          <Picker
            style={styles.picker}
            selectedValue={alzheimerLevel}
            onValueChange={setAlzheimerLevel}
          >
            <Picker.Item label="Seleccione nivel..." value="" />
            {alzheimerOptions.map(opt => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>

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
