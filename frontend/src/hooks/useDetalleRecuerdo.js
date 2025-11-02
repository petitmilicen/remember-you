import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export default function useDetalleRecuerdo(navigation, memory) {
  const handleDelete = () => {
    Alert.alert("Eliminar Recuerdo", "¿Seguro que quieres eliminar este recuerdo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem("imageMemories");
            const updated = stored
              ? JSON.parse(stored).filter((m) => m.id !== memory.id)
              : [];
            await AsyncStorage.setItem("imageMemories", JSON.stringify(updated));
            navigation.goBack();
          } catch (error) {
            console.error("Error eliminando recuerdo:", error);
          }
        },
      },
    ]);
  };

  return { handleDelete };
}
