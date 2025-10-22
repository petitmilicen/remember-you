import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";

const { width } = Dimensions.get("window");
const GUTTER = 20;

function formatDate(date) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = date.toLocaleString("es-ES", { month: "long" });
  const year = date.getFullYear();
  return `${dayName}, ${day} de ${month} ${year}`;
}

export default function BitacoraScreen({ navigation }) {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const insets = useSafeAreaInsets();

  const { settings } = useSettings();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

  // ✅ Función para aplicar el tamaño de texto dinámico
  const getFontSizeStyle = (baseSize = 16) => {
    switch (settings.fontSize) {
      case "small":
        return { fontSize: baseSize - 2 };
      case "large":
        return { fontSize: baseSize + 2 };
      default:
        return { fontSize: baseSize };
    }
  };

  const handleSave = () => {
    if (text.trim() === "") return;

    if (editingNote) {
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id ? { ...note, text } : note
        )
      );
      setEditingNote(null);
    } else {
      const newNote = {
        id: Date.now(),
        text,
        date: formatDate(new Date()),
      };
      setNotes([newNote, ...notes]);
    }

    setText("");
  };

  const handleEdit = (note) => {
    setText(note.text);
    setEditingNote(note);
  };

  const handleDelete = (noteId) => {
    Alert.alert("Eliminar nota", "¿Seguro que quieres eliminar esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setNotes(notes.filter((note) => note.id !== noteId));
          if (editingNote?.id === noteId) {
            setEditingNote(null);
            setText("");
          }
        },
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, themeStyles.container]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        {/* HEADER */}
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

        {/* CONTENIDO */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={insets.top + 80}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {/* 📝 Área de escritura */}
            <View style={[styles.noteCard, themeStyles.card]}>
              <TextInput
                style={[styles.noteInput, themeStyles.text, getFontSizeStyle(16)]}
                placeholder="Comienza escribiendo algo..."
                placeholderTextColor={
                  settings.theme === "dark" ? "#AAAAAA" : "#9AA0A6"
                }
                multiline
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.fabSave} onPress={handleSave}>
                <FontAwesome5 name="save" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* 📜 Notas guardadas */}
            {notes.map((note) => (
              <View key={note.id} style={[styles.savedNoteCard, themeStyles.card]}>
                <View style={styles.noteHeader}>
                  <Text style={[styles.savedDate, themeStyles.subtext, getFontSizeStyle(12)]}>
                    {note.date}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleEdit(note)}>
                      <FontAwesome5
                        name="edit"
                        size={16}
                        color="#FEBA17"
                        style={styles.actionIcon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(note.id)}>
                      <FontAwesome5
                        name="trash"
                        size={16}
                        color="red"
                        style={styles.actionIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={[styles.savedText, themeStyles.text, getFontSizeStyle(16)]}>
                  {note.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

/* 🎨 Estilos base */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: GUTTER,
  },

  headerBleed: {
    marginLeft: -GUTTER,
    marginRight: -GUTTER,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 5,
  },
  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: GUTTER,
    paddingBottom: 16,
  },
  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerTitle: { color: "#FFF", fontWeight: "bold" },

  content: { paddingVertical: 20 },

  noteCard: {
    borderRadius: 26,
    padding: 16,
    minHeight: 200,
    marginBottom: 20,
    elevation: 6,
  },
  noteInput: { height: 140 },

  fabSave: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEBA17",
    alignItems: "center",
    justifyContent: "center",
  },

  savedNoteCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  actions: { flexDirection: "row" },
  actionIcon: { marginLeft: 12 },
  savedDate: {},
  savedText: {},
});

/* 🎨 Modo claro / oscuro */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#EDEDED" },
  card: { backgroundColor: "#FFF" },
  text: { color: "#111" },
  subtext: { color: "#999" },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  card: { backgroundColor: "#1E1E1E" },
  text: { color: "#FFFFFF" },
  subtext: { color: "#AAAAAA" },
});
