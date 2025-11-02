// src/screens/PacienteScreens/AddRecuerdosScreen.js
import React from "react";
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import useAddRecuerdo from "../../hooks/useAddRecuerdo";
import { styles, lightStyles, darkStyles } from "../../styles/AddRecuerdosStyles";

export default function AddRecuerdosScreen({ navigation }) {
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;
  const { title, setTitle, description, setDescription, image, pickImage, handleSave } =
    useAddRecuerdo(navigation);

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
    settings.fontSize === "large" ? base + 2 : base;

  const gradientColors =
    settings.theme === "dark" ? ["#101A50", "#202E8A"] : ["#1A2A80", "#3C4FCE"];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.headerWrapper}>
        <LinearGradient colors={gradientColors} style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: getFontSize(20) }]}>Añadir Recuerdo</Text>
          <View style={{ width: 28 }} />
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          style={[styles.input, themeStyles.card, themeStyles.text, { fontSize: getFontSize(16) }]}
          placeholder="Título"
          placeholderTextColor={settings.theme === "dark" ? "#AAA" : "#999"}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[
            styles.input,
            styles.textArea,
            themeStyles.card,
            themeStyles.text,
            { fontSize: getFontSize(16) },
          ]}
          placeholder="Descripción"
          placeholderTextColor={settings.theme === "dark" ? "#AAA" : "#999"}
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={[styles.imagePicker, themeStyles.card]} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <Text style={[themeStyles.subtext, { fontSize: getFontSize(16) }]}>
              Seleccionar Imagen
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: settings.theme === "dark" ? "#2F3A9D" : "#1A2A80" },
          ]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { fontSize: getFontSize(16) }]}>
            Guardar Recuerdo
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
