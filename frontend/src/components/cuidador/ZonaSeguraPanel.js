import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/HomeCuidadorStyles.js";

export default function ZonaSeguraPanel({
  zonaSegura,
  ubicacionPaciente,
  alertaActiva,
  distanciaActual,
  salidaSegura,
  toggleSalidaSegura,
  navigation,
}) {
  const mapRef = useRef(null);

  const recentrarMapa = () => {
    if (!mapRef.current || !ubicacionPaciente) return;
    mapRef.current.animateToRegion(
      { ...ubicacionPaciente, latitudeDelta: 0.008, longitudeDelta: 0.008 },
      600
    );
  };

  return (
    <View style={styles.panel}>
      <View style={styles.rowBetween}>
        <Text style={styles.panelTitle}>Zona segura</Text>
        <View style={styles.safeExitRow}>
          <Text style={styles.safeExitText}>Salida segura</Text>
          <Switch
            value={salidaSegura}
            onValueChange={(value) => {
              if (!zonaSegura) {
                Alert.alert(
                  "Zona segura no definida",
                  "Debes crear una zona segura antes de activar la salida segura."
                );
                return;
              }
              toggleSalidaSegura(value);
            }}
            disabled={!zonaSegura}
            trackColor={{ false: "#BDBDBD", true: "#81C784" }}
            thumbColor={salidaSegura ? "#2E7D32" : "#FAFAFA"}
          />
        </View>
      </View>

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
                  description={
                    salidaSegura
                      ? "Salida segura activa"
                      : alertaActiva
                      ? "Fuera de la zona 🚨"
                      : "Dentro de la zona ✅"
                  }
                />
              )}
              <Circle
                center={zonaSegura.centro}
                radius={zonaSegura.radio}
                strokeColor={
                  salidaSegura
                    ? "rgba(76,175,80,0.8)"
                    : alertaActiva
                    ? "rgba(239,83,80,0.95)"
                    : distanciaActual > zonaSegura.radio * 0.8
                    ? "rgba(255,213,79,0.9)"
                    : "rgba(100,181,246,0.95)"
                }
                fillColor={
                  salidaSegura
                    ? "rgba(200,230,201,0.3)"
                    : alertaActiva
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
                    backgroundColor: salidaSegura
                      ? "rgba(76,175,80,0.9)"
                      : alertaActiva
                      ? "rgba(239,83,80,0.95)"
                      : distanciaActual > (zonaSegura?.radio || 1) * 0.8
                      ? "rgba(255,213,79,0.95)"
                      : "rgba(100,181,246,0.95)",
                  },
                ]}
              >
                <Ionicons
                  name={
                    salidaSegura
                      ? "walk"
                      : alertaActiva
                      ? "alert"
                      : "checkmark-circle"
                  }
                  size={16}
                  color="#fff"
                />
                <Text style={styles.statusPillText}>
                  {salidaSegura
                    ? "Salida segura activa"
                    : alertaActiva
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
              🧭 Distancia:{" "}
              <Text style={styles.zoneInfoStrong}>{distanciaActual.toFixed(0)} m</Text>
            </Text>
            <Text style={styles.zoneInfoText}>
              Límite:{" "}
              <Text style={styles.zoneInfoStrong}>
                {zonaSegura.radio.toFixed(0)} m
              </Text>
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
  );
}
