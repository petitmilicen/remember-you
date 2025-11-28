import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CuidadorCard from "./CuidadorCard";
import { styles } from "../../styles/RedApoyoStyles";

const ESTADO_COLORS = {
  "En espera": "#FFA726",
  "Asignada": "#42A5F5",
  "En curso": "#66BB6A",
  "Finalizada": "#9E9E9E",
  "Cancelada": "#EF5350",
};

export default function SolicitudCard({
  s,
  ESTADOS,
  cuidadores,
  onAsignar,
  onCancelar,
  onIniciar,
  onFinalizar,
  onEliminar,
  isAvailableRequest = false,
}) {
  const postulantes = s.postulaciones
    ? cuidadores.filter(c => s.postulaciones.includes(c.id))
    : [];

  return (
    <View
      style={[
        styles.card,
        s.estado === ESTADOS.FINALIZADA && {
          opacity: 0.8,
          backgroundColor: "#E8F5E9",
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{s.motivo}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: ESTADO_COLORS[s.estado] || "#FFCC80" }
          ]}
        >
          <Text style={styles.badgeText}>{s.estado}</Text>
        </View>
      </View>

      <View style={styles.cardDatesRow}>
        <View style={styles.cardDateItem}>
          <Ionicons name="calendar-outline" size={14} color="#607D8B" />
          <Text style={styles.cardText}> Desde: {s.desde}</Text>
        </View>
        <View style={styles.cardDateItem}>
          <Ionicons name="calendar" size={14} color="#607D8B" />
          <Text style={styles.cardText}> Hasta: {s.hasta}</Text>
        </View>
      </View>

      {s.suplente && (
        <View style={styles.suplementRow}>
          <Ionicons name="person-circle" size={16} color="#1976D2" />
          <Text style={styles.suplementText}> Suplente: {s.suplente}</Text>
        </View>
      )}

      {s.fechaInicio && (
        <Text style={styles.cardTextSecondary}>
          ⏱️ Inicio real: {s.fechaInicio}
        </Text>
      )}
      {s.fechaFin && (
        <Text style={styles.cardTextSecondary}>
          ✅ Fin real: {s.fechaFin}
        </Text>
      )}
      {s.nota && (
        <View style={styles.notaContainer}>
          <Ionicons name="document-text-outline" size={14} color="#607D8B" />
          <Text style={styles.cardNote}> {s.nota}</Text>
        </View>
      )}

      {s.estado === ESTADOS.ESPERA && postulantes.length > 0 && (
        <View style={styles.postulacionesContainer}>
          <Text style={styles.postulacionesTitle}>
            👥 {postulantes.length} Postulaciones:
          </Text>
          {postulantes.map((cuidador) => (
            <CuidadorCard
              key={cuidador.id}
              cuidador={cuidador}
              compact={false}
              showButton={true}
              onSelect={() => onAsignar(s.id, cuidador.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.actionsRow}>
        {isAvailableRequest && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#4CAF50", flex: 1 }]}
            onPress={() => onAsignar(s.id, null)}
          >
            <Ionicons name="hand-left" size={16} color="#FFF" />
            <Text style={styles.btnText}>Tomar Solicitud</Text>
          </TouchableOpacity>
        )}

        {!isAvailableRequest && s.estado === ESTADOS.ESPERA && (
          <>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#E57373" }]}
              onPress={() => onCancelar(s.id)}
            >
              <Ionicons name="close-circle" size={16} color="#FFF" />
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}

        {!isAvailableRequest && s.estado === ESTADOS.ASIGNADA && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#1565C0" }]}
            onPress={() => onIniciar(s.id)}
          >
            <Ionicons name="play" size={16} color="#FFF" />
            <Text style={styles.btnText}>Iniciar</Text>
          </TouchableOpacity>
        )}

        {!isAvailableRequest && s.estado === ESTADOS.CURSO && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#2E7D32" }]}
            onPress={() => onFinalizar(s.id)}
          >
            <Ionicons name="stop-circle" size={16} color="#FFF" />
            <Text style={styles.btnText}>Finalizar</Text>
          </TouchableOpacity>
        )}

        {!isAvailableRequest && (s.estado === ESTADOS.FINALIZADA ||
          s.estado === ESTADOS.CANCELADA) && (
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#B0BEC5" }]}
              onPress={() => onEliminar(s.id)}
            >
              <Ionicons name="trash" size={16} color="#FFF" />
              <Text style={styles.btnText}>Eliminar</Text>
            </TouchableOpacity>
          )}
      </View>
    </View>
  );
}
