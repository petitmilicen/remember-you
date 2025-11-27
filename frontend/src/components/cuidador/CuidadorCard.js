import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/RedApoyoStyles";

export default function CuidadorCard({ cuidador, onSelect, compact = false, showButton = false }) {
    if (compact) {
        // Versión compacta para scroll horizontal
        return (
            <View style={styles.cuidadorCardCompact}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{cuidador.avatar}</Text>
                </View>
                <Text style={styles.cuidadorNombre} numberOfLines={1}>
                    {cuidador.nombre}
                </Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFB300" />
                    <Text style={styles.ratingText}>{cuidador.rating}</Text>
                </View>
                <Text style={styles.etaText}>
                    <Ionicons name="location" size={10} color="#607D8B" /> {cuidador.distancia} km
                </Text>
                <Text style={styles.etaText}>⏱️ {cuidador.eta} min</Text>
                {!cuidador.disponible && (
                    <View style={styles.noDisponibleBadge}>
                        <Text style={styles.noDisponibleText}>No disp.</Text>
                    </View>
                )}
            </View>
        );
    }

    // Versión expandida para selección
    return (
        <View style={styles.cuidadorCardExpanded}>
            <View style={styles.cuidadorCardLeft}>
                <View style={styles.avatarCircleLarge}>
                    <Text style={styles.avatarTextLarge}>{cuidador.avatar}</Text>
                </View>
            </View>

            <View style={styles.cuidadorCardCenter}>
                <Text style={styles.cuidadorNombreLarge}>{cuidador.nombre}</Text>
                <View style={styles.ratingRowLarge}>
                    <Ionicons name="star" size={14} color="#FFB300" />
                    <Text style={styles.ratingTextLarge}>{cuidador.rating}</Text>
                    <Text style={styles.experienciaText}>• {cuidador.experiencia}</Text>
                </View>
                <Text style={styles.especialidadText}>
                    <Ionicons name="medical" size={12} color="#42A5F5" /> {cuidador.especialidad}
                </Text>
                <Text style={styles.distanciaText}>
                    📍 {cuidador.distancia} km • ⏱️ {cuidador.eta} min
                </Text>
            </View>

            {showButton && (
                <View style={styles.cuidadorCardRight}>
                    <TouchableOpacity
                        style={styles.seleccionarBtn}
                        onPress={() => onSelect(cuidador)}
                    >
                        <Text style={styles.seleccionarBtnText}>Seleccionar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
