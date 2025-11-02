import { useEffect, useRef, useState } from "react";
import { Animated, Alert } from "react-native";
import { useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useLectorQR(navigation) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const paciente = JSON.parse(data);
      await AsyncStorage.setItem("pacienteAsignado", JSON.stringify(paciente));
      Alert.alert(
        "Paciente vinculado",
        `Has vinculado a ${paciente.NombreCompleto || paciente.nombre} correctamente.`,
        [{ text: "OK", onPress: () => navigation.replace("HomeCuidador") }]
      );
    } catch (error) {
      console.log("Error leyendo QR:", error);
      Alert.alert("Error", "El código QR no es válido o está corrupto.");
      setScanned(false);
    }
  };

  const linePosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  return {
    permission,
    requestPermission,
    scanned,
    setScanned,
    handleBarCodeScanned,
    linePosition,
  };
}
