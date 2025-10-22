import React, { useState, useEffect, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";

const { width } = Dimensions.get("window");

/* ---------- Hexágono puro con 3 vistas (rectángulo + triángulos) ---------- */
const Hexagon = memo(function Hexagon({
  size = 80,
  unlocked = false,
  label = "",
  dark = false,
}) {
  const W = size;
  const H = Math.round((Math.sqrt(3) / 2) * W); // proporción de hex regular
  const TRI_H = Math.round(H * 0.25); // altura de los triángulos
  const MID_H = H - TRI_H * 2;

  const borderColor = unlocked ? "#FFD700" : dark ? "#3A3A3A" : "#CFCFCF";
  const midBg = unlocked
    ? "rgba(255,215,0,0.18)"
    : dark
    ? "rgba(255,255,255,0.04)"
    : "rgba(0,0,0,0.03)";

  return (
    <View style={{ width: W, height: H, alignItems: "center" }}>
      {/* Triángulo superior */}
      <View
        style={[
          styles.hexTri,
          {
            borderLeftWidth: W / 2,
            borderRightWidth: W / 2,
            borderBottomWidth: TRI_H,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: borderColor,
          },
        ]}
      />
      {/* Rectángulo central */}
      <View
        style={[
          styles.hexMid,
          {
            width: W,
            height: MID_H,
            backgroundColor: midBg,
            borderLeftColor: borderColor,
            borderRightColor: borderColor,
            borderLeftWidth: 2,
            borderRightWidth: 2,
            shadowColor: unlocked ? "#FFD700" : dark ? "#000" : "#999",
            shadowOpacity: unlocked ? 0.45 : 0.25,
            shadowRadius: unlocked ? 6 : 4,
            elevation: unlocked ? 6 : 3,
          },
        ]}
      >
        {unlocked ? (
          <>
            <FontAwesome5 name="medal" size={22} color="#FFD700" />
            {!!label && (
              <Text
                numberOfLines={2}
                style={{
                  marginTop: 4,
                  fontWeight: "600",
                  fontSize: 11,
                  textAlign: "center",
                  color: dark ? "#FFF" : "#222",
                }}
              >
                {label}
              </Text>
            )}
          </>
        ) : (
          <FontAwesome5
            name="circle"
            size={20}
            color={dark ? "#444" : "#BFBFBF"}
          />
        )}
      </View>
      {/* Triángulo inferior */}
      <View
        style={[
          styles.hexTri,
          {
            borderLeftWidth: W / 2,
            borderRightWidth: W / 2,
            borderTopWidth: TRI_H,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: borderColor,
          },
        ]}
      />
    </View>
  );
});

/* ---------- Acordeón de grupo (título + 2x2 hexágonos) ---------- */
const GroupAccordion = memo(function GroupAccordion({
  title,
  items = [], // [{Nombre, ...}]
  open = false,
  onToggle,
  dark = false,
}) {
  // aseguramos 4 espacios siempre
  const slots = Array.from({ length: 4 }).map((_, i) => items[i] || null);

  return (
    <View style={{ marginBottom: 14 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onToggle}
        style={[
          styles.groupHeader,
          { backgroundColor: dark ? "#1A1A1A" : "#FFFFFF" },
        ]}
      >
        <Text
          style={[
            styles.groupTitle,
            { color: dark ? "#A88BFF" : "#8A6DE9" },
          ]}
        >
          {title}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={dark ? "#DDD" : "#555"}
        />
      </TouchableOpacity>

      {open && (
        <View style={[styles.groupBody, dark ? styles.groupBodyDark : styles.groupBodyLight]}>
          <View style={styles.hexRow}>
            <Hexagon
              unlocked={!!slots[0]}
              label={slots[0]?.Nombre}
              dark={dark}
              size={78}
            />
            <Hexagon
              unlocked={!!slots[1]}
              label={slots[1]?.Nombre}
              dark={dark}
              size={78}
            />
          </View>
          <View style={{ height: 10 }} />
          <View style={styles.hexRow}>
            <Hexagon
              unlocked={!!slots[2]}
              label={slots[2]?.Nombre}
              dark={dark}
              size={78}
            />
            <Hexagon
              unlocked={!!slots[3]}
              label={slots[3]?.Nombre}
              dark={dark}
              size={78}
            />
          </View>
        </View>
      )}
    </View>
  );
});

export default function PerfilPacienteScreen({ navigation }) {
  const [paciente, setPaciente] = useState({
    ID: "PACIENTE-001",
    NombreCompleto: "Paciente sin nombre",
    Genero: "Masculino",
    Edad: "—",
    ContactoEmergencia: "—",
    NivelAlzheimer: "Desconocido",
    FotoPerfil: null,
  });

  const [cuidador, setCuidador] = useState({ Nombre: "Sin asignar", Rol: "—" });
  const [logros, setLogros] = useState([]); // [{ID_Logro, Nombre, FechaObtencion, Juego}]
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQR, setModalQR] = useState(false);

  // acordeón: solo uno abierto a la vez
  const [openGroup, setOpenGroup] = useState("Memorice");

  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const dark = settings.theme === "dark";
  const themeStyles = dark ? darkStyles : lightStyles;

  const getFontSizeStyle = (baseSize = 16) => {
    switch (settings.fontSize) {
      case "small":
        return { fontSize: baseSize - 2 };
      case "large":
        return { fontSize: baseSize + 2 };
      default:
        return { fontSize: baseSize };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedPaciente = await AsyncStorage.getItem("pacienteData");
        const storedLogros = await AsyncStorage.getItem("logrosData");
        const storedCuidador = await AsyncStorage.getItem("cuidadorData");
        if (storedPaciente) setPaciente(JSON.parse(storedPaciente));
        if (storedLogros) setLogros(JSON.parse(storedLogros));
        if (storedCuidador) setCuidador(JSON.parse(storedCuidador));
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchData();
  }, []);

  const pickImage = async (source) => {
    try {
      let result;
      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permiso denegado", "Se necesita acceso a la cámara.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permiso requerido", "Se necesita acceso a la galería.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        const updatedPaciente = { ...paciente, FotoPerfil: result.assets[0].uri };
        setPaciente(updatedPaciente);
        await AsyncStorage.setItem("pacienteData", JSON.stringify(updatedPaciente));
      }
    } catch (error) {
      console.error("Error seleccionando imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    } finally {
      setModalVisible(false);
    }
  };

  const removeImage = async () => {
    Alert.alert("Eliminar foto", "¿Seguro que deseas eliminar la imagen de perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const updatedPaciente = { ...paciente, FotoPerfil: null };
          setPaciente(updatedPaciente);
          await AsyncStorage.setItem("pacienteData", JSON.stringify(updatedPaciente));
        },
      },
    ]);
  };

  const gradientColors = dark ? ["#5B3AB4", "#7D5FE5"] : ["#8A6DE9", "#A88BFF"];

  // helper para agrupar logros por juego (tomamos máximo 4 por grupo)
  const groupByGame = (gameName) =>
    (logros || [])
      .filter((l) => (l.Juego || "").toLowerCase().includes(gameName.toLowerCase()))
      .slice(0, 4);

  const groups = [
    { key: "Memorice", title: "Memorice", data: groupByGame("memorice") },
    { key: "Puzzle", title: "Puzzle", data: groupByGame("puzzle") },
    { key: "Lectura", title: "Lectura Guiada", data: groupByGame("lectura") },
    { key: "Camino", title: "Camino Correcto", data: groupByGame("camino") },
  ];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* HEADER */}
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

      {/* CONTENIDO */}
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* PERFIL */}
        <View style={[styles.profileCard, themeStyles.card]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setModalVisible(true)}
            style={styles.imageContainer}
          >
            {paciente.FotoPerfil ? (
              <>
                <Image source={{ uri: paciente.FotoPerfil }} style={styles.profileImage} />
                <View style={styles.overlayCamera}>
                  <FontAwesome5 name="camera" size={16} color="#FFF" />
                </View>
              </>
            ) : (
              <View style={styles.placeholder}>
                <FontAwesome5 name="user-plus" size={42} color="#6F52D6" />
                <Text style={[styles.placeholderText, getFontSizeStyle(13)]}>Agregar foto</Text>
              </View>
            )}
          </TouchableOpacity>

          {paciente.FotoPerfil && (
            <TouchableOpacity onPress={removeImage} style={styles.deleteButton}>
              <FontAwesome5 name="trash-alt" size={14} color="#FFF" />
            </TouchableOpacity>
          )}

          <Text style={[styles.profileName, themeStyles.text, getFontSizeStyle(22)]}>
            {paciente.NombreCompleto}
          </Text>
          <Text style={[styles.profileSubtitle, themeStyles.subtext, getFontSizeStyle(15)]}>
            Nivel de Alzheimer: {paciente.NivelAlzheimer}
          </Text>
        </View>

        {/* DATOS PERSONALES */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, themeStyles.sectionTitle, getFontSizeStyle(18)]}>
            Datos personales
          </Text>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text style={[styles.infoLabel, themeStyles.subtext, getFontSizeStyle(15)]}>Género:</Text>
            <Text style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}>
              {paciente.Genero}
            </Text>
          </View>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text style={[styles.infoLabel, themeStyles.subtext, getFontSizeStyle(15)]}>Edad:</Text>
            <Text style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}>
              {paciente.Edad}
            </Text>
          </View>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text style={[styles.infoLabel, themeStyles.subtext, getFontSizeStyle(15)]}>
              Contacto de emergencia:
            </Text>
            <Text style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}>
              {paciente.ContactoEmergencia}
            </Text>
          </View>
        </View>

        {/* CUIDADOR */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, themeStyles.sectionTitle, getFontSizeStyle(18)]}>
            Cuidador actual
          </Text>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text style={[styles.infoLabel, themeStyles.subtext, getFontSizeStyle(15)]}>Nombre:</Text>
            <Text style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}>
              {cuidador.Nombre}
            </Text>
          </View>
          <View style={[styles.infoBox, themeStyles.card]}>
            <Text style={[styles.infoLabel, themeStyles.subtext, getFontSizeStyle(15)]}>Rol:</Text>
            <Text style={[styles.infoValue, themeStyles.text, getFontSizeStyle(16)]}>
              {cuidador.Rol}
            </Text>
          </View>
        </View>

        {/* EXPOSITOR (Acordeón 4× grupos, cada uno 2×2 = 4 slots) */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, themeStyles.sectionTitle, getFontSizeStyle(18)]}>
            Expositor de Logros
          </Text>

          {groups.map((g) => (
            <GroupAccordion
              key={g.key}
              title={g.title}
              items={g.data}
              open={openGroup === g.key}
              dark={dark}
              onToggle={() => setOpenGroup((prev) => (prev === g.key ? "" : g.key))}
            />
          ))}

          {(!logros || logros.length === 0) && (
            <Text style={[styles.emptyText, themeStyles.subtext, getFontSizeStyle(14)]}>
              Aún no hay logros desbloqueados 🕊️
            </Text>
          )}
        </View>
      </ScrollView>

      {/* MODALES */}
      <Modal transparent visible={modalQR} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalQRBox, themeStyles.card]}>
            <Text style={[styles.modalTitle, themeStyles.text, getFontSizeStyle(16)]}>
              QR del paciente
            </Text>
            <QRCode
              value={paciente.ID}
              size={200}
              color={dark ? "#FFF" : "#4B0082"}
              backgroundColor={dark ? "#222" : "#FFF"}
            />
            <Text style={[styles.qrText, themeStyles.subtext, getFontSizeStyle(13)]}>
              ID: {paciente.ID}
            </Text>
            <TouchableOpacity onPress={() => setModalQR(false)} style={styles.cancelButton}>
              <Text style={[styles.cancelText, getFontSizeStyle(15)]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, themeStyles.card]}>
            <Text style={[styles.modalTitle, themeStyles.text, getFontSizeStyle(16)]}>
              Seleccionar imagen desde:
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#8A6DE9" }]}
              onPress={() => pickImage("camera")}
            >
              <FontAwesome5 name="camera" size={18} color="#FFF" />
              <Text style={[styles.modalButtonText, getFontSizeStyle(15)]}>Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#A88BFF" }]}
              onPress={() => pickImage("gallery")}
            >
              <FontAwesome5 name="image" size={18} color="#FFF" />
              <Text style={[styles.modalButtonText, getFontSizeStyle(15)]}>Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={[styles.cancelText, getFontSizeStyle(15)]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* 🎨 Estilos */
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBleed: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 5,
  },
  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: { color: "#FFF", fontWeight: "bold" },
  profileCard: {
    alignItems: "center",
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    marginBottom: 25,
  },
  imageContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#8A6DE9",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE8FF",
  },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  overlayCamera: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(106,65,224,0.5)",
    alignItems: "center",
    paddingVertical: 6,
  },
  placeholder: { justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#6F52D6", fontWeight: "500" },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF4E4E",
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
  profileName: { fontWeight: "bold", marginTop: 10 },
  profileSubtitle: { marginBottom: 10 },
  sectionTitle: { fontWeight: "bold", marginBottom: 10 },
  infoSection: { marginBottom: 25 },
  infoBox: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  infoLabel: { fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 12 },

  /* Acordeón */
  groupHeader: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupTitle: {
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  groupBody: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    elevation: 3,
  },
  groupBodyLight: { backgroundColor: "#FFFFFF" },
  groupBodyDark: { backgroundColor: "#1E1E1E", borderWidth: 1, borderColor: "#2C2C2C" },
  hexRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  /* Hex building blocks */
  hexTri: {
    width: 0,
    height: 0,
  },
  hexMid: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 6,
    paddingHorizontal: 6,
  },
});

/* 🌙 Estilos temáticos */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#222" },
  subtext: { color: "#666" },
  sectionTitle: { color: "#8A6DE9" },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1A1A1A", borderColor: "#2C2C2C", borderWidth: 1 },
  text: { color: "#FFF" },
  subtext: { color: "#AAA" },
  sectionTitle: { color: "#A88BFF" },
});
