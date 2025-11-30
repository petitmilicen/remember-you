import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSettings } from "../../context/SettingsContext";
import { deleteMemory, getMemories } from "../../api/memoryService";
import { AuthContext } from "../../auth/AuthContext";

const { width } = Dimensions.get("window");

// Polaroid-style Memory Card
const MemoryCard = ({ memory, onPress, onLongPress, index, getFontSizeStyle }) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600).springify()}
      style={styles.cardContainer}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: memory.image }} style={styles.cardImage} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, getFontSizeStyle(14)]} numberOfLines={1}>
            {memory.title}
          </Text>
          <Text style={[styles.cardDate, getFontSizeStyle(12)]}>
            {memory.created_at.split("T")[0]}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function RecuerdosScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [memories, setMemories] = useState([]);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();

  const getFontSizeStyle = (baseSize = 16) => {
    switch (settings.fontSize) {
      case "small": return { fontSize: baseSize - 2 };
      case "large": return { fontSize: baseSize + 2 };
      default: return { fontSize: baseSize };
    }
  };

  useEffect(() => {
    if (isFocused) loadMemories();
  }, [isFocused]);

  const loadMemories = async () => {
    try {
      const data = await getMemories();
      setMemories(data);
    } catch (error) {
      console.error("Error cargando recuerdos:", error);
    }
  };

  const handleDeleteMemory = (id) => {
    Alert.alert("Eliminar Recuerdo", "¿Seguro que quieres eliminar este recuerdo?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => removeMemory(id) },
    ]);
  };

  const removeMemory = async (id) => {
    try {
      await deleteMemory(id);
      await loadMemories();
    } catch (error) {
      console.error("Error deleting memory:", error);
    }
  };

  // Consistent Magic Gradient
  const gradientColors = ["#a18cd1", "#fbc2eb"];

  return (
    <View style={[styles.container, { backgroundColor: settings.theme === "dark" ? "#0D0D0D" : "#F5F5F5" }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Magic Header */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={45} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 28 }]}>Recuerdos</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      {/* Content */}
      <FlatList
        data={memories}
        keyExtractor={(item) => item.memory_id.toString()}
        numColumns={3} // 3 Columns
        key={3} // Force re-render when changing columns
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <MemoryCard
            memory={item}
            index={index}
            onPress={() => navigation.navigate("DetalleRecuerdos", { memory: item })}
            onLongPress={() => handleDeleteMemory(item.memory_id)}
            getFontSizeStyle={getFontSizeStyle}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="images" size={60} color="#CCC" />
            <Text style={[styles.emptyText, { color: settings.theme === "dark" ? "#666" : "#999" }]}>
              No hay recuerdos guardados
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("AddRecuerdos")}
      >
        <LinearGradient
          colors={["#a18cd1", "#fbc2eb"]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listContent: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 100,
  },
  cardContainer: {
    flex: 1,
    margin: 4, // Reduced margin for 3 columns
    height: 180, // Reduced height
    borderRadius: 12,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 6, // Reduced frame padding
  },
  card: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    paddingTop: 6,
    paddingHorizontal: 2,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardTitle: {
    color: "#333",
    fontWeight: "bold",
    marginBottom: 1,
    textAlign: "left",
    fontFamily: "System",
    fontSize: 12, // Smaller font
  },
  cardDate: {
    color: "#888",
    textAlign: "left",
    fontSize: 10, // Smaller date
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
  },
  fab: {
    position: "absolute",
    bottom: 50,
    right: 30,
    borderRadius: 30,
    shadowColor: "#6A5ACD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
