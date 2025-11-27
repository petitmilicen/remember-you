import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Platform,
    StatusBar,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, uploadProfilePicture, deleteProfilePicture, deleteAccount } from "../../api/userService";
import { styles } from "../../styles/PerfilCuidadorStyles";
import { ACCENT } from "../../utils/constants";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function PerfilCuidadorScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const user = await getUserProfile();
            setUserData(user);
        } catch (error) {
            console.error("Error al cargar perfil:", error);
            Alert.alert("Error", "No se pudo cargar la información del perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePhoto = async () => {
        Alert.alert(
            "Cambiar Foto de Perfil",
            "Elige una opción",
            [
                {
                    text: "Tomar Foto",
                    onPress: () => pickImage("camera"),
                },
                {
                    text: "Elegir de Galería",
                    onPress: () => pickImage("library"),
                },
                {
                    text: "Eliminar Foto",
                    style: "destructive",
                    onPress: handleDeletePhoto,
                },
                {
                    text: "Cancelar",
                    style: "cancel",
                },
            ]
        );
    };

    const pickImage = async (source) => {
        try {
            let result;

            if (source === "camera") {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permiso requerido", "Se necesita permiso para usar la cámara");
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permiso requerido", "Se necesita permiso para acceder a la galería");
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets[0]) {
                await uploadPhoto(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error al seleccionar imagen:", error);
            Alert.alert("Error", "No se pudo seleccionar la imagen");
        }
    };

    const uploadPhoto = async (imageUri) => {
        try {
            setUploading(true);
            await uploadProfilePicture(imageUri);
            await fetchUserData();
            Alert.alert("Éxito", "Foto actualizada correctamente");
        } catch (error) {
            console.error("Error al subir foto:", error);
            Alert.alert("Error", "No se pudo actualizar la foto");
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async () => {
        try {
            setUploading(true);
            await deleteProfilePicture();
            await fetchUserData();
            Alert.alert("Éxito", "Foto eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar foto:", error);
            Alert.alert("Error", "No se pudo eliminar la foto");
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que deseas cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar Sesión",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
                        } catch (error) {
                            console.error("Error al cerrar sesión:", error);
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "⚠️ Eliminar Cuenta",
            "Esta acción eliminará permanentemente tu cuenta y todos tus datos. Esta acción NO se puede deshacer.\n\n¿Estás seguro?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        // Segunda confirmación
                        Alert.alert(
                            "⚠️ Confirmación Final",
                            "¿Realmente deseas eliminar tu cuenta de forma permanente?",
                            [
                                { text: "Cancelar", style: "cancel" },
                                {
                                    text: "Sí, eliminar mi cuenta",
                                    style: "destructive",
                                    onPress: async () => {
                                        try {
                                            setUploading(true);
                                            await deleteAccount();
                                            await AsyncStorage.clear();
                                            Alert.alert(
                                                "Cuenta Eliminada",
                                                "Tu cuenta ha sido eliminada exitosamente.",
                                                [
                                                    {
                                                        text: "OK",
                                                        onPress: () => navigation.reset({ index: 0, routes: [{ name: "Welcome" }] })
                                                    }
                                                ]
                                            );
                                        } catch (error) {
                                            console.error("Error al eliminar cuenta:", error);
                                            Alert.alert("Error", "No se pudo eliminar la cuenta");
                                        } finally {
                                            setUploading(false);
                                        }
                                    },
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const options = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("es-ES", options);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={ACCENT} />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: TOP_PAD + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={20} color="#212121" />
                    <Text style={styles.backText}>Volver</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* ID Card */}
                <View style={styles.idCardContainer}>
                    <LinearGradient
                        colors={['#1976D2', '#1565C0', '#0D47A1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.idCard}
                    >
                        {/* Hologram Effect */}
                        <View style={styles.hologram}>
                            <FontAwesome5 name="shield-alt" size={20} color="rgba(255,255,255,0.3)" />
                        </View>

                        {/* Logo/Brand */}
                        <View style={styles.cardBrand}>
                            <FontAwesome5 name="heart" size={16} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.brandText}>REMEMBER YOU</Text>
                        </View>

                        {/* Main Content */}
                        <View style={styles.cardContent}>
                            {/* Photo Section */}
                            <View style={styles.photoSection}>
                                <View style={styles.photoFrame}>
                                    {userData?.profile_picture ? (
                                        <Image
                                            source={{ uri: userData.profile_picture }}
                                            style={styles.cardPhoto}
                                        />
                                    ) : (
                                        <View style={styles.cardPhotoPlaceholder}>
                                            <FontAwesome5 name="user" size={40} color="rgba(255,255,255,0.7)" />
                                        </View>
                                    )}
                                    {uploading && (
                                        <View style={styles.uploadingOverlay}>
                                            <ActivityIndicator size="small" color="#FFF" />
                                        </View>
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={styles.editPhotoButton}
                                    onPress={handleChangePhoto}
                                    disabled={uploading}
                                >
                                    <FontAwesome5 name="camera" size={10} color="#1976D2" />
                                </TouchableOpacity>
                            </View>

                            {/* Info Section */}
                            <View style={styles.infoSection}>
                                <Text style={styles.cardName}>{userData?.full_name?.toUpperCase() || "USUARIO"}</Text>
                                <Text style={styles.cardRole}>CUIDADOR PROFESIONAL</Text>

                                <View style={styles.cardDetails}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>ID</Text>
                                        <Text style={styles.detailValue}>#{userData?.id || "---"}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>USUARIO</Text>
                                        <Text style={styles.detailValue}>{userData?.username || "N/A"}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>DESDE</Text>
                                        <Text style={styles.detailValue}>
                                            {userData?.created_at ? new Date(userData.created_at).getFullYear() : "2025"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Additional Info Card */}
                <View style={styles.additionalInfo}>
                    <Text style={styles.sectionTitle}>Información de Contacto</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <FontAwesome5 name="envelope" size={14} color="#1976D2" />
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{userData?.email || "No disponible"}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoItem}>
                            <FontAwesome5 name="phone" size={14} color="#1976D2" />
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Teléfono</Text>
                                <Text style={styles.infoValue}>{userData?.phone_number || "No disponible"}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoItem}>
                            <FontAwesome5 name="calendar" size={14} color="#1976D2" />
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Miembro desde</Text>
                                <Text style={styles.infoValue}>{formatDate(userData?.created_at)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <FontAwesome5 name="sign-out-alt" size={16} color="#FFF" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

                {/* Delete Account Button */}
                <TouchableOpacity
                    style={styles.deleteAccountButton}
                    onPress={handleDeleteAccount}
                    disabled={uploading}
                >
                    <FontAwesome5 name="trash-alt" size={16} color="#FFF" />
                    <Text style={styles.deleteAccountText}>Eliminar Cuenta</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
