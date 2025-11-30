import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function NotaItem({ note, theme, getFontSizeStyle, onEdit, onDelete, gradientColors }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFF" }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color={theme === "dark" ? "#AAA" : "#888"} />
          <Text style={[styles.date, { color: theme === "dark" ? "#AAA" : "#888" }]}>
            {note.date}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(note)} style={styles.actionButton}>
            <FontAwesome5 name="edit" size={16} color={gradientColors[0]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(note.id)} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[
        styles.text,
        { color: theme === "dark" ? "#DDD" : "#444" },
        getFontSizeStyle(16)
      ]}>
        {note.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  date: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  actions: {
    flexDirection: "row",
    gap: 15,
  },
  actionButton: {
    padding: 4,
  },
  text: {
    lineHeight: 24,
  },
});
