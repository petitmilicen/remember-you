// src/screens/PacienteScreens/BitacoraScreen.js
import React, {useEffect} from "react";
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
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import { useIsFocused } from "@react-navigation/native";
import useBitacora from "../../hooks/useBitacora";
import NotaItem from "../../components/paciente/NotaItem";
import { styles, lightStyles, darkStyles } from "../../styles/BitacoraStyles";

export default function BitacoraScreen({ navigation }) {
  const { text, setText, notes, handleSave, handleEdit, handleDelete, loadNotes } = useBitacora();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const isFocused = useIsFocused();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, themeStyles.container]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        {/* Header */}
        <View style={styles.headerBleed}>
          <LinearGradient
            colors={["#FEBA17", "#FFD166"]}
            style={[styles.header, { paddingTop: insets.top + 12 }]}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
              <Text style={[styles.headerTitle, getFontSizeStyle(20)]}>Bitácora</Text>
            </View>
            <View style={{ width: 28 }} />
          </LinearGradient>
        </View>

        {/* Contenido */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={insets.top + 80}
        >
          <ScrollView contentContainerStyle={styles.content}>
            {/* Área de escritura */}
            <View style={[styles.noteCard, themeStyles.card]}>
              <TextInput
                style={[styles.noteInput, themeStyles.text, getFontSizeStyle(16)]}
                placeholder="Comienza escribiendo algo..."
                placeholderTextColor={settings.theme === "dark" ? "#AAAAAA" : "#9AA0A6"}
                multiline
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.fabSave} onPress={handleSave}>
                <FontAwesome5 name="save" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Notas guardadas */}
            {notes.map((note) => (
              <NotaItem
                key={note.id}
                note={note}
                themeStyles={themeStyles}
                getFontSizeStyle={getFontSizeStyle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
