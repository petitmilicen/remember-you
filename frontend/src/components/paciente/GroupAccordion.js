import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import AchievementBadge from "./AchievementBadge";

export default memo(function GroupAccordion({
  title,
  items = [],
  open = false,
  onToggle,
  dark,
  gradientColors,
}) {
  const slots = Array.from({ length: 3 }).map((_, i) => items[i] || null);

  return (
    <Animated.View layout={Layout.springify()} style={styles.container}>
      {/* HEADER */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={[
          styles.header,
          { backgroundColor: dark ? "#1E1E1E" : "#FFF" },
          open && styles.headerOpen
        ]}
      >
        <View style={styles.headerContent}>
          <View style={[styles.iconContainer, { backgroundColor: dark ? "#333" : "#F0F0F0" }]}>
            <Ionicons name="trophy" size={16} color={gradientColors ? gradientColors[0] : "#6a11cb"} />
          </View>
          <Text style={[styles.title, { color: dark ? "#FFF" : "#333" }]}>
            {title}
          </Text>
        </View>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={dark ? "#AAA" : "#888"}
        />
      </TouchableOpacity>

      {/* BODY */}
      {open && (
        <Animated.View
          entering={FadeIn}
          style={[
            styles.body,
            { backgroundColor: dark ? "#252525" : "#F9F9F9" }
          ]}
        >
          <View style={styles.row}>
            {slots.map((slot, index) => (
              <AchievementBadge
                key={index}
                source={slot?.icon}
                unlocked={slot?.unlocked ?? false}
                title={slot?.title || "Bloqueado"}
                description={slot?.description || "Completa actividades"}
              />
            ))}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  headerOpen: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  body: {
    padding: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
