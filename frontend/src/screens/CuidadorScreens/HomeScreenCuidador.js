// src/screens/CuidadorScreens/HomeScreenCuidador.js
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform,
  Image,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../auth/AuthContext";
import usePaciente from "../../hooks/usePaciente.js";
import useZonaSegura from "../../hooks/useZonaSegura.js";
import useTarjetas from "../../hooks/useTarjetas.js";
import usePacienteHome from "../../hooks/usePacienteHome.js";
import PacientePanel from "../../components/cuidador/PacientePanel.js";
import ZonaSeguraPanel from "../../components/cuidador/ZonaSeguraPanel.js";
import AlertasPanel from "../../components/cuidador/AlertasPanel.js";
import TarjetasPanel from "../../components/cuidador/TarjetasPanel.js";
import QuickMenu from "../../components/cuidador/QuickMenu.js";
import NuevaTarjetaModal from "../../components/cuidador/NuevaTarjetaModal.js";
import EmergencyAlert from "../../components/cuidador/EmergencyAlert.js";
import { setupPushNotifications } from "../../utils/pushNotifications.js";
import { styles } from "../../styles/HomeCuidadorStyles.js";
import { ACCENT } from "../../utils/constants.js";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonPanel} />
    <View style={styles.skeletonPanel} />
    <View style={styles.skeletonPanel} />
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <ActivityIndicator size="large" color={ACCENT} />
    </View>
  </View>
);

export default function HomeScreenCuidador({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useContext(AuthContext);
  const { paciente } = usePaciente();
  const zona = useZonaSegura(paciente);
  const tarjetas = useTarjetas();
  const { fotoPerfil, nombrePaciente, theme, getFontSize, loading } = usePacienteHome();

  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Saludo dinámico y fecha
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 19) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");

    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    setCurrentDate(`${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`);
  }, []);

  // Register push notifications
  useEffect(() => {
    setupPushNotifications().then(token => {
      if (token) {
        console.log("✅ Push notifications ready");
      }
    });
  }, []);

  // Bloquear el botón de retroceso del sistema Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // Show loading skeleton while data loads
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Gradient colors - Professional blue theme for caregiver
  const gradientColors = ["#1565C0", "#0D47A1"];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ✨ NEW BEAUTIFUL GRADIENT HEADER */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 20,
            paddingBottom: 30,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 4 }}>
                {currentDate}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "300" }}>
                {greeting},
              </Text>
              <Text style={{ color: "#FFF", fontSize: 26, fontWeight: "bold", marginTop: 2 }}>
                {nombrePaciente}
              </Text>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.2)",
                alignSelf: "flex-start",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                marginTop: 10,
                gap: 6,
              }}>
                <Ionicons name="shield-checkmark" size={14} color="#FFF" />
                <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "600" }}>
                  Panel de Cuidador
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Perfil')}
              activeOpacity={0.8}
              style={{
                borderWidth: 3,
                borderColor: "rgba(255,255,255,0.4)",
                borderRadius: 35,
                padding: 3,
              }}
            >
              {fotoPerfil ? (
                <Image
                  source={{ uri: fotoPerfil }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
              ) : (
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Ionicons name="person" size={32} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>

        {/* 🚨 EMERGENCY ALERT - Shows when patient is outside */}
        {zona.alertaActiva && !zona.salidaSegura && (
          <EmergencyAlert
            paciente={paciente}
            ubicacionPaciente={zona.ubicacionPaciente}
          />
        )}

        <PacientePanel paciente={paciente} navigation={navigation} />

        <ZonaSeguraPanel
          zonaSegura={zona.zonaSegura}
          ubicacionPaciente={zona.ubicacionPaciente}
          alertaActiva={zona.alertaActiva}
          distanciaActual={zona.distanciaActual}
          salidaSegura={zona.salidaSegura}
          toggleSalidaSegura={zona.toggleSalidaSegura}
          historial={zona.historial}
          navigation={navigation}
        />

        <AlertasPanel alertas={zona.alertas} onClear={zona.limpiarAlertas} />

        <TarjetasPanel
          tarjetas={tarjetas.tarjetas}
          onAddPress={() => tarjetas.setModalVisible(true)}
          onDelete={tarjetas.eliminarTarjeta}
        />

        <QuickMenu navigation={navigation} />

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Logout")}>
          <FontAwesome5 name="sign-out-alt" size={16} color="#1565C0" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <NuevaTarjetaModal
        visible={tarjetas.modalVisible}
        onClose={() => tarjetas.setModalVisible(false)}
        nuevoTipo={tarjetas.nuevoTipo}
        setNuevoTipo={tarjetas.setNuevoTipo}
        nuevoMensaje={tarjetas.nuevoMensaje}
        setNuevoMensaje={tarjetas.setNuevoMensaje}
        onSave={tarjetas.agregarTarjeta}
        accentColor={ACCENT}
      />
    </View>
  );
}
