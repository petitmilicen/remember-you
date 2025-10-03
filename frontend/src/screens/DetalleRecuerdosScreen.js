import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, StatusBar, Platform, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function DetalleRecuerdosScreen({ route, navigation }) {
  const { memory } = route.params;

  const handleDelete = async () => {
    Alert.alert(
      "Eliminar Recuerdo",
      "¿Seguro que quieres eliminar este recuerdo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const stored = await AsyncStorage.getItem("imageMemories");
            let memories = stored ? JSON.parse(stored) : [];
            memories = memories.filter((m) => m.id !== memory.id);
            await AsyncStorage.setItem("imageMemories", JSON.stringify(memories));
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A2A80", "#3C4FCE"]}
        style={[styles.header, { paddingTop: TOP_PAD + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>
            Detalle del Recuerdo
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {memory.image && (
            <Image source={{ uri: memory.image }} style={styles.image} />
          )}

          <Text style={styles.date}>{memory.date}</Text>
          <Text style={styles.title}>{memory.title}</Text>
          <Text style={styles.description}>{memory.description}</Text>
        </ScrollView>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Eliminar Recuerdo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDEDED" },

  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  date: {
    fontSize: 13,
    color: "#777",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "left", 
    alignSelf: "flex-start",
  },

  deleteButton: {
    backgroundColor: "#E53935",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
