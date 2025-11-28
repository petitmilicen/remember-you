import { useState } from "react";
import { Alert } from "react-native";
import { login, register } from "../auth/authService";

export default function useRegisterCuidador(navigation) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relacion, setRelacion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validar que todos los campos estén completos
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !relacion.trim() ||
      !telefono.trim() ||
      !correo.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);

      // Generar username único
      const base = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, "");
      const username = `${base}_${Math.floor(Math.random() * 10000)}`;

      const payload = {
        email: correo.trim(),
        password: password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: telefono.trim(),
        user_type: "Caregiver",
        username: username,
        // Campos opcionales para cuidadores
        relationship: relacion.trim(), // Relación con el paciente
      };

      console.log("Payload registro cuidador:", payload);

      await register(payload);
      await login(correo.trim(), password);

      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente.");
      navigation.navigate("Home");

    } catch (error) {
      console.log("Error al registrar:", error.response?.data || error);

      Alert.alert(
        "Error",
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.detail ||
        "No se pudo completar el registro."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
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
    loading,
    handleRegister,
  };
}
