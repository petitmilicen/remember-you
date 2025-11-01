import React, { useState, useEffect, useContext} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";
import { AuthContext } from "../auth/AuthContext";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const { user, logout, loading } = useContext(AuthContext);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nombrePaciente, setNombrePaciente] = useState("Paciente");

  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const theme = settings.theme;

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

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Cerrar sesión",
        "¿Estás seguro que quieres cerrar sesión?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sí",
            onPress: async () => {
              console.log("Cerrando sesión");
              await logout();
              navigation.navigate("Welcome");
              console.log("Logout completado");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error en handleLogout:", error);
    }
  };

  const headerGradient =
    theme === "dark" ? ["#5C3CA6", "#7E5AE1"] : ["#8A6DE9", "#A88BFF"];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#0D0D0D" : "#EDEDED" },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={headerGradient}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("PerfilPaciente")}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={60} color="#FFF" />
          )}
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={[styles.greeting, { color: "#FFF" }, getFontSizeStyle(18)]}>
            Hola, <Text style={{ fontWeight: "bold" }}>{user?.username}</Text>
          </Text>
          <Text style={[styles.subText, { color: "#EEE" }, getFontSizeStyle(12)]}>
          #{user?.id}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("PerfilPaciente")}>
            <Text style={[styles.profileLink, { color: "#FFF" }, getFontSizeStyle(14)]}>
              Ver perfil ➜
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* CUADRÍCULA */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#F93827" }]}
          onPress={() => navigation.navigate("Actividades")}
        >
          <FontAwesome5 name="puzzle-piece" size={42} color="#FFF" />
          <Text style={[styles.cardText, getFontSizeStyle(15)]}>Actividades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#FEBA17" }]}
          onPress={() => navigation.navigate("Bitacora")}
        >
          <FontAwesome5 name="book" size={38} color="#FFF" />
          <Text style={[styles.cardText, getFontSizeStyle(15)]}>Bitácora</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#00C897" }]}
          onPress={() => navigation.navigate("Tarjetas")}
        >
          <FontAwesome5 name="sticky-note" size={42} color="#FFF" />
          <Text style={[styles.cardText, getFontSizeStyle(15)]}>Tarjetas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#1A2A80" }]}
          onPress={() => navigation.navigate("Recuerdos")}
        >
          <Entypo name="images" size={40} color="#FFF" />
          <Text style={[styles.cardText, getFontSizeStyle(15)]}>Recuerdos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: theme === "dark" ? "#444" : "#888" },
          ]}
          onPress={() => navigation.navigate("Ajustes")}
        >
          <Ionicons name="settings-outline" size={42} color="#FFF" />
          <Text style={[styles.cardText, getFontSizeStyle(15)]}>Ajustes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#FF9BDE" }]}
          onPress={handleLogout}
        >

        <MaterialIcons name="logout" size={42} color="#FFF" />
          <Text style={[styles.cardText, getFontSizeStyle(15)]}>Salida</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  headerText: { marginLeft: 15, marginTop: 20 },
  greeting: { fontSize: 18 },
  subText: { fontSize: 12, marginBottom: 5 },
  profileLink: { fontSize: 14, textDecorationLine: "underline" },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-evenly",
    padding: 20,
  },
  card: {
    width: width / 2.5,
    aspectRatio: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
});
