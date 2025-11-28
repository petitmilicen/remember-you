import React from "react";
import { Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import useWelcome from "../hooks/useWelcome";
import { styles } from "../styles/WelcomeStyles";

export default function WelcomeScreen({ navigation }) {
  const { goToLogin, goToRegister, goToCuidador } = useWelcome(navigation);
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#6A5ACD", "#48D1CC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Animated.Image
        entering={FadeIn.duration(1000)}
        source={require("../assets/images/LogoMain.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Animated.View
        entering={FadeInUp.delay(300).duration(800)}
        style={{ width: '100%', alignItems: 'center' }}
      >
        <TouchableOpacity style={styles.button} onPress={goToLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={goToRegister} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Registrarme</Text>
        </TouchableOpacity>

        <Text style={styles.footerText} onPress={goToCuidador}>
          ¿Eres cuidador o familiar?{" "}
          <Text style={styles.linkText}>Ingresa aquí.</Text>
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}
