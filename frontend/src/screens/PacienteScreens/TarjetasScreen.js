// src/screens/PacienteScreens/TarjetasScreen.js
import React, { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Text, FlatList, TouchableOpacity, StatusBar, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import useTarjetasPaciente from "../../hooks/useTarjetasPaciente";
import TarjetaPacienteItem from "../../components/paciente/TarjetaPacienteItem";

export default function TarjetasScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { settings } = useSettings();
  const { cards, loadCards, handleDeleteCard } = useTarjetasPaciente();

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
      settings.fontSize === "large" ? base + 2 : base;

  // Magic Gradient for Tarjetas (Mint to Blue)
  const gradientColors = ["#84fab0", "#8fd3f4"];

  useEffect(() => {
    if (isFocused) loadCards();
  }, [isFocused]);

  return (
    <View style={[styles.container, { backgroundColor: settings.theme === "dark" ? "#0D0D0D" : "#F5F5F5" }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Magic Header */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={45} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 28 }]}>Tarjetas</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={cards}
        renderItem={({ item }) => (
          <TarjetaPacienteItem
            item={item}
            settings={settings}
            getFontSize={getFontSize}
            onDelete={handleDeleteCard}
            gradientColors={gradientColors}
          />
        )}
        keyExtractor={(item) => item.card_id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="sticky-note" size={50} color="#CCC" />
            <Text style={[styles.emptyText, { color: settings.theme === "dark" ? "#666" : "#999" }]}>
              No hay tarjetas guardadas
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("AddTarjetas")}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    opacity: 0.8,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 50,
    right: 30,
    borderRadius: 30,
    shadowColor: "#84fab0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
