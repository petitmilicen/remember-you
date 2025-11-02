import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePaciente from "../../hooks/usePaciente.js";
import useZonaSegura from "../../hooks/useZonaSegura.js";
import useTarjetas from "../../hooks/useTarjetas.js";
import PacientePanel from "../../components/cuidador/PacientePanel.js";
import ZonaSeguraPanel from "../../components/cuidador/ZonaSeguraPanel.js";
import AlertasPanel from "../../components/cuidador/AlertasPanel.js";
import TarjetasPanel from "../../components/cuidador/TarjetasPanel.js";
import QuickMenu from "../../components/cuidador/QuickMenu.js";
import NuevaTarjetaModal from "../../components/cuidador/NuevaTarjetaModal.js";
import { styles } from "../../styles/HomeCuidadorStyles.js";
import { ACCENT } from "../../utils/constants.js";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function HomeScreenCuidador({ navigation }) {
  const cuidador = { nombre: "María Pérez", rol: "Cuidadora principal" };
  const { paciente } = usePaciente(); 
  const zona = useZonaSegura(paciente); 
  const tarjetas = useTarjetas(); 

  const cerrarSesion = async () => {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar tu sesión actual?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
          } catch (error) {
            console.error("Error cerrando sesión:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
          <Text style={styles.headerName}>{cuidador.nombre}</Text>
          <Text style={styles.headerRole}>{cuidador.rol}</Text>
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

        <AlertasPanel alertas={zona.alertas} />

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