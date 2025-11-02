import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/RedApoyoStyles";

export default function SolicitudCard({
  s,
  ESTADOS,
  onAsignar,
  onCancelar,
  onIniciar,
  onFinalizar,
  onEliminar,
}) {
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
        <Text style={[styles.badge, { backgroundColor: "#FFCC80" }]}>
          {s.estado}
        </Text>
      </View>

      <Text style={styles.cardText}>Desde: {s.desde}</Text>
      <Text style={styles.cardText}>Hasta: {s.hasta}</Text>
      {s.suplente && <Text style={styles.cardText}>Suplente: {s.suplente}</Text>}
      {s.fechaInicio && (
        <Text style={styles.cardText}>Inicio real: {s.fechaInicio}</Text>
      )}
      {s.fechaFin && <Text style={styles.cardText}>Fin real: {s.fechaFin}</Text>}
      {s.nota && <Text style={styles.cardNote}>Nota: {s.nota}</Text>}

      <View style={styles.actionsRow}>
        {s.estado === ESTADOS.ESPERA && (
          <>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#64B5F6" }]}
              onPress={() => onAsignar(s.id)}
            >
              <Ionicons name="person-add" size={16} color="#FFF" />
              <Text style={styles.btnText}>Asignar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#E57373" }]}
              onPress={() => onCancelar(s.id)}
            >
              <Ionicons name="close-circle" size={16} color="#FFF" />
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}

        {s.estado === ESTADOS.ASIGNADA && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#1565C0" }]}
            onPress={() => onIniciar(s.id)}
          >
            <Ionicons name="play" size={16} color="#FFF" />
            <Text style={styles.btnText}>Iniciar</Text>
          </TouchableOpacity>
        )}

        {s.estado === ESTADOS.CURSO && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#2E7D32" }]}
            onPress={() => onFinalizar(s.id)}
          >
            <Ionicons name="stop-circle" size={16} color="#FFF" />
            <Text style={styles.btnText}>Finalizar</Text>
          </TouchableOpacity>
        )}

        {(s.estado === ESTADOS.FINALIZADA ||
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
