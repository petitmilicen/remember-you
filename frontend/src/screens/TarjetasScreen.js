import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, StatusBar, Platform, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

const POSTIT_COLORS = ["#FFF9C4", "#C8E6C9", "#FFCDD2", "#BBDEFB"];

export default function TarjetasScreen({ navigation }) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadCards);
    return unsubscribe;
  }, [navigation]);

  const loadCards = async () => {
    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      if (stored) setCards(JSON.parse(stored));
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
    }
  };

  const handleDeleteCard = (id) => {
    Alert.alert("Eliminar Tarjeta", "¿Seguro que quieres eliminar esta tarjeta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteCard(id),
      },
    ]);
  };

  const deleteCard = async (id) => {
    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      let current = stored ? JSON.parse(stored) : [];
      const updated = current.filter((c) => c.id !== id);
      setCards(updated);
      await AsyncStorage.setItem("memoryCards", JSON.stringify(updated));
    } catch (error) {
      console.error("Error eliminando tarjeta:", error);
    }
  };

  const renderCard = ({ item }) => {
    const color = POSTIT_COLORS[item.id.charCodeAt(0) % POSTIT_COLORS.length];

    return (
      <TouchableOpacity
        style={[styles.postIt, { backgroundColor: color }]}
        onLongPress={() => handleDeleteCard(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <Text style={styles.postItText}>{item.text}</Text>
          <Text style={styles.postItDate}>{item.date}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCard(item.id)}
        >
          <FontAwesome5 name="trash" size={14} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#00C897", "#00E0AC"]}
        style={[styles.header, { paddingTop: TOP_PAD + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>
            Tarjetas
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={
          cards.length === 0 && {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay tarjetas todavía</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTarjetas")}
      >
        <Text style={styles.addButtonText}>+ Añadir Tarjeta</Text>
      </TouchableOpacity>
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

  postIt: {
    flex: 1,
    borderRadius: 8,
    margin: 10,
    padding: 15,
    minHeight: 120,
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 3 },
    transform: [{ rotate: "-1deg" }],
  },
  cardContent: {
    flex: 1,
  },
  postItText: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
  },
  postItDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "right",
  },

  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },

  addButton: {
    backgroundColor: "#00C897",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    margin: 20,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
