import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useLoginCuidador(navigation) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos incompletos", "Por favor ingresa tus credenciales.");
      return;
    }

    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem("cuidadores");
      const list = stored ? JSON.parse(stored) : [];
      const found = list.find(
        (c) => c.email === email.trim() && c.password === password.trim()
      );

      if (found) {
        await AsyncStorage.setItem("cuidadorActivo", JSON.stringify(found));
        Alert.alert("Bienvenido", `Hola ${found.nombre || "cuidador"} 👋`);
        navigation.replace("HomeCuidador");
      } else {
        Alert.alert("Error", "Correo o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert("Error", "Ocurrió un problema al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, handleLogin };
}
