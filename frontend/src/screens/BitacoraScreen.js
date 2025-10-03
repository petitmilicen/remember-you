import React, { useState } from "react";
import { StyleSheet, Text, View,TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform, StatusBar, Dimensions, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const GUTTER = 20;
const TOP_PAD = Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0;

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
      <View style={styles.container}>
        <View style={styles.headerBleed}>
          <LinearGradient
            colors={["#FEBA17", "#FFD166"]}
            style={[styles.header, { paddingTop: TOP_PAD + 12 }]}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>Bitácora</Text>
            </View>

            <View style={{ width: 28 }} />
          </LinearGradient>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={TOP_PAD + 80}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.noteCard}>
              <TextInput
                style={styles.noteInput}
                placeholder="Comienza escribiendo algo..."
                placeholderTextColor="#9AA0A6"
                multiline
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.fabSave} onPress={handleSave}>
                <FontAwesome5 name="save" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            {notes.map((note) => (
              <View key={note.id} style={styles.savedNoteCard}>
                <View style={styles.noteHeader}>
                  <Text style={styles.savedDate}>{note.date}</Text>
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
                <Text style={styles.savedText}>{note.text}</Text>
              </View>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
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
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  content: {
    paddingVertical: 20,
  },

  noteCard: {
    backgroundColor: "#FFF",
    borderRadius: 26,
    padding: 16,
    minHeight: 200,
    marginBottom: 20,
    elevation: 6,
  },
  noteInput: {
    height: 140,
    fontSize: 16,
    color: "#111",
  },
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
    backgroundColor: "#FFF",
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
  actions: {
    flexDirection: "row",
  },
  actionIcon: {
    marginLeft: 12,
  },
  savedDate: {
    fontSize: 12,
    color: "#999",
  },
  savedText: {
    fontSize: 16,
    color: "#333",
  },
});
