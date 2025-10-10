import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5, Ionicons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nombrePaciente, setNombrePaciente] = useState("Paciente");

  useFocusEffect(
    React.useCallback(() => {
      const fetchPaciente = async () => {
        try {
          const stored = await AsyncStorage.getItem("pacienteData");
          if (stored) {
            const data = JSON.parse(stored);
            setFotoPerfil(data.FotoPerfil || null);
            setNombrePaciente(data.NombreCompleto || "Paciente");
          }
        } catch (error) {
          console.error("Error al cargar datos del paciente:", error);
        }
      };
      fetchPaciente();
    }, [])
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#8A6DE9", "#A88BFF"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("PerfilPaciente")}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={60} color="#FFF" />
          )}
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.greeting}>
            Hola,{" "}
            <Text style={{ fontWeight: "bold" }}>Denilxon</Text>
          </Text>
          <Text style={styles.subText}>#001</Text>
          <TouchableOpacity onPress={() => navigation.navigate("PerfilPaciente")}>
            <Text style={styles.profileLink}>Ver perfil ➜</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#F93827" }]}
          onPress={() => navigation.navigate("Actividades")}
        >
          <FontAwesome5 name="puzzle-piece" size={42} color="#FFF" />
          <Text style={styles.cardText}>Actividades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#FEBA17" }]}
          onPress={() => navigation.navigate("Bitacora")}
        >
          <FontAwesome5 name="book" size={38} color="#FFF" />
          <Text style={styles.cardText}>Bitácora</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#00C897" }]}
          onPress={() => navigation.navigate("Tarjetas")}
        >
          <FontAwesome5 name="sticky-note" size={42} color="#FFF" />
          <Text style={styles.cardText}>Tarjetas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#1A2A80" }]}
          onPress={() => navigation.navigate("Recuerdos")}
        >
          <Entypo name="images" size={40} color="#FFF" />
          <Text style={styles.cardText}>Recuerdos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#888" }]}
          onPress={() => navigation.navigate("Ajustes")}
        >
          <Ionicons name="settings-outline" size={42} color="#FFF" />
          <Text style={styles.cardText}>Ajustes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#FF9BDE" }]}
          onPress={() => navigation.navigate("Welcome")}
        >
          <MaterialIcons name="logout" size={42} color="#FFF" />
          <Text style={styles.cardText}>Salida</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },
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
  headerText: {
    marginLeft: 15,
    marginTop: 20,
  },
  greeting: {
    fontSize: 18,
    color: "#FFF",
  },
  subText: {
    fontSize: 12,
    color: "#EEE",
    marginBottom: 5,
  },
  profileLink: {
    fontSize: 14,
    color: "#FFF",
    textDecorationLine: "underline",
  },
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
