import React from "react";
import { View, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import usePacienteHome from "../../hooks/usePacienteHome";        
import HeaderPaciente from "../../components/paciente/HeaderPaciente"; 
import GridMenuPaciente from "../../components/paciente/GridMenuPaciente"; 
import { styles } from "../../styles/HomePacienteStyles";      

export default function HomeScreenPaciente({ navigation }) {
  const insets = useSafeAreaInsets();
  const { fotoPerfil, nombrePaciente, theme, getFontSize } = usePacienteHome();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#0D0D0D" : "#EDEDED" },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

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
    </View>
  );
}
