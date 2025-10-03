import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LoginPacienteScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Login Paciente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
