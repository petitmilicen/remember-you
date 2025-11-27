import { useEffect, useRef, useState } from "react";
import { Animated, Alert } from "react-native";
import { useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPatientById, assignPatientToCaregiver } from "../api/userService";

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

    console.log("QR Data raw:", data);

    try {
      const qrData = JSON.parse(data);
      console.log("QR Data parsed:", qrData);

      const patientId = qrData.patientId;
      console.log("Patient ID:", patientId);

      if (!patientId || patientId === "—") {
        throw new Error("QR inválido: no contiene ID de paciente válido");
      }

      console.log("Fetching patient info for ID:", patientId);
      const patientInfo = await getPatientById(patientId);
      console.log("Patient info received:", patientInfo);

      console.log("Assigning caregiver to patient...");
      const assignmentResponse = await assignPatientToCaregiver(patientId);
      console.log("Assignment response:", assignmentResponse);

      await AsyncStorage.setItem("pacienteAsignado", JSON.stringify(patientInfo));

      Alert.alert(
        "¡Paciente vinculado!",
        `Has sido asignado como cuidador de ${patientInfo.full_name || patientInfo.username}.`,
        [{ text: "OK", onPress: () => navigation.replace("HomeCuidador") }]
      );
    } catch (error) {
      console.log("Error leyendo QR:", error);
      console.log("Error details:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });

      let errorMessage = "El código QR no es válido o está corrupto.";

      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
      } else if (error instanceof SyntaxError) {
        errorMessage = "El código QR no tiene un formato válido.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage, [
        { text: "Intentar de nuevo", onPress: () => setScanned(false) }
      ]);
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
