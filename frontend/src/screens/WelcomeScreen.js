import React from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useWelcome from "../hooks/useWelcome";
import { styles } from "../styles/WelcomeStyles";

export default function WelcomeScreen({ navigation }) {
  const { goToLogin, goToRegister, goToCuidador } = useWelcome(navigation);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 40, backgroundColor: "#EDEDED" },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Logo centrado */}
      <Image
        source={require("../assets/images/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Botones principales */}
      <TouchableOpacity style={styles.button} onPress={goToLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={goToRegister}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>

      {/* Texto inferior */}
      <Text style={styles.footerText} onPress={goToCuidador}>
        ¿Eres cuidador o familiar?{" "}
        <Text style={styles.linkText}>Ingresa aquí.</Text>
      </Text>
    </View>
  );
}
