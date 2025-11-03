import React from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useLectorQR from "../../hooks/useLectorQR";
import { styles } from "../../styles/LectorQRStyles";

const ACCENT = "#FF7043";

export default function LectorQRScreen({ navigation }) {
  const {
    permission,
    requestPermission,
    scanned,
    setScanned,
    handleBarCodeScanned,
    linePosition,
  } = useLectorQR(navigation);

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

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]}
        style={styles.overlay}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Escanear código QR</Text>
      </View>

      <View style={styles.scanBox}>
        <View style={styles.shadowLayer} />
        <View style={styles.roundedBorder}>
          <Animated.View
            style={[styles.scanLine, { transform: [{ translateY: linePosition }] }]}
          />
        </View>
      </View>

      <Text style={styles.instruction}>Apunta el código dentro del marco</Text>

      {scanned && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => setScanned(false)}
        >
          <Ionicons name="scan" size={20} color="#FFF" />
          <Text style={styles.rescanText}>Escanear otro</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
