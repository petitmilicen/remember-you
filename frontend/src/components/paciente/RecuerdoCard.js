import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { styles } from "../../styles/RecuerdosStyles";

export default function RecuerdoCard({ memory, onPress, onLongPress, themeStyles, getFontSize }) {
  return (
    <TouchableOpacity
      style={[styles.memoryCard, themeStyles.card]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {memory.image && <Image source={{ uri: memory.image }} style={styles.memoryImage} />}
      <View style={styles.memoryInfo}>
        <Text style={[styles.memoryTitle, themeStyles.text, { fontSize: getFontSize(14) }]}>
          {memory.title}
        </Text>
        <Text style={[styles.memoryDate, themeStyles.subtext, { fontSize: getFontSize(12) }]}>
          {memory.date}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
