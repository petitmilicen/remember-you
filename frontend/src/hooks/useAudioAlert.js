// src/hooks/useAudioAlert.js
import { useEffect, useState } from "react";
import { Audio } from "expo-av";

/**
 * Hook para reproducir sonidos (alertas, notificaciones, etc.)
 * Evita repetir lógica de carga y descarga de sonidos.
 */
export default function useAudioAlert() {
  const [sound, setSound] = useState(null);

  // Reproduce el sonido desde la ruta indicada
  const reproducirSonido = async (ruta) => {
    try {
      if (sound) {
        await sound.unloadAsync(); // descargar anterior
      }
      const { sound: nuevoSound } = await Audio.Sound.createAsync(ruta);
      setSound(nuevoSound);
      await nuevoSound.playAsync();
    } catch (error) {
      console.error("Error reproduciendo sonido:", error);
    }
  };

  // Descargar el sonido al desmontar hook
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return { reproducirSonido };
}
