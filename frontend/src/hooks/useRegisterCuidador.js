import { useState } from "react";
import { Alert } from "react-native";

export default function useRegisterCuidador(navigation) {
  const [nombre, setNombre] = useState("");
  const [relacion, setRelacion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!nombre || !relacion || !telefono || !correo || !password || !confirmPassword) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Registro exitoso", `Bienvenido, ${nombre}.`);
      navigation.navigate("LoginCuidador");
    }, 1500);
  };

  return {
    nombre,
    setNombre,
    relacion,
    setRelacion,
    telefono,
    setTelefono,
    correo,
    setCorreo,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
    loading,
  };
}
