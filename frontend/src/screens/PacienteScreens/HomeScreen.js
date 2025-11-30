import React, { useEffect } from "react";
import { View, StatusBar, ActivityIndicator, Text, BackHandler } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import usePacienteHome from "../../hooks/usePacienteHome";
import HeaderPaciente from "../../components/paciente/HeaderPaciente";
import GridMenuPaciente from "../../components/paciente/GridMenuPaciente";
import { styles } from "../../styles/HomePacienteStyles";

export default function HomeScreenPaciente({ navigation }) {
  const insets = useSafeAreaInsets();
  const { fotoPerfil, nombrePaciente, theme, getFontSize, loading } = usePacienteHome();

  // Bloquear el botón de retroceso del sistema Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Retornar true previene la acción por defecto (salir de la app)
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#0D0D0D" : "#EDEDED" },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FEBA17" />
          <Text style={{ color: "#FEBA17", marginTop: 8 }}>Cargando perfil...</Text>
        </View>
      ) : (
        <>
          <HeaderPaciente
            navigation={navigation}
            fotoPerfil={fotoPerfil}
            nombrePaciente={nombrePaciente}
            theme={theme}
            getFontSize={getFontSize}
            insets={insets}
          />

          <GridMenuPaciente
            navigation={navigation}
            theme={theme}
            getFontSize={getFontSize}
          />
        </>
      )}
    </View>
  );
}
