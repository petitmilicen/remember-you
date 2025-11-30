import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function EmergencyAlert({ paciente, ubicacionPaciente, onDismiss }) {
    const handleNavigate = () => {
        if (!ubicacionPaciente) return;

        const { latitude, longitude } = ubicacionPaciente;

        // Open Google Maps with navigation
        const url = Platform.select({
            ios: `maps://app?daddr=${latitude},${longitude}`,
            android: `google.navigation:q=${latitude},${longitude}`,
            default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
        });

        Linking.openURL(url).catch(() => {
            // Fallback to web Google Maps
            const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
            Linking.openURL(webUrl);
        });
    };



    return (
        <LinearGradient
            colors={['#E53935', '#C62828']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Alert Header */}
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="warning" size={40} color="#FFF" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.title}>¡ALERTA DE EMERGENCIA!</Text>
                    <Text style={styles.subtitle}>
                        {paciente?.full_name || 'Paciente'} fuera de zona segura
                    </Text>
                </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Ionicons name="location" size={20} color="#FFF" />
                    <Text style={styles.infoText}>
                        Ubicación actualizada en tiempo real
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="time" size={20} color="#FFF" />
                    <Text style={styles.infoText}>
                        Hace unos segundos
                    </Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={handleNavigate}
                >
                    <Ionicons name="navigate" size={24} color="#FFF" />
                    <Text style={styles.buttonText}>Ir al Paciente (Google Maps)</Text>
                </TouchableOpacity>


            </View>

            {/* Note */}
            <Text style={styles.note}>
                Esta alerta permanecerá visible hasta que el paciente regrese a la zona segura
            </Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
        elevation: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 50,
        padding: 12,
        marginRight: 16,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    infoSection: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    infoText: {
        color: '#FFF',
        marginLeft: 12,
        fontSize: 13,
        fontWeight: '500',
    },
    actionsContainer: {
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginVertical: 6,
    },
    primaryButton: {
        backgroundColor: '#FFF',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        flex: 1,
        marginHorizontal: 4,
    },
    secondaryActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonText: {
        color: '#C62828',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    smallButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
    note: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 11,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 8,
    },
});
