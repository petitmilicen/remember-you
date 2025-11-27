import { StyleSheet, Dimensions } from "react-native";
import { ACCENT } from "../utils/constants";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = (CARD_WIDTH * 0.63);

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },

    header: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    backText: {
        fontSize: 16,
        color: "#212121",
        fontWeight: "600",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#757575",
    },

    scrollContent: {
        paddingBottom: 40,
    },

    idCardContainer: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 16,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },

    idCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        padding: 20,
        position: "relative",
        overflow: "hidden",
    },

    hologram: {
        position: "absolute",
        top: 20,
        left: 20,
        opacity: 0.3,
    },

    cardBrand: {
        position: "absolute",
        top: 20,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    brandText: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1,
    },

    cardContent: {
        flex: 1,
        flexDirection: "row",
        marginTop: 50,
        gap: 16,
    },
    photoSection: {
        position: "relative",
    },
    photoFrame: {
        width: 100,
        height: 120,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.2)",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.4)",
    },
    cardPhoto: {
        width: "100%",
        height: "100%",
    },
    cardPhotoPlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    editPhotoButton: {
        position: "absolute",
        bottom: -8,
        right: -8,
        backgroundColor: "#FFF",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    uploadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    infoSection: {
        flex: 1,
        justifyContent: "space-between",
    },
    cardName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFF",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    cardRole: {
        fontSize: 11,
        color: "rgba(255,255,255,0.8)",
        letterSpacing: 1,
        marginBottom: 16,
    },
    cardDetails: {
        gap: 6,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    detailLabel: {
        fontSize: 9,
        color: "rgba(255,255,255,0.7)",
        letterSpacing: 0.5,
        fontWeight: "600",
    },
    detailValue: {
        fontSize: 12,
        color: "#FFF",
        fontWeight: "600",
        letterSpacing: 0.5,
    },

    additionalInfo: {
        marginHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#455A64",
        marginBottom: 12,
        marginLeft: 4,
    },
    infoCard: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    infoText: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: "#757575",
        fontWeight: "600",
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        color: "#212121",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 12,
    },

    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: ACCENT,
        marginHorizontal: 60,
        marginTop: 8,
        paddingVertical: 14,
        borderRadius: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoutText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },

    deleteAccountButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: "#D32F2F",
        marginHorizontal: 60,
        marginTop: 12,
        marginBottom: 20,
        paddingVertical: 14,
        borderRadius: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    deleteAccountText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
