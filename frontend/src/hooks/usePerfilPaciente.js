import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { getUserProfile, uploadProfilePicture, deleteProfilePicture } from "../api/userService";

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
  const [uploading, setUploading] = useState(false);

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

        // Fetch achievements from API
        const { getAchievements } = await import("../api/achievementService");
        const achievementsData = await getAchievements();

        // Map achievements with their corresponding icons
        const achievementIcons = {
          memorice_1: require("../assets/images/Logros/memorice/1PrimerRecuerdo.png"),
          memorice_2: require("../assets/images/Logros/memorice/2MemoriaRapida.png"),
          memorice_3: require("../assets/images/Logros/memorice/3MaestrodelRecuerdo.png"),
          puzzle_1: require("../assets/images/Logros/rompecabezas/4PiezaensuLugar.png"),
          puzzle_2: require("../assets/images/Logros/rompecabezas/5ConstrucciónPerfecta.png"),
          puzzle_3: require("../assets/images/Logros/rompecabezas/6ArtesanodelPuzzle.png"),
          sudoku_1: require("../assets/images/Logros/sudoku/7PrimerNumero.png"),
          sudoku_2: require("../assets/images/Logros/sudoku/8MenteLogica.png"),
          sudoku_3: require("../assets/images/Logros/sudoku/9MaestrodelSudoku.png"),
          camino_1: require("../assets/images/Logros/caminocorrecto/10PrimerCamino.png"),
          camino_2: require("../assets/images/Logros/caminocorrecto/11SinPerderse.png"),
          camino_3: require("../assets/images/Logros/caminocorrecto/12ExploradorTotal.png"),
        };

        const mappedAchievements = achievementsData.map(achievement => ({
          Juego: achievement.category,
          icon: achievementIcons[`${achievement.category}_${achievement.level}`],
          unlocked: !!achievement.unlocked,
          title: achievement.title,
          description: achievement.description,
        }));

        // Sort achievements: first by game category order, then by level
        const gameOrder = { memorice: 1, puzzle: 2, sudoku: 3, camino: 4 };
        const sortedAchievements = mappedAchievements.sort((a, b) => {
          const gameComparison = gameOrder[a.Juego] - gameOrder[b.Juego];
          if (gameComparison !== 0) return gameComparison;

          // If same game, sort by level (extract from icon path or title)
          const levelA = achievementsData.find(ach => ach.category === a.Juego && ach.title === a.title)?.level || 0;
          const levelB = achievementsData.find(ach => ach.category === b.Juego && ach.title === b.title)?.level || 0;
          return levelA - levelB;
        });

        setLogros(sortedAchievements);
      } catch (err) {
        console.error("Error cargando datos del backend:", err);
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
        const imageUri = result.assets[0].uri;

        setUploading(true);
        setModalVisible(false);

        try {
          const response = await uploadProfilePicture(imageUri);

          setPaciente(prev => ({
            ...prev,
            FotoPerfil: response.profile_picture
          }));

          Alert.alert("¡Éxito!", "Tu foto de perfil se actualizó correctamente.");
        } catch (uploadError) {
          console.error("Error subiendo imagen:", uploadError);
          Alert.alert(
            "Error de conexión",
            "No se pudo subir la imagen al servidor. Verifica tu conexión e intenta de nuevo."
          );
        } finally {
          setUploading(false);
        }
      } else {
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error seleccionando imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
      setModalVisible(false);
    }
  };

  const removeImage = () => {
    Alert.alert(
      "Eliminar foto",
      "¿Seguro que deseas eliminar la imagen de perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setUploading(true);
              await deleteProfilePicture();

              // Update local state
              setPaciente(prev => ({
                ...prev,
                FotoPerfil: null
              }));

              Alert.alert("Eliminada", "Tu foto de perfil fue eliminada.");
            } catch (error) {
              console.error("Error eliminando imagen:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar la imagen. Verifica tu conexión e intenta de nuevo."
              );
            } finally {
              setUploading(false);
            }
          },
        },
      ]
    );
  };

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
    uploading,
  };
}
