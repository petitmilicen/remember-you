import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles as ajustesStyles } from "../../styles/AjustesStyles";

export default function AjusteOpcion({
  icon,
  title,
  subtitle,
  right,
  onPress,
  themeStyles,
  getFontSizeStyle,
}) {
  return (
    <TouchableOpacity
      style={ajustesStyles.option}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {icon ? <View style={{ width: 32, alignItems: "center" }}>{icon}</View> : null}

      <View style={ajustesStyles.textContainer}>
        <Text
          style={[
            ajustesStyles.optionText,
            themeStyles.text,
            getFontSizeStyle(16),
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={[
              ajustesStyles.optionSubtext,
              themeStyles.subtext,
              getFontSizeStyle(14),
            ]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ? <View style={{ marginLeft: 12 }}>{right}</View> : null}
    </TouchableOpacity>
  );
}
