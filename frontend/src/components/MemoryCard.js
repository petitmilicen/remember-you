import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Easing, withDelay, withSequence } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function MemoryCard({ emoji, isFlipped, isMatched, onPress, index }) {
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
    backgroundColor: "rgba(0,255,100,0.4)",
    transform: [{ scale: 1.1 }],
  }));

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={styles.card}>
        <Animated.View style={[styles.side, styles.front, animatedFront]}>
          <Text style={styles.emoji}>❓</Text>
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
  card: {
    width: (width * 0.9) / 4 - 10,
    height: (width * 0.9) / 4 - 10,
    margin: 5,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  side: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  front: {
    backgroundColor: "#FFD6A5",
  },
  back: {
    backgroundColor: "#FF6B6B",
    transform: [{ rotateY: "180deg" }],
  },
  emoji: {
    fontSize: 30,
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
});
