import { Alert } from "react-native";
import { deleteMemory } from "../api/memoryService";

export default function useDetalleRecuerdo(navigation, memory) {
  const handleDelete = () => {
    Alert.alert("Eliminar Recuerdo", "¿Seguro que quieres eliminar este recuerdo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMemory(memory.memory_id);
            navigation.goBack();
          } catch (error) {
            console.error("Error eliminando recuerdo:", error);
            Alert.alert("Error", "No se pudo eliminar el recuerdo");
          }
        },
      },
    ]);
  };

  return { handleDelete };
}
