import React from "react";
import { View, Text, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import useTarjetasPaciente from "../../hooks/useTarjetasPaciente";
import TarjetaPacienteItem from "../../components/paciente/TarjetaPacienteItem";
import { styles, lightStyles, darkStyles } from "../../styles/TarjetasStyles";

export default function TarjetasScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { cards, handleDeleteCard } = useTarjetasPaciente(navigation);
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
    settings.fontSize === "large" ? base + 2 : base;

  const gradientColors =
    settings.theme === "dark" ? ["#008366", "#00C897"] : ["#00C897", "#00E0AC"];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.headerBleed}>
        <LinearGradient colors={gradientColors} style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { flex: 1, textAlign: "center", fontSize: getFontSize(20) }]}>
            Tarjetas
          </Text>
          <View style={{ width: 28 }} />
        </LinearGradient>
      </View>

      <FlatList
        data={cards}
        renderItem={({ item }) => (
          <TarjetaPacienteItem
            item={item}
            themeStyles={themeStyles}
            settings={settings}
            getFontSize={getFontSize}
            onDelete={handleDeleteCard}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={
          cards.length === 0
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingBottom: 100 }
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, themeStyles.subtext, { fontSize: getFontSize(16) }]}>
            No hay tarjetas todavía
          </Text>
        }
      />

      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: settings.theme === "dark" ? "#009E7A" : "#00C897" },
        ]}
        onPress={() => navigation.navigate("AddTarjetas")}
      >
        <Text style={[styles.addButtonText, { fontSize: getFontSize(16) }]}>
          + Añadir Tarjeta
        </Text>
      </TouchableOpacity>
    </View>
  );
}
