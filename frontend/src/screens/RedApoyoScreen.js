import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
const ACCENT = "#FF7043";

export default function RedApoyoScreen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [nota, setNota] = useState("");
  const [pacienteUbicacion, setPacienteUbicacion] = useState({
    latitude: -33.45694,
    longitude: -70.64827,
  });
  const [cuidadores, setCuidadores] = useState([]);

  const ESTADOS = {
    ESPERA: "En espera",
    ASIGNADA: "Asignada",
    CURSO: "En curso",
    FINALIZADA: "Finalizada",
    CANCELADA: "Cancelada",
  };

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("solicitudesApoyo");
      if (stored) setSolicitudes(JSON.parse(stored));
      generarCuidadoresCercanos();
    })();
  }, []);

  const generarCuidadoresCercanos = () => {
    const randomAround = (v) => v + (Math.random() - 0.5) * 0.008;
    const base = pacienteUbicacion;
    const simulados = [
      { nombre: "Ana Torres", rating: 4.8 },
      { nombre: "Pedro Silva", rating: 4.7 },
      { nombre: "Laura Díaz", rating: 4.9 },
      { nombre: "José López", rating: 4.6 },
    ].map((c) => {
      const lat = randomAround(base.latitude);
      const lon = randomAround(base.longitude);
      const distKm = Math.hypot((lat - base.latitude) * 111, (lon - base.longitude) * 111);
      const eta = Math.max(3, Math.round(distKm * 5 + Math.random() * 4));
      return { ...c, distancia: distKm.toFixed(1), eta, coord: { latitude: lat, longitude: lon } };
    });
    setCuidadores(simulados);
  };

  const guardar = async (data) => {
    setSolicitudes(data);
    await AsyncStorage.setItem("solicitudesApoyo", JSON.stringify(data));
  };

  const crearSolicitud = () => {
    if (!motivo.trim() || !fechaDesde.trim() || !fechaHasta.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa motivo, fecha de inicio y fin.");
      return;
    }

    const nueva = {
      id: Date.now().toString(),
      motivo,
      desde: fechaDesde,
      hasta: fechaHasta,
      nota,
      estado: ESTADOS.ESPERA,
      suplente: null,
      fechaInicio: null,
      fechaFin: null,
    };

    const actualizadas = [nueva, ...solicitudes];
    guardar(actualizadas);
    setModalVisible(false);
    setMotivo("");
    setNota("");
    setFechaDesde("");
    setFechaHasta("");
  };

  const asignarCercano = (id) => {
    const mejor = cuidadores.sort((a, b) => a.eta - b.eta)[0];
    const actualizadas = solicitudes.map((s) =>
      s.id === id ? { ...s, estado: ESTADOS.ASIGNADA, suplente: mejor.nombre } : s
    );
    guardar(actualizadas);
    Alert.alert("Apoyo asignado", `${mejor.nombre} cubrirá este turno.`);
  };

  const iniciarApoyo = (id) => {
    const actualizadas = solicitudes.map((s) =>
      s.id === id
        ? { ...s, estado: ESTADOS.CURSO, fechaInicio: new Date().toLocaleString() }
        : s
    );
    guardar(actualizadas);
  };

  const finalizarApoyo = async (id) => {
    const actualizadas = solicitudes.map((s) =>
      s.id === id
        ? { ...s, estado: ESTADOS.FINALIZADA, fechaFin: new Date().toLocaleString() }
        : s
    );
    guardar(actualizadas);

    const finalizada = actualizadas.find((s) => s.id === id);
    const registro = {
      id: Date.now().toString(),
      tipo: "Apoyo finalizado",
      fecha: new Date().toLocaleString(),
      descripcion: `El cuidador suplente ${finalizada.suplente} completó el apoyo (${finalizada.motivo}).`,
    };
    const bitacora = (await AsyncStorage.getItem("bitacoraEntries")) || "[]";
    await AsyncStorage.setItem(
      "bitacoraEntries",
      JSON.stringify([registro, ...JSON.parse(bitacora)])
    );
  };

  const cancelarApoyo = (id) => {
    const actualizadas = solicitudes.map((s) =>
      s.id === id ? { ...s, estado: ESTADOS.CANCELADA } : s
    );
    guardar(actualizadas);
  };

  const eliminarApoyo = (id) => {
    const actualizadas = solicitudes.filter((s) => s.id !== id);
    guardar(actualizadas);
  };

  const filtroActivo = useMemo(() => {
    return solicitudes.filter((s) => s.estado !== ESTADOS.FINALIZADA);
  }, [solicitudes]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
        <Text style={styles.headerTitle}>Red de Apoyo</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={28} color={ACCENT} />
        </TouchableOpacity>
      </View>

      {/* Resumen */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Solicitudes activas: <Text style={styles.summaryStrong}>{filtroActivo.length}</Text>
        </Text>
        <Text style={styles.summaryText}>
          Cuidadores cercanos: <Text style={styles.summaryStrong}>{cuidadores.length}</Text>
        </Text>
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: pacienteUbicacion.latitude,
            longitude: pacienteUbicacion.longitude,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          }}
        >
          <Marker coordinate={pacienteUbicacion} pinColor="#1976D2" title="Paciente" />
          {cuidadores.map((c, i) => (
            <Marker
              key={i}
              coordinate={c.coord}
              pinColor="#43A047"
              title={c.nombre}
              description={`★${c.rating} - ${c.eta} min`}
            />
          ))}
        </MapView>
        <Text style={styles.mapLabel}>Ubicación del paciente y cuidadores disponibles</Text>
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Solicitudes de apoyo</Text>
        {solicitudes.length === 0 ? (
          <Text style={styles.muted}>No hay solicitudes aún.</Text>
        ) : (
          solicitudes.map((s) => (
            <View
              key={s.id}
              style={[
                styles.card,
                s.estado === ESTADOS.FINALIZADA && { opacity: 0.8, backgroundColor: "#E8F5E9" },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{s.motivo}</Text>
                <Text style={[styles.badge, { backgroundColor: "#FFCC80" }]}>{s.estado}</Text>
              </View>
              <Text style={styles.cardText}>Desde: {s.desde}</Text>
              <Text style={styles.cardText}>Hasta: {s.hasta}</Text>
              {s.suplente && <Text style={styles.cardText}>Suplente: {s.suplente}</Text>}
              {s.fechaInicio && <Text style={styles.cardText}>Inicio real: {s.fechaInicio}</Text>}
              {s.fechaFin && <Text style={styles.cardText}>Fin real: {s.fechaFin}</Text>}
              {s.nota && <Text style={styles.cardNote}>Nota: {s.nota}</Text>}

              <View style={styles.actionsRow}>
                {s.estado === ESTADOS.ESPERA && (
                  <>
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: "#64B5F6" }]}
                      onPress={() => asignarCercano(s.id)}
                    >
                      <Ionicons name="person-add" size={16} color="#FFF" />
                      <Text style={styles.btnText}>Asignar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: "#E57373" }]}
                      onPress={() => cancelarApoyo(s.id)}
                    >
                      <Ionicons name="close-circle" size={16} color="#FFF" />
                      <Text style={styles.btnText}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                )}
                {s.estado === ESTADOS.ASIGNADA && (
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#1565C0" }]}
                    onPress={() => iniciarApoyo(s.id)}
                  >
                    <Ionicons name="play" size={16} color="#FFF" />
                    <Text style={styles.btnText}>Iniciar</Text>
                  </TouchableOpacity>
                )}
                {s.estado === ESTADOS.CURSO && (
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#2E7D32" }]}
                    onPress={() => finalizarApoyo(s.id)}
                  >
                    <Ionicons name="stop-circle" size={16} color="#FFF" />
                    <Text style={styles.btnText}>Finalizar</Text>
                  </TouchableOpacity>
                )}
                {(s.estado === ESTADOS.FINALIZADA || s.estado === ESTADOS.CANCELADA) && (
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#B0BEC5" }]}
                    onPress={() => eliminarApoyo(s.id)}
                  >
                    <Ionicons name="trash" size={16} color="#FFF" />
                    <Text style={styles.btnText}>Eliminar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal Crear */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nueva solicitud</Text>
            <TextInput
              style={styles.input}
              placeholder="Motivo del apoyo"
              value={motivo}
              onChangeText={setMotivo}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha y hora de inicio (ej: 14/10/2025 09:00)"
              value={fechaDesde}
              onChangeText={setFechaDesde}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha y hora de fin (ej: 14/10/2025 15:00)"
              value={fechaHasta}
              onChangeText={setFechaHasta}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Nota para el suplente (opcional)"
              multiline
              value={nota}
              onChangeText={setNota}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: ACCENT }]}
                onPress={crearSolicitud}
              >
                <Text style={styles.modalBtnText}>Crear</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#212121" },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    elevation: 2,
  },
  summaryText: { color: "#455A64", fontWeight: "600" },
  summaryStrong: { color: "#212121", fontWeight: "700" },
  mapContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFF",
    elevation: 3,
  },
  map: { height: 180 },
  mapLabel: {
    textAlign: "center",
    backgroundColor: "#FFF",
    fontSize: 12,
    color: "#607D8B",
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#263238",
    marginLeft: 18,
    marginTop: 14,
  },
  muted: {
    textAlign: "center",
    color: "#9E9E9E",
    marginTop: 10,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontWeight: "700", fontSize: 15, color: "#212121" },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: "#212121",
    fontWeight: "700",
    fontSize: 12,
  },
  cardText: { color: "#455A64", fontSize: 13, marginTop: 2 },
  cardNote: { fontStyle: "italic", color: "#607D8B", marginTop: 6 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalBox: { backgroundColor: "#FFF", borderRadius: 18, padding: 18, width: "88%" },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#263238", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: { color: "#FFF", fontWeight: "700" },
});
