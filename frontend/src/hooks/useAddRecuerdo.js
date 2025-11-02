import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const formatDate = (date) => {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = date.toLocaleString("es-ES", { month: "long" });
  const year = date.getFullYear();
  return `${dayName}, ${day} de ${month} ${year}`;
};

export default function useAddRecuerdo(navigation) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !image) {
      Alert.alert("Error", "Completa todos los campos y selecciona una imagen.");
      return;
    }

    const newMemory = {
      id: Date.now().toString(),
      title,
      description,
      image,
      date: formatDate(new Date()),
    };

    try {
      const stored = await AsyncStorage.getItem("imageMemories");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newMemory);
      await AsyncStorage.setItem("imageMemories", JSON.stringify(list));
      Alert.alert("Éxito", "Recuerdo añadido correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving memory:", error);
      Alert.alert("Error", "No se pudo guardar el recuerdo");
    }
  };

  return { title, setTitle, description, setDescription, image, pickImage, handleSave };
}
