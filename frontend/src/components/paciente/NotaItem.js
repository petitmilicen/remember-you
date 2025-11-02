import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { styles } from "../../styles/BitacoraStyles";

export default function NotaItem({ note, themeStyles, getFontSizeStyle, onEdit, onDelete }) {
  return (
    <View style={[styles.savedNoteCard, themeStyles.card]}>
      <View style={styles.noteHeader}>
        <Text style={[styles.savedDate, themeStyles.subtext, getFontSizeStyle(12)]}>
          {note.date}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(note)}>
            <FontAwesome5 name="edit" size={16} color="#FEBA17" style={styles.actionIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(note.id)}>
            <FontAwesome5 name="trash" size={16} color="red" style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.savedText, themeStyles.text, getFontSizeStyle(16)]}>{note.text}</Text>
    </View>
  );
}
