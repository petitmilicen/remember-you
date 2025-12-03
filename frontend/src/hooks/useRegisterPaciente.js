import { useState } from "react";
import { Alert } from "react-native";
import { login, register } from "../auth/authService";

export default function useRegisterPaciente(navigation) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [contacto, setContacto] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [alzheimerLevel, setAlzheimerLevel] = useState("");

  const [loading, setLoading] = useState(false);
  const base = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, "");
  const username = `${base}_${Math.floor(Math.random() * 10000)}`;

  const handleRegister = async (extraFields = {}) => {
    const { gender, alzheimerLevel } = extraFields;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !edad.trim() ||
      !contacto.trim() ||
      !gender?.trim() ||
      !alzheimerLevel?.trim()
    ) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: contacto,
        user_type: "Patient",
        age: Number(edad),
        gender,
        alzheimer_level: alzheimerLevel,
        username: username,
      };

      console.log("Payload registro:", payload);

      await register(payload);
      await login(email, password);
      navigation.navigate("Home");

      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente.");

    } catch (error) {
      console.log("Error al registrar:", error.response?.data || error);

      let errorMessage = "No se pudo completar el registro.";

      if (error.response) {
        // Server responded
        errorMessage = error.response.data?.email?.[0] ||
          error.response.data?.password?.[0] ||
          error.response.data?.detail ||
          JSON.stringify(error.response.data);
      } else if (error.request) {
        // Network error
        errorMessage = "Error de conexión. Verifica tu internet o la IP del servidor.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    edad, setEdad,
    contacto, setContacto,
    password, setPassword,
    gender, setGender,
    alzheimerLevel, setAlzheimerLevel,
    loading,
    handleRegister,
  };
}
