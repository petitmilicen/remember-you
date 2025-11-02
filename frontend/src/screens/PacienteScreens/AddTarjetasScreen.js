import React from "react";
import { View, Text, TextInput, TouchableOpacity, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";
import useAddTarjetaPaciente from "../../hooks/useAddTarjetaPaciente";
import { styles, lightStyles, darkStyles } from "../../styles/AddTarjetasStyles";

export default function AddTarjetasScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { tipo, setTipo, mensaje, setMensaje, guardarTarjeta } = useAddTarjetaPaciente(navigation);
  const themeStyles = settings.theme === "dark" ? darkStyles : lightStyles;

  const getFontSize = (base = 16) =>
    settings.fontSize === "small" ? base - 2 :
    settings.fontSize === "large" ? base + 2 : base;

  const gradientColors =
    settings.theme === "dark" ? ["#007E67", "#009E7A"] : ["#00C897", "#00E0AC"];

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient colors={gradientColors} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: getFontSize(20) }]}>Nueva Tarjeta</Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <View style={[styles.form, themeStyles.card]}>
        <Text style={[styles.label, themeStyles.text, { fontSize: getFontSize(16) }]}>
          Tipo de tarjeta
        </Text>
        <TextInput
          style={[styles.input, themeStyles.input, { fontSize: getFontSize(16) }]}
          placeholder="Ejemplo: Recordatorio, Mensaje..."
          placeholderTextColor={settings.theme === "dark" ? "#AAA" : "#999"}
          value={tipo}
          onChangeText={setTipo}
        />

        <Text style={[styles.label, themeStyles.text, { fontSize: getFontSize(16) }]}>
          Mensaje
        </Text>
        <TextInput
          style={[
            styles.input,
            { height: 100, textAlignVertical: "top" },
            themeStyles.input,
            { fontSize: getFontSize(16) },
          ]}
          placeholder="Escribe el mensaje para ti o tu cuidador"
          placeholderTextColor={settings.theme === "dark" ? "#AAA" : "#999"}
          multiline
          value={mensaje}
          onChangeText={setMensaje}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: settings.theme === "dark" ? "#007E67" : "#00C897" },
          ]}
          onPress={guardarTarjeta}
        >
          <Text style={[styles.saveButtonText, { fontSize: getFontSize(16) }]}>
            💾 Guardar Tarjeta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
