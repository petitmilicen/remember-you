import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StatusBar } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import useMemories from "../../hooks/useMemories";
import RecuerdoCard from "../../components/paciente/RecuerdoCard";
import { styles, lightStyles, darkStyles } from "../../styles/RecuerdosStyles";

export default function RecuerdosScreen({ navigation }) {
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();
  const { memories, deleteMemory } = useMemories();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
    settings.fontSize === "large" ? base + 2 : base;

  const gradientColors =
    settings.theme === "dark" ? ["#101A50", "#202E8A"] : ["#1A2A80", "#3C4FCE"];

  const handleDelete = (id) =>
    Alert.alert("Eliminar Recuerdo", "¿Seguro que quieres eliminar este recuerdo?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteMemory(id) },
    ]);

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={gradientColors} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: getFontSize(20) }]}>Recuerdos</Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <FlatList
        data={memories}
        renderItem={({ item }) => (
          <RecuerdoCard
            memory={item}
            onPress={() => navigation.navigate("DetalleRecuerdos", { memory: item })}
            onLongPress={() => handleDelete(item.id)}
            themeStyles={themeStyles}
            getFontSize={getFontSize}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={
          memories.length === 0
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingBottom: 100 }
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, themeStyles.subtext, { fontSize: getFontSize(16) }]}>
            No hay recuerdos todavía
          </Text>
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: settings.theme === "dark" ? "#2F3A9D" : "#3C4FCE" }]}
        onPress={() => navigation.navigate("AddRecuerdos")}
      >
        <Text style={[styles.addButtonText, { fontSize: getFontSize(16) }]}>+ Añadir Recuerdo</Text>
      </TouchableOpacity>
    </View>
  );
}
