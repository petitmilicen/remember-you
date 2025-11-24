import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useLogin(navigation) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos incompletos", "Por favor ingresa tus credenciales.");
      return; 
    }

  try {
    await login(email, password);
    navigation.navigate("Home");
  } catch (err) {

    setError('Correo o contraseña incorrectos');
  }
  };

  return { email, setEmail, password, setPassword, loading, handleLogin };
}
