import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Platform, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const TOP_PAD = Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0;

export default function PerfilPacienteScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8A6DE9", "#A88BFF"]}
        style={[styles.header, { paddingTop: TOP_PAD + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>
            Perfil
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },

  header: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
