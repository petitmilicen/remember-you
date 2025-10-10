import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");
const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function PerfilPacienteScreen({ navigation }) {
  const [paciente, setPaciente] = useState({
    NombreCompleto: "Paciente sin nombre",
    Edad: "—",
    ContactoEmergencia: "—",
    NivelAlzheimer: "Desconocido",
    FotoPerfil: null,
  });

  const [logros, setLogros] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const storedPaciente = await AsyncStorage.getItem("pacienteData");
      const storedLogros = await AsyncStorage.getItem("logrosData");
      if (storedPaciente) setPaciente(JSON.parse(storedPaciente));
      if (storedLogros) setLogros(JSON.parse(storedLogros));
    };
    fetchData();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const updatedPaciente = { ...paciente, FotoPerfil: result.assets[0].uri };
      setPaciente(updatedPaciente);
      await AsyncStorage.setItem("pacienteData", JSON.stringify(updatedPaciente));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8A6DE9", "#A88BFF"]}
        style={[styles.header, { paddingTop: TOP_PAD + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>
            Perfil
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage}>
            {paciente.FotoPerfil ? (
              <Image
                source={{ uri: paciente.FotoPerfil }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <FontAwesome5 name="camera" size={28} color="#8A6DE9" />
                <Text style={styles.placeholderText}>Añadir foto</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.profileName}>Diego</Text>
          <Text style={styles.profileSubtitle}>
            Nivel de Alzheimer: Alto
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Datos personales</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Edad:</Text>
            <Text style={styles.infoValue}>65</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Contacto de emergencia:</Text>
            <Text style={styles.infoValue}>+56 9 7212 4340</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Nivel de Alzheimer:</Text>
            <Text style={styles.infoValue}>Alto</Text>
          </View>
        </View>

        <View style={[styles.achievementsSection, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Logros</Text>

          {logros.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsList}
            >
              {logros.map((logro) => (
                <View key={logro.ID_Logro} style={styles.achievementCard}>
                  <FontAwesome5 name="medal" size={28} color="#FFD700" />
                  <Text style={styles.achievementTitle}>{logro.Nombre}</Text>
                  <Text style={styles.achievementDate}>
                    {logro.FechaObtencion}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>
              Aún no hay logros registrados 🕊️
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
    paddingBottom: Platform.OS === "android" ? 40 : 20,
  },
  
  header: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  scroll: {
    padding: 20,
    paddingBottom: Platform.OS === "android" ? 80 : 60, 
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    marginBottom: 25,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#8A6DE9",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F1FF",
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 12,
    color: "#8A6DE9",
    marginTop: 4,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  profileSubtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 10,
  },

  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8A6DE9",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  contactText: { color: "#FFF", marginLeft: 8, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8A6DE9",
    marginBottom: 10,
  },

  infoSection: { marginBottom: 25 },
  infoBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  infoLabel: { color: "#777", fontWeight: "bold" },
  infoValue: { fontSize: 16, color: "#333" },

  achievementsSection: { marginBottom: 20 },
  achievementsList: { flexDirection: "row" },
  achievementCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    width: 140,
    elevation: 3,
  },
  achievementTitle: { fontWeight: "bold", color: "#333", marginTop: 6 },
  achievementDate: { fontSize: 12, color: "#777" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
});
