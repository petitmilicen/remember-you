import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Hexagon from "./Hexagon";
import { styles } from "../../styles/PerfilPacienteStyles";

export default memo(function GroupAccordion({ title, items = [], open = false, onToggle, dark }) {
  const slots = Array.from({ length: 4 }).map((_, i) => items[i] || null);

  return (
    <View style={{ marginBottom: 14 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onToggle}
        style={[styles.groupHeader, { backgroundColor: dark ? "#1A1A1A" : "#FFF" }]}
      >
        <Text style={[styles.groupTitle, { color: dark ? "#A88BFF" : "#8A6DE9" }]}>{title}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color={dark ? "#DDD" : "#555"} />
      </TouchableOpacity>

      {open && (
        <View style={[styles.groupBody, dark ? styles.groupBodyDark : styles.groupBodyLight]}>
          <View style={styles.hexRow}>
            <Hexagon unlocked={!!slots[0]} label={slots[0]?.Nombre} dark={dark} size={78} />
            <Hexagon unlocked={!!slots[1]} label={slots[1]?.Nombre} dark={dark} size={78} />
          </View>
          <View style={{ height: 10 }} />
          <View style={styles.hexRow}>
            <Hexagon unlocked={!!slots[2]} label={slots[2]?.Nombre} dark={dark} size={78} />
            <Hexagon unlocked={!!slots[3]} label={slots[3]?.Nombre} dark={dark} size={78} />
          </View>
        </View>
      )}
    </View>
  );
});
