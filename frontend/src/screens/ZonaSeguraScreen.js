import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
const ACCENT = "#FF7043";

export default function ZonaSeguraScreen({ navigation }) {
  const [centro, setCentro] = useState(null);
  const [radio, setRadio] = useState(200);
  const [guardado, setGuardado] = useState(false);
  const [ubicacionPaciente, setUbicacionPaciente] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [colorMensaje, setColorMensaje] = useState("#2E7D32");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  const regionInicial = {
    latitude: -33.45694,
    longitude: -70.64827,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    const cargarZona = async () => {
      try {
        const stored = await AsyncStorage.getItem("zonaSegura");
        if (stored) {
          const data = JSON.parse(stored);
          setCentro(data.centro);
          setRadio(data.radio);
          setGuardado(true);
        }
      } catch (error) {
        console.error("Error cargando zona segura:", error);
      }
    };
    cargarZona();
  }, []);

  const seleccionarCentro = (e) => {
    const coordenadas = e.nativeEvent.coordinate;
    setCentro(coordenadas);
    setGuardado(false);
  };

  const guardarZona = async () => {
    if (!centro) return;
    const nuevaZona = { centro, radio };
    try {
      await AsyncStorage.setItem("zonaSegura", JSON.stringify(nuevaZona));
      setGuardado(true);
      mostrarMensaje("✅ Zona guardada correctamente", "#2E7D32");
    } catch (error) {
      console.error("Error guardando zona segura:", error);
    }
  };

  const eliminarZona = async () => {
    try {
      await AsyncStorage.removeItem("zonaSegura");
      setCentro(null);
      setGuardado(false);
      mostrarMensaje("🗑️ Zona eliminada", "#C62828");
    } catch (error) {
      console.error("Error eliminando zona:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (centro) {
      const simularMovimiento = async () => {
        const nuevaPos = {
          latitude: centro.latitude + (Math.random() - 0.5) * 0.002,
          longitude: centro.longitude + (Math.random() - 0.5) * 0.002,
        };
        setUbicacionPaciente(nuevaPos);
        try {
          await AsyncStorage.setItem("ubicacionPaciente", JSON.stringify(nuevaPos));
        } catch (error) {
          console.error("Error guardando ubicación:", error);
        }
      };
      simularMovimiento();
      interval = setInterval(simularMovimiento, 5000);
    }
    return () => clearInterval(interval);
  }, [centro]);

  const pacienteFuera =
    centro && ubicacionPaciente
      ? Math.hypot(
          (ubicacionPaciente.latitude - centro.latitude) * 111000,
          (ubicacionPaciente.longitude - centro.longitude) * 111000
        ) > radio
      : false;

  const recentrar = () => {
    if (!centro || !mapRef.current) return;
    mapRef.current.animateToRegion(
      { ...centro, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      800
    );
  };

  const mostrarMensaje = (texto, color) => {
    setMensaje(texto);
    setColorMensaje(color);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setMensaje(null));
      }, 1600);
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP_PAD + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zona Segura</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#64B5F6" }]} />
          <Text style={styles.legendText}>Zona segura</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FFB300" }]} />
          <Text style={styles.legendText}>Cerca del límite</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#E57373" }]} />
          <Text style={styles.legendText}>Fuera de zona</Text>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={regionInicial}
        onPress={seleccionarCentro}
      >
        {centro && (
          <>
            <Marker coordinate={centro} title="Centro de zona segura" pinColor="green" />
            <Circle
              center={centro}
              radius={radio}
              strokeColor={
                pacienteFuera
                  ? "rgba(229,57,53,0.9)"
                  : "rgba(100,181,246,0.9)"
              }
              fillColor={
                pacienteFuera
                  ? "rgba(244,67,54,0.15)"
                  : "rgba(187,222,251,0.2)"
              }
            />
          </>
        )}
        {ubicacionPaciente && (
          <Marker
            coordinate={ubicacionPaciente}
            title="Paciente"
            pinColor={pacienteFuera ? "red" : "blue"}
            description={
              pacienteFuera ? "Fuera de zona segura 🚨" : "Dentro de zona segura ✅"
            }
          />
        )}
      </MapView>

      {centro && (
        <View style={styles.statusOverlay}>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: pacienteFuera
                  ? "rgba(229,57,53,0.95)"
                  : "rgba(100,181,246,0.95)",
              },
            ]}
          >
            <Ionicons
              name={pacienteFuera ? "alert-circle" : "checkmark-circle"}
              size={16}
              color="#FFF"
            />
            <Text style={styles.statusText}>
              {pacienteFuera ? "Paciente fuera" : "Paciente dentro"}
            </Text>
          </View>
        </View>
      )}

      {centro && (
        <TouchableOpacity style={styles.recenterBtn} onPress={recentrar}>
          <Ionicons name="locate" size={20} color="#FFF" />
        </TouchableOpacity>
      )}

      <View style={styles.bottomPanel}>
        {centro ? (
          <>
            <Text style={styles.label}>Radio: {radio.toFixed(0)} m</Text>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={100}
              step={10}
              value={radio}
              onValueChange={setRadio}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#CFD8DC"
              thumbTintColor={ACCENT}
            />

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#2196F3" }]}
                onPress={guardarZona}
              >
                <Ionicons name="save" size={18} color="#FFF" />
                <Text style={styles.actionText}>
                  {guardado ? "Actualizar" : "Guardar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#E53935" }]}
                onPress={eliminarZona}
              >
                <Ionicons name="trash" size={18} color="#FFF" />
                <Text style={styles.actionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.tip}>👆 Toca el mapa para definir el centro.</Text>
        )}
      </View>

      {mensaje && (
        <Animated.View
          style={[
            styles.mensajeBox,
            { opacity: fadeAnim, backgroundColor: colorMensaje },
          ]}
        >
          <Text style={styles.mensajeTexto}>{mensaje}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
  },

  legend: {
    position: "absolute",
    top: TOP_PAD + 55,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    flexDirection: "row",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 4,
    gap: 14,
    zIndex: 20,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: { fontSize: 11, color: "#37474F", fontWeight: "600" },

  map: {
    flex: 1,
  },

  statusOverlay: {
    position: "absolute",
    top: TOP_PAD + 100,
    alignSelf: "center",
    zIndex: 20,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 4,
  },
  statusText: { color: "#FFF", fontWeight: "700", fontSize: 12 },

  recenterBtn: {
    position: "absolute",
    right: 20,
    bottom: 140,
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },

  bottomPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  label: {
    textAlign: "center",
    fontWeight: "600",
    color: "#37474F",
    marginBottom: 10,
  },
  slider: { width: "100%", height: 40 },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  tip: {
    textAlign: "center",
    color: "#757575",
    fontStyle: "italic",
  },
  mensajeBox: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 8,
  },
  mensajeTexto: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
   recenterBtn: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === "android" ? 180 : 160,
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },

  bottomPanel: {
    position: "absolute",
    bottom: 0, 
    width: "100%",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "android" ? 40 : 30, 
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
});
