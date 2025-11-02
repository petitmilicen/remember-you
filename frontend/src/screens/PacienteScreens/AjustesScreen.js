import React from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import useAjustes from "../../hooks/useAjustes";
import AjusteOpcion from "../../components/paciente/AjusteOpcion";
import { styles, lightStyles, darkStyles } from "../../styles/AjustesStyles";

export default function AjustesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    settings,
    toggleTheme,
    changeFontSize,
    getFontSizeStyle,
    gradientColors,
    activeColor,
    circleBg,
    circleBorder,
  } = useAjustes();

  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.headerWrap}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Ajustes</Text>
          </View>

          <View style={{ width: 28 }} />
        </LinearGradient>
      </View>

      <SafeAreaView style={styles.safeContent} edges={["bottom", "left", "right"]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.sectionTitle, themeStyles.text, getFontSizeStyle(18)]}>
            Apariencia
          </Text>

          <AjusteOpcion
            icon={
              <Ionicons
                name={settings.theme === "dark" ? "moon" : "sunny"}
                size={28}
                color={activeColor}
              />
            }
            title={`Modo ${settings.theme === "dark" ? "Oscuro" : "Claro"}`}
            subtitle={settings.theme === "dark" ? "Activado" : "Desactivado"}
            onPress={toggleTheme}
            themeStyles={themeStyles}
            getFontSizeStyle={getFontSizeStyle}
            right={
              <View
                style={[
                  styles.toggle,
                  settings.theme === "dark" && styles.toggleActive,
                ]}
              >
                <View style={styles.toggleCircle} />
              </View>
            }
          />

          <Text
            style={[
              styles.sectionTitle,
              themeStyles.text,
              getFontSizeStyle(18),
              styles.sectionSpacing,
            ]}
          >
            Tamaño de Texto
          </Text>

          {["small", "medium", "large"].map((size) => (
            <AjusteOpcion
              key={size}
              icon={
                <View
                  style={[
                    styles.sizeCircle,
                    { backgroundColor: circleBg, borderColor: circleBorder },
                    settings.fontSize === size && {
                      backgroundColor: activeColor,
                      shadowColor: activeColor,
                      shadowOpacity: 0.4,
                      shadowRadius: 8,
                      borderWidth: 0,
                      elevation: 5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeLetter,
                      settings.fontSize === size
                        ? { color: "#FFF", transform: [{ scale: 1.1 }] }
                        : { color: themeStyles.text.color },
                      size === "small" && styles.sizeLetterSmall,
                      size === "large" && styles.sizeLetterLarge,
                    ]}
                  >
                    A
                  </Text>
                </View>
              }
              title={
                size === "small"
                  ? "Pequeño"
                  : size === "medium"
                  ? "Mediano"
                  : "Grande"
              }
              subtitle={
                size === "small"
                  ? "Texto compacto"
                  : size === "medium"
                  ? "Tamaño estándar"
                  : "Texto más legible"
              }
              onPress={() => changeFontSize(size)}
              themeStyles={themeStyles}
              getFontSizeStyle={getFontSizeStyle}
              right={
                settings.fontSize === size && (
                  <Ionicons name="checkmark" size={22} color={activeColor} />
                )
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
