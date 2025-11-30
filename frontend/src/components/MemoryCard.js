import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Easing, withDelay, withSequence } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function MemoryCard({ emoji, isFlipped, isMatched, onPress, index, gradientColors }) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      index * 50,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.exp) })
    );
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 300 }));
  }, []);

  useEffect(() => {
    rotation.value = withTiming(isFlipped || isMatched ? 180 : 0, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isFlipped, isMatched]);

  useEffect(() => {
    if (isMatched) {
      glow.value = withSequence(
        withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 600, easing: Easing.in(Easing.quad) })
      );
    }
  }, [isMatched]);

  const animatedFront = useAnimatedStyle(() => {
    const rotateY = `${rotation.value}deg`;
    const faceOpacity = interpolate(rotation.value, [0, 90], [1, 0]);
    return {
      transform: [{ perspective: 1000 }, { rotateY }, { scale: scale.value }],
      opacity: opacity.value * faceOpacity,
    };
  });

  const animatedBack = useAnimatedStyle(() => {
    const rotateY = `${rotation.value - 180}deg`;
    const faceOpacity = interpolate(rotation.value, [90, 180], [0, 1]);
    return {
      transform: [{ perspective: 1000 }, { rotateY }, { scale: scale.value }],
      opacity: opacity.value * faceOpacity,
    };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    transform: [{ scale: 1.1 }],
  }));

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.side, styles.front, animatedFront]}>
          <LinearGradient
            colors={gradientColors || ["#ff9a9e", "#fecfef"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.questionMark}>?</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.side, styles.back, animatedBack]}>
          <Text style={styles.emoji}>{emoji || "❔"}</Text>
        </Animated.View>

        <Animated.View style={[styles.glowLayer, glowStyle]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: (width * 0.9) / 4 - 10,
    height: (width * 0.9) / 4 - 10,
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  side: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: "#FFF",
  },
  front: {
    backgroundColor: "#FFF",
  },
  gradient: {
    flex: 1,
    width: "100%",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  back: {
    backgroundColor: "#FFF",
    transform: [{ rotateY: "180deg" }],
    borderWidth: 2,
    borderColor: "#ff9a9e",
  },
  emoji: {
    fontSize: 32,
  },
  questionMark: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold",
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
});
