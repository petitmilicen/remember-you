import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { getUserProfile } from "../api/userService";

export default function usePerfilPaciente() {
  const [paciente, setPaciente] = useState({
    ID: "—",
    NombreCompleto: "Paciente sin nombre",
    Genero: "—",
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
    const fetchData = async () => {
      try {
        const data = await getUserProfile();
        console.log("Perfil del backend:", data);

        if (data) {
          setPaciente({
            ID: data.id || "—",
            NombreCompleto:
              data.full_name || "Paciente sin nombre",
            Genero: data.gender || "—",
            Edad: data.age || "—",
            ContactoEmergencia: data.phone_number || "No registrado",
            NivelAlzheimer: data.alzheimer_level || "Desconocido",
            FotoPerfil: data.profile_picture || null,
          });

          if (data.main_caregiver) {
            setCuidador({
              Nombre: data.main_caregiver.full_name || "Sin asignar",
              Rol: "Cuidador principal",
            });
          }
        }

        setLogros([
          // MEMORICE
          {
            Juego: "memorice",
            icon: require("../assets/images/Logros/memorice/1PrimerRecuerdo.png"),
            unlocked: false,
          },
          {
            Juego: "memorice",
            icon: require("../assets/images/Logros/memorice/2MemoriaRapida.png"),
            unlocked: false,
          },
          {
            Juego: "memorice",
            icon: require("../assets/images/Logros/memorice/3MaestrodelRecuerdo.png"),
            unlocked: false,
          },

          // PUZZLE
          {
            Juego: "puzzle",
            icon: require("../assets/images/Logros/rompecabezas/4PiezaensuLugar.png"),
            unlocked: false,
          },
          {
            Juego: "puzzle",
            icon: require("../assets/images/Logros/rompecabezas/5ConstrucciónPerfecta.png"),
            unlocked: false,
          },
          {
            Juego: "puzzle",
            icon: require("../assets/images/Logros/rompecabezas/6ArtesanodelPuzzle.png"),
            unlocked: false,
          },

          // SUDOKU
          {
            Juego: "sudoku",
            icon: require("../assets/images/Logros/sudoku/7PrimerNumero.png"),
            unlocked: false,
          },
          {
            Juego: "sudoku",
            icon: require("../assets/images/Logros/sudoku/8MenteLogica.png"),
            unlocked: false,
          },
          {
            Juego: "sudoku",
            icon: require("../assets/images/Logros/sudoku/9MaestrodelSudoku.png"),
            unlocked: false,
          },

          // CAMINO CORRECTO
          {
            Juego: "camino",
            icon: require("../assets/images/Logros/caminocorrecto/10PrimerCamino.png"),
            unlocked: false,
          },
          {
            Juego: "camino",
            icon: require("../assets/images/Logros/caminocorrecto/11SinPerderse.png"),
            unlocked: false,
          },
          {
            Juego: "camino",
            icon: require("../assets/images/Logros/caminocorrecto/12ExploradorTotal.png"),
            unlocked: false,
          },
        ]);
      } catch (err) {
        console.error("Error cargando datos del backend:", err);
      }
    };

    fetchData();
  }, []);

  // 🔹 Selección de imagen (solo visual, no sube al backend aún)
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
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        Alert.alert("Imagen seleccionada", "La foto se actualizó localmente.");
      }
    } catch (error) {
      console.error("Error seleccionando imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    } finally {
      setModalVisible(false);
    }
  };

  // 🔹 Eliminar imagen (solo visual)
  const removeImage = () => {
    Alert.alert(
      "Eliminar foto",
      "¿Seguro que deseas eliminar la imagen de perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const updated = { ...paciente, FotoPerfil: null };
            setPaciente(updated);
          },
        },
      ]
    );
  };

  // 🔹 Generar grupos de logros
  const groupByGame = (game) =>
    (logros || [])
      .filter((l) => (l.Juego || "").toLowerCase().includes(game.toLowerCase()))
      .slice(0, 4);

  const groups = [
    { key: "Memorice", title: "Memorice", data: groupByGame("memorice") },
    { key: "Puzzle", title: "Puzzle", data: groupByGame("puzzle") },
    { key: "Sudoku", title: "Sudoku", data: groupByGame("sudoku") },
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
