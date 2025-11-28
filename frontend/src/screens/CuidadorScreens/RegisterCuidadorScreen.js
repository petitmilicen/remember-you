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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome6";
import useRegisterCuidador from "../../hooks/useRegisterCuidador";

const { width } = Dimensions.get("window");

export default function RegisterCuidadorScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header Gradient */}
      <LinearGradient
        colors={["#48D1CC", "#6A5ACD"]}
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
        <Text style={styles.headerSubtitle}>Cuidador</Text>
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
              <Icon name="user" size={18} color="#48D1CC" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="user" size={18} color="#48D1CC" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="heart" size={18} color="#48D1CC" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Relación con el paciente"
                placeholderTextColor="#999"
                value={relacion}
                onChangeText={setRelacion}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="phone" size={18} color="#48D1CC" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={setTelefono}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="envelope" size={18} color="#48D1CC" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correo}
                onChangeText={setCorreo}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={18} color="#48D1CC" style={styles.inputIcon} />
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

            <View style={styles.inputContainer}>
              <Icon name="lock" size={18} color="#48D1CC" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                <Icon name={isConfirmPasswordVisible ? "eye" : "eye-slash"} size={18} color="#999" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#48D1CC", "#6A5ACD"]}
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
                onPress={() => navigation.navigate("LoginCuidador")}
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
  button: {
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#48D1CC",
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
    color: "#48D1CC",
  },
});
