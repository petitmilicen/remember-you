import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import usePerfilPaciente from "../../hooks/usePerfilPaciente";
import GroupAccordion from "../../components/paciente/GroupAccordion";
import {
  styles,
  lightStyles,
  darkStyles,
} from "../../styles/PerfilPacienteStyles";
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
    uploading,
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
    <View
      style={[
        styles.container,
        themeStyles.container,
        { paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.headerBleed}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, getFontSizeStyle(20)]}>Perfil</Text>
          <TouchableOpacity onPress={() => setModalQR(true)}>
            <FontAwesome5 name="qrcode" size={26} color="#FFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* PERFIL */}
        <View style={[styles.profileCard, themeStyles.card]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => !uploading && setModalVisible(true)}
            style={styles.imageContainer}
            disabled={uploading}
          >
            {paciente.FotoPerfil ? (
              <>
                <Image
                  source={{ uri: paciente.FotoPerfil }}
                  style={styles.profileImage}
                />
                {!uploading && (
                  <View style={styles.overlayCamera}>
                    <FontAwesome5 name="camera" size={16} color="#FFF" />
                  </View>
                )}
              </>
            ) : (
              <View style={styles.placeholder}>
                <FontAwesome5 name="user-plus" size={42} color="#6F52D6" />
                <Text style={[styles.placeholderText, getFontSizeStyle(13)]}>
                  Agregar foto
                </Text>
              </View>
            )}

            {uploading && (
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <ActivityIndicator size="large" color="#FEBA17" />
                <Text style={{ color: '#FFF', marginTop: 8, fontSize: 12 }}>
                  Subiendo...
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {paciente.FotoPerfil && !uploading && (
            <TouchableOpacity onPress={removeImage} style={styles.deleteButton}>
              <FontAwesome5 name="trash-alt" size={14} color="#FFF" />
            </TouchableOpacity>
          )}

          <Text
            style={[styles.profileName, themeStyles.text, getFontSizeStyle(22)]}
          >
            {paciente.NombreCompleto}
          </Text>
          <Text
            style={[
              styles.profileSubtitle,
              themeStyles.subtext,
              getFontSizeStyle(15),
            ]}
          >
            Nivel de Alzheimer: {paciente.NivelAlzheimer}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text
            style={[
              styles.sectionTitle,
              themeStyles.sectionTitle,
              getFontSizeStyle(18),
            ]}
          >
            Datos personales
          </Text>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text
              style={[
                styles.infoLabel,
                themeStyles.subtext,
                getFontSizeStyle(15),
              ]}
            >
              Género:
            </Text>
            <Text
              style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}
            >
              {paciente.Genero}
            </Text>
          </View>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text
              style={[
                styles.infoLabel,
                themeStyles.subtext,
                getFontSizeStyle(15),
              ]}
            >
              Edad:
            </Text>
            <Text
              style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}
            >
              {paciente.Edad}
            </Text>
          </View>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text
              style={[
                styles.infoLabel,
                themeStyles.subtext,
                getFontSizeStyle(15),
              ]}
            >
              Contacto de emergencia:
            </Text>
            <Text
              style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}
            >
              {paciente.ContactoEmergencia}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text
            style={[
              styles.sectionTitle,
              themeStyles.sectionTitle,
              getFontSizeStyle(18),
            ]}
          >
            Cuidador actual
          </Text>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text
              style={[
                styles.infoLabel,
                themeStyles.subtext,
                getFontSizeStyle(15),
              ]}
            >
              Nombre:
            </Text>
            <Text
              style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}
            >
              {cuidador.Nombre}
            </Text>
          </View>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text
              style={[
                styles.infoLabel,
                themeStyles.subtext,
                getFontSizeStyle(15),
              ]}
            >
              Rol:
            </Text>
            <Text
              style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}
            >
              {cuidador.Rol}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text
            style={[
              styles.sectionTitle,
              themeStyles.sectionTitle,
              getFontSizeStyle(18),
            ]}
          >
            Expositor de Logros
          </Text>
          {[
            { key: "Memorice", title: "Memorice", data: groups[0].data },
            { key: "Puzzle", title: "Puzzle", data: groups[1].data },
            { key: "Sudoku", title: "Sudoku", data: groups[2].data },
            { key: "Camino", title: "Camino Correcto", data: groups[3].data },
          ].map((g) => (
            <GroupAccordion
              key={g.key}
              title={g.title}
              items={g.data}
              open={openGroup === g.key}
              dark={dark}
              onToggle={() =>
                setOpenGroup((prev) => (prev === g.key ? "" : g.key))
              }
            />
          ))}
        </View>
      </ScrollView>

      {modalQR && (
        <Modal transparent visible={modalQR} animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{ backgroundColor: "#FFF", padding: 20, borderRadius: 16 }}
            >
              <QRCode value={JSON.stringify({ patientId: paciente.ID })} size={220} />
              <TouchableOpacity
                onPress={() => setModalQR(false)}
                style={{ marginTop: 20, alignSelf: "center" }}
              >
                <Text style={{ color: "#8A6DE9", fontWeight: "bold" }}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <ModalSelectorImagen
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCamera={() => pickImage("camera")}
        onSelectGallery={() => pickImage("gallery")}
      />


    </View>
  );
}
