import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function AjusteOpcion({
  icon,
  title,
  subtitle,
  right,
  onPress,
  settings,
  getFontSizeStyle,
  delay = 0,
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500)}>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: settings.theme === "dark" ? "#1E1E1E" : "#FFF" }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                { color: settings.theme === "dark" ? "#FFF" : "#333" },
                getFontSizeStyle(16),
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>

            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: settings.theme === "dark" ? "#AAA" : "#888" },
                  getFontSizeStyle(14),
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {right && <View style={styles.rightContent}>{right}</View>}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 15,
    width: 30,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    opacity: 0.8,
  },
  rightContent: {
    marginLeft: 10,
  },
});
