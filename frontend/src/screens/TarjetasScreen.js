import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const TOP_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function TarjetasScreen({ navigation }) {
  const [cards, setCards] = useState([]);

  // 🔄 Cargar tarjetas cada vez que la pantalla se enfoca
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadCards);
    return unsubscribe;
  }, [navigation]);

  // 📦 Cargar desde AsyncStorage
  const loadCards = async () => {
    try {
      const stored = await AsyncStorage.getItem("memoryCards");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ordenar por más recientes
        parsed.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setCards(parsed);
      }
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
    }
  };

  // 💾 Guardar en AsyncStorage
  const saveCards = async (newCards) => {
    try {
      await AsyncStorage.setItem("memoryCards", JSON.stringify(newCards));
    } catch (error) {
      console.error("Error guardando tarjetas:", error);
    }
  };

  // 🗑️ Eliminar tarjeta con confirmación
  const handleDeleteCard = (id) => {
    Alert.alert(
      "Eliminar Tarjeta",
      "¿Seguro que quieres eliminar esta tarjeta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteCard(id),
        },
      ]
    );
  };

  const deleteCard = async (id) => {
    try {
      const updated = cards.filter((c) => c.id !== id);
      setCards(updated);
      await saveCards(updated);
    } catch (error) {
      console.error("Error eliminando tarjeta:", error);
    }
  };

  // 💌 Render de cada tarjeta estilo post-it
  const renderCard = ({ item }) => {
    const isCuidador = item.creadoPor === "cuidador";
    const color = isCuidador ? "#FFF3CD" : "#D0F0C0"; // amarillo o verde
    const bordeColor = isCuidador ? "#FFB74D" : "#81C784";

    return (
      <TouchableOpacity
        style={[styles.postIt, { backgroundColor: color, borderLeftColor: bordeColor }]}
        onLongPress={() => handleDeleteCard(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.postItTipo}>
              {isCuidador ? "👨‍⚕️ Cuidador" : "🧠 Paciente"}
            </Text>
            <Text style={styles.postItDate}>{item.date}</Text>
          </View>

          <Text style={styles.postItMensaje}>{item.mensaje}</Text>
          <Text style={styles.postItTipoSecundario}>{item.tipo}</Text>
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
      {/* 🔹 Header */}
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

      {/* 🟨 Lista de tarjetas */}
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={
          cards.length === 0
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingBottom: 100 }
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay tarjetas todavía</Text>
        }
      />

      {/* ➕ Botón para añadir tarjeta */}
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
    borderRadius: 10,
    margin: 10,
    padding: 15,
    minHeight: 130,
    justifyContent: "space-between",
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    transform: [{ rotate: "-1deg" }],
  },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  postItTipo: {
    fontWeight: "bold",
    color: "#4E342E",
  },
  postItDate: {
    fontSize: 12,
    color: "#666",
  },
  postItMensaje: {
    fontSize: 15,
    color: "#333",
    fontStyle: "italic",
    marginVertical: 4,
  },
  postItTipoSecundario: {
    fontSize: 12,
    color: "#555",
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
    marginBottom: 50,
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
