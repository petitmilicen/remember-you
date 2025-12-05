import React from "react";
import { View, Text, TouchableOpacity, Animated, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Circle } from "react-native-maps";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useZonaSeguraMap from "../../hooks/useZonaSeguraMap";
import { styles } from "../../styles/ZonaSeguraStyles";

const ACCENT = "#FF7043";

export default function ZonaSeguraScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    centro,
    radio,
    guardado,
    ubicacionPaciente,
    pacienteFuera,
    mensaje,
    colorMensaje,
    fadeAnim,
    regionInicial,
    mapRef,
    seleccionarCentro,
    guardarZona,
    eliminarZona,
    recentrar,
    setRadio,
    historial,
  } = useZonaSeguraMap();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zona Segura</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.legend, { top: insets.top + 55 }]}>
        {[
          { color: "#64B5F6", label: "Zona segura" },
          { color: "#FFB300", label: "Cerca del límite" },
          { color: "#E57373", label: "Fuera de zona" },
        ].map((item, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Mapa */}
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
                pacienteFuera ? "rgba(229,57,53,0.9)" : "rgba(100,181,246,0.9)"
              }
              fillColor={
                pacienteFuera ? "rgba(244,67,54,0.15)" : "rgba(187,222,251,0.2)"
              }
            />
          </>
        )}

        {/* Puntos del historial (breadcrumbs) */}
        {historial && historial.length > 1 && historial.slice(1).map((punto, index) => (
          <Circle
            key={`history-${index}`}
            center={punto}
            radius={3}
            fillColor="rgba(255, 107, 107, 0.6)"
            strokeColor="rgba(229, 57, 53, 0.8)"
            strokeWidth={1}
          />
        ))}

        {ubicacionPaciente && (
          <Marker
            coordinate={ubicacionPaciente}
            pinColor={pacienteFuera ? "red" : "blue"}
            title={pacienteFuera ? "⚠️ Paciente fuera de zona" : "✅ Paciente en zona segura"}
            description={pacienteFuera ? "Fuera de la zona segura" : "Dentro de la zona segura"}
          />
        )}
      </MapView>

      {/* Estado y botón */}
      {
        centro && (
          <>
            <View style={[styles.statusOverlay, { top: insets.top + 100 }]}>
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

            <TouchableOpacity style={styles.recenterBtn} onPress={recentrar}>
              <Ionicons name="locate" size={20} color="#FFF" />
            </TouchableOpacity>
          </>
        )
      }

      {/* Panel inferior */}
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

      {/* Mensaje */}
      {
        mensaje && (
          <Animated.View
            style={[
              styles.mensajeBox,
              { opacity: fadeAnim, backgroundColor: colorMensaje },
            ]}
          >
            <Text style={styles.mensajeTexto}>{mensaje}</Text>
          </Animated.View>
        )
      }
    </View >
  );
}
