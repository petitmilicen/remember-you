// src/screens/CuidadorScreens/HomeScreenCuidador.js
import React, { useContext } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { styles } from "../../styles/HomeCuidadorStyles.js";
import { ACCENT } from "../../utils/constants.js";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
      <View style={styles.headerLeft}>
        <View style={[styles.skeletonText, { width: 150, height: 26 }]} />
        <View style={[styles.skeletonText, { width: 80, height: 24, marginTop: 6 }]} />
      </View>
      <View style={styles.skeletonAvatar} />
    </View>

    <View style={styles.skeletonPanel} />
    <View style={styles.skeletonPanel} />
    <View style={styles.skeletonPanel} />

    <View style={{ alignItems: "center", marginTop: 20 }}>
      <ActivityIndicator size="large" color={ACCENT} />
    </View>
  </View>
);

export default function HomeScreenCuidador({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { paciente } = usePaciente();
  const zona = useZonaSegura(paciente);
  const tarjetas = useTarjetas();
  const { fotoPerfil, nombrePaciente, theme, getFontSize, loading } = usePacienteHome();

  const cerrarSesion = async () => {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar tu sesión actual?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
          } catch (error) {
            console.error("Error cerrando sesión:", error);
          }
        },
      },
    ]);
  };

  // Show loading skeleton while data loads
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerName}>{nombrePaciente}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.headerRole}>Cuidador</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Perfil')}
            activeOpacity={0.7}
          >
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.avatarCircle} />
            ) : (
              <FontAwesome5 name="user-circle" size={52} color={ACCENT} />
            )}
          </TouchableOpacity>
        </View>

        <PacientePanel paciente={paciente} navigation={navigation} />

        <ZonaSeguraPanel
          zonaSegura={zona.zonaSegura}
          ubicacionPaciente={zona.ubicacionPaciente}
          alertaActiva={zona.alertaActiva}
          distanciaActual={zona.distanciaActual}
          salidaSegura={zona.salidaSegura}
          toggleSalidaSegura={zona.toggleSalidaSegura}
          navigation={navigation}
        />

        <AlertasPanel alertas={zona.alertas} onClear={zona.limpiarAlertas} />

        <TarjetasPanel
          tarjetas={tarjetas.tarjetas}
          onAddPress={() => tarjetas.setModalVisible(true)}
          onDelete={tarjetas.eliminarTarjeta}
        />

        <QuickMenu navigation={navigation} />

        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <FontAwesome5 name="sign-out-alt" size={16} color="#FFF" />
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
