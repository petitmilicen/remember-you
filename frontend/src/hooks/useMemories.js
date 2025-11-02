import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export default function useMemories() {
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

  const deleteMemory = async (id) => {
    try {
      const stored = await AsyncStorage.getItem("imageMemories");
      const updated = stored ? JSON.parse(stored).filter((m) => m.id !== id) : [];
      setMemories(updated);
      await AsyncStorage.setItem("imageMemories", JSON.stringify(updated));
    } catch (error) {
      console.error("Error eliminando recuerdo:", error);
    }
  };

  return { memories, setMemories, deleteMemory };
}
