import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Vibration,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");
const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
const ACCENT = "#FF7043";

export default function HomeScreenCuidador({ navigation }) {
  const [cuidador] = useState({ nombre: "María Pérez", rol: "Cuidadora principal" });
  const [paciente] = useState({ nombre: "Juan García", edad: 74, nivel: "Moderado" });

  const [zonaSegura, setZonaSegura] = useState(null);
  const [ubicacionPaciente, setUbicacionPaciente] = useState(null);
  const [alertaActiva, setAlertaActiva] = useState(false);
  const [distanciaActual, setDistanciaActual] = useState(0);

  const [alertas, setAlertas] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [alertSound, setAlertSound] = useState(null);
  const mapRef = useRef(null);

  // 🔄 Cargar tarjetas
  useEffect(() => {
    const cargarTarjetas = async () => {
      try {
        const stored = await AsyncStorage.getItem("memoryCards");
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          setTarjetas(parsed);
        }
      } catch (error) {
        console.error("Error cargando tarjetas:", error);
      }
    };
    cargarTarjetas();
    const focusListener = navigation.addListener("focus", cargarTarjetas);
    return focusListener;
  }, [navigation]);

  // 🟢 Cargar zona segura
  useEffect(() => {
    const cargarZonaSegura = async () => {
      try {
        const stored = await AsyncStorage.getItem("zonaSegura");
        setZonaSegura(stored ? JSON.parse(stored) : null);
      } catch (error) {
        console.error("Error cargando zona segura:", error);
      }
    };
    cargarZonaSegura();
    const focusListener = navigation.addListener("focus", cargarZonaSegura);
    return focusListener;
  }, [navigation]);

  // 📍 Sincronizar ubicación del paciente
  useEffect(() => {
    const cargarUbicacionPaciente = async () => {
      try {
        const stored = await AsyncStorage.getItem("ubicacionPaciente");
        if (stored) setUbicacionPaciente(JSON.parse(stored));
      } catch (error) {
        console.error("Error cargando ubicación del paciente:", error);
      }
    };
    cargarUbicacionPaciente();
    const interval = setInterval(cargarUbicacionPaciente, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🚨 Detección de alertas
  useEffect(() => {
    if (!zonaSegura || !ubicacionPaciente) return;

    const distancia = Math.hypot(
      (ubicacionPaciente.latitude - zonaSegura.centro.latitude) * 111000,
      (ubicacionPaciente.longitude - zonaSegura.centro.longitude) * 111000
    );
    setDistanciaActual(distancia);

    if (distancia > zonaSegura.radio) {
      if (!alertaActiva) {
        const nueva = {
          id: Date.now().toString(),
          tipo: "Zona Segura",
          mensaje: `${paciente.nombre} ha salido de la zona segura`,
          fecha: new Date().toLocaleTimeString(),
        };
        setAlertas((prev) => [nueva, ...prev]);
        setAlertaActiva(true);
        Vibration.vibrate(900);
        reproducirSonidoAlerta();
      }
    } else if (alertaActiva) {
      const nueva = {
        id: Date.now().toString(),
        tipo: "Zona Segura",
        mensaje: `${paciente.nombre} ha regresado a la zona segura`,
        fecha: new Date().toLocaleTimeString(),
      };
      setAlertas((prev) => [nueva, ...prev]);
      setAlertaActiva(false);
    }
  }, [ubicacionPaciente, zonaSegura]);

  async function reproducirSonidoAlerta() {
    try {
      const { sound } = await Audio.Sound.createAsync(require("../../assets/sounds/alert.mp3"));
      setAlertSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log("Error reproduciendo sonido:", error);
    }
  }

  // ➕ Crear tarjeta
  const agregarTarjeta = async () => {
    if (!nuevoTipo.trim() || !nuevoMensaje.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }
    const nuevaTarjeta = {
      id: Date.now().toString(),
      tipo: nuevoTipo.trim(),
      mensaje: nuevoMensaje.trim(),
      date: new Date().toLocaleDateString(),
      creadoPor: "cuidador",
    };
    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      const prev = stored ? JSON.parse(stored) : [];
      const updated = [nuevaTarjeta, ...prev];
      await AsyncStorage.setItem("memoryCards", JSON.stringify(updated));
      setTarjetas(updated);
    } catch (error) {
      console.error("Error guardando tarjeta:", error);
    }
    setModalVisible(false);
    setNuevoTipo("");
    setNuevoMensaje("");
  };

  // 🗑️ Eliminar tarjeta individual
  const eliminarTarjeta = async (id) => {
    Alert.alert(
      "Eliminar tarjeta",
      "¿Seguro que deseas eliminar esta tarjeta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = tarjetas.filter((t) => t.id !== id);
              setTarjetas(updated);
              await AsyncStorage.setItem("memoryCards", JSON.stringify(updated));
            } catch (error) {
              console.error("Error eliminando tarjeta:", error);
            }
          },
        },
      ]
    );
  };
  
  // 🚪 Cerrar sesión
  const cerrarSesion = async () => {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar tu sesión actual?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
          } catch (error) {
            console.error("Error cerrando sesión:", error);
          }
        },
      },
    ]);
  };

  // 📍 Recentrar mapa
  const recentrarMapa = () => {
    if (!mapRef.current || !ubicacionPaciente) return;
    mapRef.current.animateToRegion(
      {
        ...ubicacionPaciente,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      600
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
          <Text style={styles.headerName}>{cuidador.nombre}</Text>
          <Text style={styles.headerRole}>{cuidador.rol}</Text>
        </View>

        {/* Panel Paciente */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Paciente asignado</Text>
          <Text style={styles.mainText}>{paciente.nombre}</Text>
          <Text style={styles.subText}>Edad: {paciente.edad}</Text>
          <Text style={styles.subText}>Nivel de Alzheimer: {paciente.nivel}</Text>
        </View>

        {/* Panel Zona Segura */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Zona segura</Text>

          {zonaSegura ? (
            <>
              <View style={styles.mapWrap}>
                <MapView
                  ref={mapRef}
                  style={styles.map}
                  initialRegion={{
                    ...(zonaSegura?.centro || { latitude: -33.4569, longitude: -70.6483 }),
                    latitudeDelta: 0.012,
                    longitudeDelta: 0.012,
                  }}
                >
                  <Marker coordinate={zonaSegura.centro} pinColor="green" title="Centro de zona segura" />
                  {ubicacionPaciente && (
                    <Marker
                      coordinate={ubicacionPaciente}
                      pinColor={alertaActiva ? "red" : "blue"}
                      title="Paciente"
                      description={alertaActiva ? "Fuera de la zona 🚨" : "Dentro de la zona ✅"}
                    />
                  )}
                  <Circle
                    center={zonaSegura.centro}
                    radius={zonaSegura.radio}
                    strokeColor={
                      alertaActiva
                        ? "rgba(239,83,80,0.95)"
                        : distanciaActual > zonaSegura.radio * 0.8
                        ? "rgba(255,213,79,0.9)"
                        : "rgba(100,181,246,0.95)"
                    }
                    fillColor={
                      alertaActiva
                        ? "rgba(244,67,54,0.15)"
                        : distanciaActual > zonaSegura.radio * 0.8
                        ? "rgba(255,235,59,0.15)"
                        : "rgba(187,222,251,0.15)"
                    }
                  />
                </MapView>

                <View style={styles.mapOverlay}>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: alertaActiva
                          ? "rgba(239,83,80,0.95)"
                          : distanciaActual > (zonaSegura?.radio || 1) * 0.8
                          ? "rgba(255,213,79,0.95)"
                          : "rgba(100,181,246,0.95)",
                      },
                    ]}
                  >
                    <Ionicons
                      name={alertaActiva ? "alert" : "checkmark-circle"}
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.statusPillText}>
                      {alertaActiva
                        ? "Paciente fuera"
                        : distanciaActual > (zonaSegura?.radio || 1) * 0.8
                        ? "Cerca del límite"
                        : "Dentro de la zona"}
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.centerButton} onPress={recentrarMapa}>
                    <Ionicons name="locate" size={18} color="#FFF" />
                    <Text style={styles.centerButtonText}>Recentrar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.zoneInfoRow}>
                <Text style={styles.zoneInfoText}>
                  🧭 Distancia: <Text style={styles.zoneInfoStrong}>{distanciaActual.toFixed(0)} m</Text>
                </Text>
                <Text style={styles.zoneInfoText}>
                  Límite: <Text style={styles.zoneInfoStrong}>{zonaSegura.radio.toFixed(0)} m</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.editZoneButton}
                onPress={() => navigation.navigate("ZonaSegura")}
              >
                <Ionicons name="create-outline" size={18} color="#FFF" />
                <Text style={styles.editZoneText}>Editar zona segura</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.noZoneContainer}>
              <Text style={styles.noZoneText}>No hay zona segura definida aún.</Text>
              <Text style={styles.noZoneSub}>Defínela desde el módulo Seguridad.</Text>
            </View>
          )}
        </View>

        {/* Panel Alertas */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Alertas recientes</Text>
          {alertas.length === 0 ? (
            <Text style={styles.muted}>Sin alertas activas</Text>
          ) : (
            alertas.map((a) => (
              <View key={a.id} style={styles.alertBox}>
                <Ionicons
                  name={a.tipo === "Emergencia" ? "alert-circle" : "notifications"}
                  size={18}
                  color={a.tipo === "Emergencia" ? "#E57373" : "#81C784"}
                />
                <Text style={styles.alertMessage}>{a.mensaje}</Text>
                <Text style={styles.alertDate}>{a.fecha}</Text>
              </View>
            ))
          )}
        </View>

        {/* Panel Tarjetas */}
        <View style={styles.panel}>
          <View style={styles.rowBetween}>
            <Text style={styles.panelTitle}>Tarjetas compartidas</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle" size={26} color={ACCENT} />
            </TouchableOpacity>
          </View>

          {tarjetas.length === 0 ? (
            <Text style={styles.muted}>No hay tarjetas creadas aún</Text>
          ) : (
            tarjetas.map((t) => {
              const isCuidador = t.creadoPor === "cuidador";
              const fondo = isCuidador ? "#E3F2FD" : "#E8F5E9";
              const borde = isCuidador ? "#64B5F6" : "#81C784";
              return (
                <View
                  key={t.id}
                  style={[styles.cardNote, { backgroundColor: fondo, borderLeftColor: borde }]}
                >
                  <View style={styles.tarjetaHeaderRow}>
                    <Text style={styles.tarjetaAutor}>
                      {isCuidador ? "👨‍⚕️ Cuidador" : "🧠 Paciente"}
                    </Text>
                    <TouchableOpacity onPress={() => eliminarTarjeta(t.id)}>
                      <Ionicons name="trash-outline" size={18} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.tarjetaMensaje}>{t.mensaje}</Text>
                  <Text style={styles.tarjetaTipo}>{t.tipo}</Text>
                  <Text style={styles.tarjetaFecha}>{t.date}</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Menú rápido */}
        <View style={styles.quickMenu}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: "#B3E5FC" }]}
            onPress={() => navigation.navigate("BitacoraCuidador")}
          >
            <MaterialIcons name="menu-book" size={26} color="#0D47A1" />
            <Text style={styles.menuText}>Bitácora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: "#C8E6C9" }]}
            onPress={() => navigation.navigate("ZonaSegura")}
          >
            <Ionicons name="shield-checkmark" size={26} color="#1B5E20" />
            <Text style={styles.menuText}>Seguridad</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: "#FFF9C4" }]}
            onPress={() => navigation.navigate("CitasMedicas")}
          >
            <Ionicons name="calendar" size={26} color="#F57F17" />
            <Text style={styles.menuText}>Citas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: "#E1BEE7" }]}
            onPress={() => navigation.navigate("RedApoyo")}
          >
            <FontAwesome5 name="hands-helping" size={24} color="#6A1B9A" />
            <Text style={styles.menuText}>Red de Apoyo</Text>
          </TouchableOpacity>
        </View>

        {/* Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <FontAwesome5 name="sign-out-alt" size={16} color="#FFF" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Nueva Tarjeta */}
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nueva Tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="Tipo de tarjeta (recordatorio, foto, etc.)"
              value={nuevoTipo}
              onChangeText={setNuevoTipo}
            />
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              placeholder="Mensaje"
              multiline
              value={nuevoMensaje}
              onChangeText={setNuevoMensaje}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: ACCENT }]}
                onPress={agregarTarjeta}
              >
                <Text style={styles.modalBtnText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#BDBDBD" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🧩 Estilos idénticos a los tuyos, sin cambios visuales relevantes
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: { paddingHorizontal: 20, marginBottom: 10 },
  headerName: { fontSize: 22, fontWeight: "700", color: "#212121" },
  headerRole: { fontSize: 14, color: "#757575", marginTop: 2 },
  panel: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  panelTitle: { fontSize: 16, fontWeight: "700", color: "#263238", marginBottom: 6 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  mainText: { fontSize: 15, fontWeight: "600", color: "#37474F" },
  subText: { fontSize: 13, color: "#607D8B", marginTop: 2 },
  mapWrap: { borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#E3F2FD" },
  map: { width: "100%", height: 220 },
  mapOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusPillText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  centerButton: {
    flexDirection: "row",
    backgroundColor: "#0D47A1",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    gap: 6,
  },
  centerButtonText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  zoneInfoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  zoneInfoText: { color: "#455A64", fontSize: 13 },
  zoneInfoStrong: { fontWeight: "700", color: "#263238" },
  noZoneContainer: { alignItems: "center", paddingVertical: 8 },
  noZoneText: { color: "#607D8B", fontStyle: "italic" },
  noZoneSub: { color: "#90A4AE", fontSize: 12, marginTop: 2 },
  muted: { fontStyle: "italic", color: "#9E9E9E" },
  alertBox: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#C0CA33",
  },
  alertMessage: { flex: 1, color: "#37474F" },
  alertDate: { color: "#90A4AE", fontSize: 11 },
  cardNote: {
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    borderLeftWidth: 5,
    backgroundColor: "#E3F2FD",
    borderLeftColor: "#64B5F6",
  },
  tarjetaHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    paddingRight: 4,
  },
  tarjetaAutor: { fontWeight: "700", color: "#37474F" },
  tarjetaMensaje: { color: "#455A64", marginBottom: 4 },
  tarjetaTipo: { fontSize: 12, color: "#607D8B", textAlign: "right" },
  tarjetaFecha: { fontSize: 12, color: "#90A4AE", textAlign: "right" },
  quickMenu: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  menuItem: {
    width: (width - 16 * 2 - 40) / 2,
    marginVertical: 12,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  menuText: { color: "#212121", fontWeight: "700" },
  logoutButton: {
    backgroundColor: ACCENT,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 60,
    marginTop: 8,
    marginBottom: 28,
    paddingVertical: 12,
    borderRadius: 16,
    elevation: 2,
    gap: 8,
  },
  logoutText: { color: "#FFF", fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalBox: { width: "88%", backgroundColor: "#FFF", borderRadius: 18, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#263238", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    color: "#37474F",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  editZoneButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF7043",
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
    gap: 8,
  },
  editZoneText: { 
    color: "#FFF", 
    fontWeight: "700", 
    fontSize: 14 
  },
  tarjetaHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    paddingRight: 4,
  },
});
