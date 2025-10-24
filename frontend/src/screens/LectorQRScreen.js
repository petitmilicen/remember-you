import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const ACCENT = "#FF7043";

export default function LectorQRScreen({ navigation }) {
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

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Solicitando permiso para la cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No se otorgó permiso para usar la cámara.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={styles.btnText}>Permitir cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const linePosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Gradiente oscuro para enfoque */}
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]}
        style={styles.overlay}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Escanear código QR</Text>
      </View>

      {/* Marco elegante */}
      <View style={styles.scanBox}>
        {/* Sombra exterior */}
        <View style={styles.shadowLayer} />

        {/* Contorno naranja */}
        <View style={styles.roundedBorder}>
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: linePosition }] },
            ]}
          />
        </View>
      </View>

      <Text style={styles.instruction}>Apunta el código dentro del marco</Text>

      {scanned && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => setScanned(false)}
        >
          <Ionicons name="scan" size={20} color="#fff" />
          <Text style={styles.rescanText}>Escanear otro</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  headerText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },
  scanBox: {
    alignSelf: "center",
    marginTop: 180,
    width: width * 0.7,
    height: width * 0.7,
    alignItems: "center",
    justifyContent: "center",
  },
  roundedBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderWidth: 3,
    borderColor: ACCENT,
    borderRadius: 28, // Bordes redondeados suaves
    overflow: "hidden",
  },
  shadowLayer: {
    position: "absolute",
    width: "112%",
    height: "112%",
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.3)",
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
  },
  scanLine: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    opacity: 0.95,
  },
  instruction: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
    opacity: 0.85,
  },
  rescanButton: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: ACCENT,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  rescanText: { color: "#FFF", marginLeft: 8, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  btn: {
    backgroundColor: ACCENT,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: { color: "#FFF", fontWeight: "600" },
});
