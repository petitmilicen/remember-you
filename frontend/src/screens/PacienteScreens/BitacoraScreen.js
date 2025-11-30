// src/screens/PacienteScreens/BitacoraScreen.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import { useIsFocused } from "@react-navigation/native";
import useBitacora from "../../hooks/useBitacora";
import NotaItem from "../../components/paciente/NotaItem";

const { width } = Dimensions.get("window");

export default function BitacoraScreen({ navigation }) {
  const { text, setText, notes, handleSave, handleEdit, handleDelete, loadNotes } = useBitacora();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const isFocused = useIsFocused();

  const getFontSizeStyle = (base = 16) =>
    settings.fontSize === "small"
      ? { fontSize: base - 2 }
      : settings.fontSize === "large"
        ? { fontSize: base + 2 }
        : { fontSize: base };

  useEffect(() => {
    if (isFocused) loadNotes();
  }, [isFocused]);

  useEffect(() => {
    loadNotes();
  }, []);

  // Magic Gradient for Bitacora (Warm Orange)
  const gradientColors = ["#f6d365", "#fda085"];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Text style={[styles.headerTitle, { fontSize: 28 }]}>Bitácora</Text>
            <View style={{ width: 45 }} />
          </View>
        </LinearGradient>

        {/* Content */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={insets.top + 20}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Área de escritura */}
            <View style={[styles.noteCard, { backgroundColor: settings.theme === "dark" ? "#1E1E1E" : "#FFF" }]}>
              <TextInput
                style={[
                  styles.noteInput,
                  { color: settings.theme === "dark" ? "#FFF" : "#333" },
                  getFontSizeStyle(18),
                ]}
                placeholder="¿Qué estás pensando hoy?"
                placeholderTextColor={settings.theme === "dark" ? "#888" : "#AAA"}
                multiline
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.fabSave} onPress={handleSave} activeOpacity={0.8}>
                <LinearGradient
                  colors={gradientColors}
                  style={styles.fabGradient}
                >
                  <FontAwesome5 name="save" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Notas guardadas */}
            <View style={styles.notesList}>
              {notes.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <FontAwesome5 name="book-open" size={50} color="#CCC" />
                  <Text style={[styles.emptyText, { color: settings.theme === "dark" ? "#666" : "#999" }]}>
                    No hay entradas en tu bitácora
                  </Text>
                </View>
              ) : (
                notes.map((note) => (
                  <NotaItem
                    key={note.id}
                    note={note}
                    theme={settings.theme}
                    getFontSizeStyle={getFontSizeStyle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    gradientColors={gradientColors}
                  />
                ))
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  noteCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 150,
  },
  noteInput: {
    flex: 1,
    marginBottom: 20,
    lineHeight: 24,
  },
  fabSave: {
    position: "absolute",
    bottom: 15,
    right: 15,
    borderRadius: 25,
    shadowColor: "#fda085",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  fabGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  notesList: {
    gap: 15,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    opacity: 0.8,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
