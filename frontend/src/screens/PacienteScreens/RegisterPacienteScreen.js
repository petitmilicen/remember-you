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
  StyleSheet,
  Dimensions
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome6";
import useRegisterPaciente from "../../hooks/useRegisterPaciente";

const { width } = Dimensions.get("window");

export default function RegisterPacienteScreen({ navigation }) {
  const insets = useSafeAreaInsets();

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header Gradient */}
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
        <Text style={styles.headerTitle}>Crear Cuenta</Text>
        <Text style={styles.headerSubtitle}>Paciente</Text>
      </LinearGradient>

      <Animated.View
        entering={FadeInUp.delay(300).duration(800)}
        style={styles.formWrapper}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Datos Personales</Text>

            <View style={styles.inputContainer}>
              <Icon name="user" size={18} color="#6A5ACD" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="user" size={18} color="#6A5ACD" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="envelope" size={18} color="#6A5ACD" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Icon name="calendar" size={18} color="#6A5ACD" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Edad"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={edad}
                  onChangeText={setEdad}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Icon name="phone" size={18} color="#6A5ACD" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contacto"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={contacto}
                  onChangeText={setContacto}
                />
              </View>
            </View>

            <Text style={styles.label}>Género</Text>
            <View style={styles.pickerContainer}>
              <Icon name="venus-mars" size={18} color="#6A5ACD" style={styles.pickerIcon} />
              <Picker
                style={styles.picker}
                selectedValue={gender}
                onValueChange={setGender}
              >
                <Picker.Item label="Seleccione género..." value="" color="#999" />
                {genderOptions.map(opt => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} color="#333" />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Nivel de Alzheimer</Text>
            <View style={styles.pickerContainer}>
              <Icon name="brain" size={18} color="#6A5ACD" style={styles.pickerIcon} />
              <Picker
                style={styles.picker}
                selectedValue={alzheimerLevel}
                onValueChange={setAlzheimerLevel}
              >
                <Picker.Item label="Seleccione nivel..." value="" color="#999" />
                {alzheimerOptions.map(opt => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} color="#333" />
                ))}
              </Picker>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={18} color="#6A5ACD" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon name={isPasswordVisible ? "eye" : "eye-slash"} size={18} color="#999" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#6A5ACD", "#48D1CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Registrarme</Text>
                )}
              </LinearGradient>
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
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: "30%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 50,
    paddingTop: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#E0E0E0",
  },
  formWrapper: {
    flex: 1,
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    marginTop: 5,
    fontWeight: "500",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
  },
  pickerIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  picker: {
    flex: 1,
    color: "#333",
    marginLeft: -10,
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
    marginTop: 20,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  linkText: {
    fontWeight: "bold",
    color: "#6A5ACD",
  },
});
