import React, { memo } from "react";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { styles } from "../../styles/PerfilPacienteStyles";

export default memo(function Hexagon({ size = 80, unlocked = false, label = "", dark = false }) {
  const W = size;
  const H = Math.round((Math.sqrt(3) / 2) * W);
  const TRI_H = Math.round(H * 0.25);
  const MID_H = H - TRI_H * 2;

  const fillColor = unlocked ? "rgba(255,215,0,0.25)" : dark ? "#1C1C1C" : "#F0F0F0";
  const borderColor = unlocked ? "#FFD700" : dark ? "#3A3A3A" : "#CFCFCF";

  return (
    <View style={{ width: W, height: H, alignItems: "center" }}>
      <View style={[styles.hexTri, { borderBottomWidth: TRI_H, borderBottomColor: borderColor }]} />
      <View
        style={[
          styles.hexMid,
          { width: W, height: MID_H, backgroundColor: fillColor, borderColor },
        ]}
      >
        {unlocked && (
          <>
            <FontAwesome5 name="medal" size={22} color="#FFD700" />
            {!!label && (
              <Text style={{ marginTop: 4, fontWeight: "600", fontSize: 11, color: dark ? "#FFF" : "#222" }}>
                {label}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={[styles.hexTri, { borderTopWidth: TRI_H, borderTopColor: borderColor }]} />
    </View>
  );
});
