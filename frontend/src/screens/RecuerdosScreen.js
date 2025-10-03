import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, StatusBar, Platform, Dimensions, Image } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

const MemoryCard = ({ memory, onPress, onLongPress }) => (
  <TouchableOpacity
    style={styles.memoryCard}
    onPress={onPress}
    onLongPress={onLongPress}
  >
    {memory.image && (
      <Image source={{ uri: memory.image }} style={styles.memoryImage} />
    )}
    <View style={styles.memoryInfo}>
      <Text style={styles.memoryTitle}>{memory.title}</Text>
      <Text style={styles.memoryDate}>{memory.date}</Text>
    </View>
  </TouchableOpacity>
);

export default function RecuerdosScreen({ navigation }) {
  const [memories, setMemories] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) loadMemories();
  }, [isFocused]);

  const loadMemories = async () => {
    try {
      const stored = await AsyncStorage.getItem("imageMemories");
      if (stored) setMemories(JSON.parse(stored));
    } catch (error) {
      console.error("Error cargando recuerdos:", error);
    }
  };

  const handleDeleteMemory = (id) => {
    Alert.alert("Eliminar Recuerdo", "¿Seguro que quieres eliminar este recuerdo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteMemory(id),
      },
    ]);
  };

  const deleteMemory = async (id) => {
    try {
      const stored = await AsyncStorage.getItem("imageMemories");
      let current = stored ? JSON.parse(stored) : [];
      const updated = current.filter((m) => m.id !== id);
      setMemories(updated);
      await AsyncStorage.setItem("imageMemories", JSON.stringify(updated));
    } catch (error) {
      console.error("Error eliminando recuerdo:", error);
    }
  };

  const renderMemory = ({ item }) => (
    <MemoryCard
      memory={item}
      onPress={() => navigation.navigate("DetalleRecuerdos", { memory: item })}
      onLongPress={() => handleDeleteMemory(item.id)}
    />
  );

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
            Recuerdos
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <View style={styles.content}>
        <FlatList
          data={memories}
          renderItem={renderMemory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={
            memories.length === 0 && { flex: 1, justifyContent: "center", alignItems: "center" }
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay recuerdos todavía</Text>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddRecuerdos")}
        >
          <Text style={styles.addButtonText}>+ Añadir Recuerdo</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    justifyContent: "space-between", 
  },
  memoryCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 15,
    margin: 8,
    overflow: "hidden",
    elevation: 3,
  },
  memoryImage: {
    width: "100%",
    height: 120,
  },
  memoryInfo: {
    padding: 10,
  },
  memoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  memoryDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#3C4FCE",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 45, 
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
