import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import useRedApoyo from "../../hooks/useRedApoyo";
import SolicitudCard from "../../components/cuidador/SolicitudCard";
import ModalNuevaSolicitud from "../../components/cuidador/ModalNuevaSolicitud";
import { styles } from "../../styles/RedApoyoStyles";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
const ACCENT = "#FF7043";

export default function RedApoyoScreen() {
  const {
    solicitudes,
    modalVisible,
    setModalVisible,
    motivo,
    setMotivo,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    nota,
    setNota,
    pacienteUbicacion,
    cuidadores,
    crearSolicitud,
    asignarCercano,
    iniciarApoyo,
    finalizarApoyo,
    cancelarApoyo,
    eliminarApoyo,
    filtroActivo,
    ESTADOS,
  } = useRedApoyo();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
        <Text style={styles.headerTitle}>Red de Apoyo</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={28} color={ACCENT} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Solicitudes activas: <Text style={styles.summaryStrong}>{filtroActivo.length}</Text>
        </Text>
        <Text style={styles.summaryText}>
          Cuidadores cercanos: <Text style={styles.summaryStrong}>{cuidadores.length}</Text>
        </Text>
      </View>

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

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Solicitudes de apoyo</Text>
        {solicitudes.length === 0 ? (
          <Text style={styles.muted}>No hay solicitudes aún.</Text>
        ) : (
          solicitudes.map((s) => (
            <SolicitudCard
              key={s.id}
              s={s}
              ESTADOS={ESTADOS}
              onAsignar={asignarCercano}
              onCancelar={cancelarApoyo}
              onIniciar={iniciarApoyo}
              onFinalizar={finalizarApoyo}
              onEliminar={eliminarApoyo}
            />
          ))
        )}
      </ScrollView>

      <ModalNuevaSolicitud
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        motivo={motivo}
        setMotivo={setMotivo}
        fechaDesde={fechaDesde}
        setFechaDesde={setFechaDesde}
        fechaHasta={fechaHasta}
        setFechaHasta={setFechaHasta}
        nota={nota}
        setNota={setNota}
        onCreate={crearSolicitud}
      />
    </View>
  );
}
