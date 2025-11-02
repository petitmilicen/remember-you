import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export default function usePerfilPaciente() {
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
  const [logros, setLogros] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQR, setModalQR] = useState(false);
  const [openGroup, setOpenGroup] = useState("Memorice");

  useEffect(() => {
    (async () => {
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
    })();
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
        result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
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
        const updated = { ...paciente, FotoPerfil: result.assets[0].uri };
        setPaciente(updated);
        await AsyncStorage.setItem("pacienteData", JSON.stringify(updated));
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
          const updated = { ...paciente, FotoPerfil: null };
          setPaciente(updated);
          await AsyncStorage.setItem("pacienteData", JSON.stringify(updated));
        },
      },
    ]);
  };

  const groupByGame = (game) =>
    (logros || [])
      .filter((l) => (l.Juego || "").toLowerCase().includes(game.toLowerCase()))
      .slice(0, 4);

  const groups = [
    { key: "Memorice", title: "Memorice", data: groupByGame("memorice") },
    { key: "Puzzle", title: "Puzzle", data: groupByGame("puzzle") },
    { key: "Lectura", title: "Sudoku", data: groupByGame("Sudoku") },
    { key: "Camino", title: "Camino Correcto", data: groupByGame("camino") },
  ];

  return {
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
  };
}
