import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useRegisterPaciente(navigation) {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [contacto, setContacto] = useState("");
  const [nivel, setNivel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim() || !edad.trim() || !contacto.trim() || !nivel.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const newPaciente = {
        id: Date.now().toString(),
        nombre,
        edad,
        contacto,
        nivel,
        metodo: "Reconocimiento Facial",
      };

      const stored = await AsyncStorage.getItem("pacientes");
      const list = stored ? JSON.parse(stored) : [];
      list.push(newPaciente);
      await AsyncStorage.setItem("pacientes", JSON.stringify(list));

      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente.");
      navigation.replace("LoginPaciente");
    } catch (error) {
      console.error("Error al registrar:", error);
      Alert.alert("Error", "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return {
    nombre,
    setNombre,
    edad,
    setEdad,
    contacto,
    setContacto,
    nivel,
    setNivel,
    loading,
    handleRegister,
  };
}
