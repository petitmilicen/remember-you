import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, ScrollView, StatusBar, Platform, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const TOP_PAD = Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0;

export default function ActividadesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#F93827", "#FF6B6B"]}
        style={[styles.header, { paddingTop: TOP_PAD + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>
            Actividades
          </Text>
        </View>
      </LinearGradient>
    <View style={{ width: 28 }} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.card}>
          <ImageBackground
            source={require("../assets/images/sudoku.png")}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={["rgba(249,56,39,0.85)", "rgba(249,56,39,0.2)"]}
              style={styles.overlay}
            >
              <Text style={styles.cardTitle}>Sudoku</Text>
              <Text style={styles.cardCTA}>Jugar Sudoku →</Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <ImageBackground
            source={require("../assets/images/rompecabezas.png")}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={["rgba(249,56,39,0.85)", "rgba(249,56,39,0.2)"]}
              style={styles.overlay}
            >
              <Text style={styles.cardTitle}>Rompecabezas</Text>
              <Text style={styles.cardCTA}>Armar ahora →</Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <ImageBackground
            source={require("../assets/images/sopa.png")}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={["rgba(249,56,39,0.85)", "rgba(249,56,39,0.2)"]}
              style={styles.overlay}
            >
              <Text style={styles.cardTitle}>Sopa de letras</Text>
              <Text style={styles.cardCTA}>Resolver ahora →</Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        <View style={[styles.card, styles.soonCard]}>
          <Text style={[styles.cardTitle, { color: "#555" }]}>
            Más actividades próximamente...
          </Text>
        </View>
      </ScrollView>
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

  scroll: {
    padding: 20,
  },

  card: {
    height: 150,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
  },

  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    justifyContent: "flex-end",
    padding: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 6,
  },

  cardCTA: {
    fontSize: 14,
    color: "#FFF",
  },

  soonCard: {
    backgroundColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
  },
});
