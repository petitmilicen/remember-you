import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import usePerfilPaciente from "../../hooks/usePerfilPaciente";
import GroupAccordion from "../../components/paciente/GroupAccordion";
import { styles, lightStyles, darkStyles } from "../../styles/PerfilPacienteStyles";
import ModalSelectorImagen from "../../components/paciente/ModalSelectorImagen";

export default function PerfilPacienteScreen({ navigation }) {
  const {
    paciente,
    cuidador,
    modalVisible,
    setModalVisible,
    modalQR,
    setModalQR,
    openGroup,
    setOpenGroup,
    pickImage,
    removeImage,
    groups,
  } = usePerfilPaciente();

  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const dark = settings.theme === "dark";
  const themeStyles = dark ? darkStyles : lightStyles;

  const getFontSizeStyle = (base = 16) =>
    settings.fontSize === "small"
      ? { fontSize: base - 2 }
      : settings.fontSize === "large"
      ? { fontSize: base + 2 }
      : { fontSize: base };

  const gradientColors = dark ? ["#5B3AB4", "#7D5FE5"] : ["#8A6DE9", "#A88BFF"];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.headerBleed}>
        <LinearGradient colors={gradientColors} style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, getFontSizeStyle(20)]}>Perfil</Text>
          <TouchableOpacity onPress={() => setModalQR(true)}>
            <FontAwesome5 name="qrcode" size={26} color="#FFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      </ScrollView>

      <Modal transparent visible={modalQR}>
      </Modal>

      <ModalSelectorImagen
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCamera={() => pickImage("camera")}
        onSelectGallery={() => pickImage("gallery")}
      />
    </View>
  );
}
