import React, { useState, useEffect, useContext, useRef } from "react";
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
    Animated,
    PanResponder,
    Modal,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../auth/AuthContext";
import { getUserProfile, uploadProfilePicture, deleteProfilePicture, deleteAccount } from "../../api/userService";
import { styles } from "../../styles/PerfilCuidadorStyles";
import { ACCENT } from "../../utils/constants";

const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function PerfilCuidadorScreen({ navigation }) {
    const { logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);

    // Valores animados para el efecto 3D
    const rotateX = useRef(new Animated.Value(0)).current;
    const rotateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    // PanResponder para manejar los gestos
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                // Escalar ligeramente la tarjeta al tocarla
                Animated.spring(scale, {
                    toValue: 1.05,
                    useNativeDriver: true,
                }).start();
            },
            onPanResponderMove: (evt, gestureState) => {
                // Calcular la inclinación basada en la posición del dedo
                // Limitar los valores para que no sea demasiado exagerado
                const maxRotation = 15; // grados
                const cardWidth = 340; // aproximado del ancho de la tarjeta
                const cardHeight = 200; // aproximado del alto de la tarjeta

                const rotateYValue = (gestureState.dx / cardWidth) * maxRotation;
                const rotateXValue = -(gestureState.dy / cardHeight) * maxRotation;

                rotateX.setValue(rotateXValue);
                rotateY.setValue(rotateYValue);
            },
            onPanResponderRelease: () => {
                // Volver a la posición original con animación
                Animated.parallel([
                    Animated.spring(rotateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }),
                    Animated.spring(rotateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scale, {
                        toValue: 1,
                        useNativeDriver: true,
                    }),
                ]).start();
            },
        })
    ).current;

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

    const handleChangePhoto = () => {
        setPhotoModalVisible(true);
    };

    const handlePhotoOption = (option) => {
        setPhotoModalVisible(false);
        if (option === "camera") {
            pickImage("camera");
        } else if (option === "library") {
            pickImage("library");
        } else if (option === "delete") {
            handleDeletePhoto();
        }
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
                            await logout();
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
                {/* Título de la sección */}
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 24,
                    marginTop: 10,
                    marginBottom: 8,
                    gap: 8,
                }}>
                    <Ionicons name="id-card" size={20} color="#1565C0" />
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#1565C0",
                    }}>
                        Credencial del Cuidador
                    </Text>
                </View>

                <View style={styles.idCardContainer}>
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={{
                            transform: [
                                { perspective: 1000 },
                                {
                                    rotateX: rotateX.interpolate({
                                        inputRange: [-15, 15],
                                        outputRange: ['-15deg', '15deg'],
                                    }),
                                },
                                {
                                    rotateY: rotateY.interpolate({
                                        inputRange: [-15, 15],
                                        outputRange: ['-15deg', '15deg'],
                                    }),
                                },
                                { scale },
                            ],
                        }}
                    >
                        <LinearGradient
                            colors={['#1976D2', '#1565C0', '#0D47A1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.idCard}
                        >
                            <View style={styles.hologram}>
                                <FontAwesome5 name="shield-alt" size={20} color="rgba(255,255,255,0.3)" />
                            </View>
                            <View style={styles.cardBrand}>
                                <FontAwesome5 name="heart" size={16} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.brandText}>REMEMBER YOU</Text>
                            </View>

                            <View style={styles.cardContent}>
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
                                </View>

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
                    </Animated.View>
                </View>

                {/* Botón para cambiar foto - FUERA de la tarjeta 3D */}
                <TouchableOpacity
                    onPress={handleChangePhoto}
                    disabled={uploading}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        backgroundColor: "#FFF",
                        marginHorizontal: 100,
                        marginTop: -15,
                        marginBottom: 15,
                        paddingVertical: 12,
                        borderRadius: 25,
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 4,
                        borderWidth: 2,
                        borderColor: "#1565C0",
                    }}
                >
                    <Ionicons name="camera" size={18} color="#1565C0" />
                    <Text style={{ color: "#1565C0", fontWeight: "700", fontSize: 14 }}>
                        Cambiar Foto
                    </Text>
                </TouchableOpacity>

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

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <FontAwesome5 name="sign-out-alt" size={16} color="#1565C0" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteAccountButton}
                    onPress={handleDeleteAccount}
                    disabled={uploading}
                >
                    <FontAwesome5 name="trash-alt" size={16} color="#FFF" />
                    <Text style={styles.deleteAccountText}>Eliminar Cuenta</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal de Selección de Foto */}
            <Modal
                visible={photoModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setPhotoModalVisible(false)}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "flex-end",
                    }}
                    activeOpacity={1}
                    onPress={() => setPhotoModalVisible(false)}
                >
                    <View style={{
                        backgroundColor: "#FFF",
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        padding: 20,
                        paddingBottom: 40,
                    }}>
                        <View style={{
                            width: 40,
                            height: 4,
                            backgroundColor: "#E0E0E0",
                            borderRadius: 2,
                            alignSelf: "center",
                            marginBottom: 20,
                        }} />

                        <Text style={{
                            fontSize: 20,
                            fontWeight: "700",
                            color: "#1565C0",
                            textAlign: "center",
                            marginBottom: 20,
                        }}>
                            Cambiar Foto de Perfil
                        </Text>

                        <TouchableOpacity
                            onPress={() => handlePhotoOption("camera")}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 16,
                                paddingHorizontal: 20,
                                backgroundColor: "#F5F5F5",
                                borderRadius: 16,
                                marginBottom: 12,
                                gap: 16,
                            }}
                        >
                            <View style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: "#E3F2FD",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <Ionicons name="camera" size={22} color="#1565C0" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: "#212121" }}>
                                    Tomar Foto
                                </Text>
                                <Text style={{ fontSize: 12, color: "#757575", marginTop: 2 }}>
                                    Usar la cámara del dispositivo
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handlePhotoOption("library")}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 16,
                                paddingHorizontal: 20,
                                backgroundColor: "#F5F5F5",
                                borderRadius: 16,
                                marginBottom: 12,
                                gap: 16,
                            }}
                        >
                            <View style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: "#E8F5E9",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <Ionicons name="images" size={22} color="#388E3C" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: "#212121" }}>
                                    Elegir de Galería
                                </Text>
                                <Text style={{ fontSize: 12, color: "#757575", marginTop: 2 }}>
                                    Seleccionar una imagen existente
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
                        </TouchableOpacity>

                        {userData?.profile_picture && (
                            <TouchableOpacity
                                onPress={() => handlePhotoOption("delete")}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 16,
                                    paddingHorizontal: 20,
                                    backgroundColor: "#FFEBEE",
                                    borderRadius: 16,
                                    marginBottom: 12,
                                    gap: 16,
                                }}
                            >
                                <View style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 22,
                                    backgroundColor: "#FFCDD2",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Ionicons name="trash" size={22} color="#D32F2F" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#D32F2F" }}>
                                        Eliminar Foto
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#757575", marginTop: 2 }}>
                                        Quitar la foto de perfil actual
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={() => setPhotoModalVisible(false)}
                            style={{
                                paddingVertical: 14,
                                marginTop: 8,
                                borderRadius: 16,
                                borderWidth: 2,
                                borderColor: "#E0E0E0",
                            }}
                        >
                            <Text style={{
                                textAlign: "center",
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#757575",
                            }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
