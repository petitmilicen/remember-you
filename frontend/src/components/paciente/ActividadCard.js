import React from "react";
import { TouchableOpacity, Text, ImageBackground, StyleSheet, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 3; // 3 columns with padding

export default function ActividadCard({
  title,
  subtitle,
  image,
  onPress,
  theme,
  getFontSize,
  delay = 0,
  gradientColors,
  small = false,
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500)}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            shadowColor: gradientColors ? gradientColors[0] : "#000",
            width: small ? CARD_WIDTH : "100%",
            height: small ? CARD_WIDTH * 1.2 : 180,
          }
        ]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={image}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 15 }}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.85)"]}
            style={styles.overlay}
          >
            <View style={styles.content}>
              <Text
                style={[
                  styles.cardTitle,
                  { fontSize: small ? 11 : getFontSize(22) },
                  small && { textAlign: "center", marginRight: 0 }
                ]}
                numberOfLines={2}
              >
                {title}
              </Text>

              {!small && (
                <View style={[styles.button, { backgroundColor: gradientColors ? gradientColors[0] : "#ff9a9e" }]}>
                  <Text style={[styles.cardCTA, { fontSize: getFontSize(12) }]}>{subtitle}</Text>
                </View>
              )}

              {small && (
                <View style={[styles.miniIcon, { backgroundColor: gradientColors ? gradientColors[0] : "#ff9a9e" }]}>
                  <Ionicons name="play" size={10} color="#FFF" />
                </View>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: "#FFF",
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    height: "100%",
    justifyContent: "flex-end",
    padding: 8,
    borderRadius: 15,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  cardTitle: {
    color: "#FFF",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    flex: 1,
    marginRight: 10,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  cardCTA: {
    color: "#FFF",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  miniIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
