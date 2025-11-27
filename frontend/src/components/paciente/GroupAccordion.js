import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AchievementBadge from "./AchievementBadge";
import { styles } from "../../styles/PerfilPacienteStyles";

export default memo(function GroupAccordion({
  title,
  items = [],
  open = false,
  onToggle,
  dark,
}) {
  const slots = Array.from({ length: 3 }).map((_, i) => items[i] || null);

  return (
    <View style={{ marginBottom: 14 }}>
      {/* HEADER */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onToggle}
        style={[
          styles.groupHeader,
          { backgroundColor: dark ? "#1A1A1A" : "#FFF" },
        ]}
      >
        <Text
          style={[styles.groupTitle, { color: dark ? "#A88BFF" : "#8A6DE9" }]}
        >
          {title}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={dark ? "#DDD" : "#555"}
        />
      </TouchableOpacity>

      {/* BODY */}
      {open && (
        <View
          style={[
            styles.groupBody,
            dark ? styles.groupBodyDark : styles.groupBodyLight,
          ]}
        >
          <View style={innerStyles.row}>
            <AchievementBadge
              source={slots[0]?.icon}
              unlocked={slots[0]?.unlocked ?? false}
              title={slots[0]?.title || "Logro Bloqueado"}
              description={slots[0]?.description || "Completa actividades para desbloquear"}
            />
            <AchievementBadge
              source={slots[1]?.icon}
              unlocked={slots[1]?.unlocked ?? false}
              title={slots[1]?.title || "Logro Bloqueado"}
              description={slots[1]?.description || "Completa actividades para desbloquear"}
            />
            <AchievementBadge
              source={slots[2]?.icon}
              unlocked={slots[2]?.unlocked ?? false}
              title={slots[2]?.title || "Logro Bloqueado"}
              description={slots[2]?.description || "Completa actividades para desbloquear"}
            />
          </View>
        </View>
      )}
    </View>
  );
});

const innerStyles = {
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
};
