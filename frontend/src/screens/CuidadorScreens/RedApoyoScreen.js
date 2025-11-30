import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useRedApoyo from "../../hooks/useRedApoyo";
import SolicitudCard from "../../components/cuidador/SolicitudCard";
import CuidadorCard from "../../components/cuidador/CuidadorCard";
import ModalNuevaSolicitud from "../../components/cuidador/ModalNuevaSolicitud";
import { styles } from "../../styles/RedApoyoStyles";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
const ACCENT = "#FF7043";

export default function RedApoyoScreen({ navigation }) {
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
    cuidadores,
    crearSolicitud,
    asignarCuidador,
    iniciarApoyo,
    finalizarApoyo,
    cancelarApoyo,
    eliminarApoyo,
    filtroActivo,
    ESTADOS,
    tienePacienteAsignado,
    solicitudesDisponibles,
  } = useRedApoyo();

  const cuidadoresDisponibles = cuidadores.filter(c => c.disponible);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Red de Apoyo</Text>
        {tienePacienteAsignado && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={28} color={ACCENT} />
          </TouchableOpacity>
        )}
        {!tienePacienteAsignado && <View style={{ width: 28 }} />}
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Solicitudes activas</Text>
          <Text style={styles.summaryValue}>{filtroActivo.length}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Cuidadores en red</Text>
          <Text style={styles.summaryValue}>{cuidadores.length}</Text>
        </View>
      </View>

      <View style={styles.cuidadoresSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="people" size={18} color="#1976D2" />
          <Text style={styles.sectionTitle}>Cuidadores Disponibles</Text>
          <View style={styles.disponibleBadge}>
            <Text style={styles.disponibleBadgeText}>{cuidadoresDisponibles.length}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cuidadoresScroll}
        >
          {cuidadores.map((c) => (
            <CuidadorCard key={c.id} cuidador={c} compact={true} />
          ))}
        </ScrollView>
      </View>

      {!tienePacienteAsignado && (
        <View style={styles.cuidadoresSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="hand-left" size={18} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Solicitudes Disponibles</Text>
            <View style={[styles.disponibleBadge, { backgroundColor: "#4CAF50" }]}>
              <Text style={styles.disponibleBadgeText}>{solicitudesDisponibles.length}</Text>
            </View>
          </View>

          {solicitudesDisponibles.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#757575", marginTop: 10, fontStyle: "italic" }}>
              No hay solicitudes disponibles para tomar.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cuidadoresScroll}
            >
              {solicitudesDisponibles.map((s) => (
                <SolicitudCard
                  key={s.id}
                  s={s}
                  ESTADOS={ESTADOS}
                  cuidadores={cuidadores}
                  onAsignar={asignarCuidador}
                  onCancelar={cancelarApoyo}
                  onIniciar={iniciarApoyo}
                  onFinalizar={finalizarApoyo}
                  onEliminar={eliminarApoyo}
                  isAvailableRequest={true}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.sectionHeaderSolicitudes}>
          <Ionicons name="document-text" size={18} color="#FF7043" />
          <Text style={styles.sectionTitle}>Mis Solicitudes</Text>
        </View>
        {solicitudes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#BDBDBD" />
            <Text style={styles.emptyStateText}>No hay solicitudes aún</Text>
            <Text style={styles.emptyStateSubtext}>
              Presiona el botón + para crear una nueva solicitud de apoyo
            </Text>
          </View>
        ) : (
          solicitudes.map((s) => (
            <SolicitudCard
              key={s.id}
              s={s}
              ESTADOS={ESTADOS}
              cuidadores={cuidadores}
              onAsignar={asignarCuidador}
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
