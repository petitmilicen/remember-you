import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Platform, Vibration, Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import ConfettiCannon from "react-native-confetti-cannon";
import MemoryCard from "../../components/MemoryCard";

const { width } = Dimensions.get("window");
const emojis = ["🍎", "🍌", "🍇", "🍓", "🍉", "🍒", "🥝", "🍍"];
const messages = [
  "¡Excelente memoria! 💪",
  "¡Sigue así! 🌟",
  "¡Muy bien hecho! 🎯",
  "¡Tu mente brilla! ✨",
  "¡Impresionante! 🧠",
  "¡Eres un genio! 🔥",
];

export default function MemoriceScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const flipSound = useRef(null);
  const matchSound = useRef(null);
  const victorySound = useRef(null);
  const bgMusic = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        const sFlip = new Audio.Sound();
        const sMatch = new Audio.Sound();
        const sVictory = new Audio.Sound();
        const sBg = new Audio.Sound();

        await Promise.all([
          sFlip.loadAsync(require("../../assets/sounds/flip.mp3")),
          sMatch.loadAsync(require("../../assets/sounds/match.mp3")),
          sVictory.loadAsync(require("../../assets/sounds/victory.mp3")),
          sBg.loadAsync(require("../../assets/sounds/bgmusic.mp3")),
        ]);

        await sFlip.setVolumeAsync(0.7);
        await sMatch.setVolumeAsync(0.8);
        await sVictory.setVolumeAsync(0.8);
        await sBg.setVolumeAsync(0.4);
        await sBg.setIsLoopingAsync(true);
        await sBg.playAsync();

        if (mounted) {
          flipSound.current = sFlip;
          matchSound.current = sMatch;
          victorySound.current = sVictory;
          bgMusic.current = sBg;
        }
      } catch (e) {
        console.warn("Audio error:", e);
      }
    })();

    return () => {
      mounted = false;

      const stopAndUnload = (sound) => {
        if (!sound) return;
        sound
          .getStatusAsync?.()
          .then((st) => {
            if (!st?.isLoaded) return;
            const stopP = st.isPlaying ? sound.stopAsync?.() : Promise.resolve();
            return stopP?.catch(() => {}).finally(() => sound.unloadAsync?.().catch(() => {}));
          })
          .catch(() => {});
      };

      stopAndUnload(bgMusic.current);
      stopAndUnload(flipSound.current);
      stopAndUnload(matchSound.current);
      stopAndUnload(victorySound.current);
    };
  }, []);

  const initGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setShowConfetti(false);
    setMessage("");
    setStartTime(Date.now());

    if (bgMusic.current?.getStatusAsync) {
      bgMusic.current
        .getStatusAsync()
        .then((st) => {
          if (st?.isLoaded && !st.isPlaying) {
            return bgMusic.current.playAsync();
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleFlip = async (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    try {
      await flipSound.current?.replayAsync();
    } catch {}

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped.map((i) => cards.find((c) => c.id === i));

      if (first.emoji === second.emoji) {
        try {
          await matchSound.current?.replayAsync();
        } catch {}
        showMessage(messages[Math.floor(Math.random() * messages.length)]);
        setMatched((m) => [...m, first.id, second.id]);
        setFlipped([]);
      } else {
        Vibration.vibrate(100);
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      setShowConfetti(true);
      showMessage("¡Increíble! 🏆 Completaste el juego 🎉");

      (async () => {
        try {
          await bgMusic.current?.pauseAsync();
          await victorySound.current?.replayAsync();
        } catch {}
      })();

      setTimeout(() => {
        Alert.alert(
          "🏆 ¡Victoria!",
          `Completaste el juego en ${moves} movimientos y ${duration} segundos.`,
          [
            { text: "Reintentar", onPress: initGame },
            { text: "Volver", onPress: () => navigation.goBack() },
          ]
        );
      }, 600);
    }
  }, [matched]);

  const showMessage = (text) => {
    setMessage(text);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => setMessage(""));
  };

  return (
    <View style={styles.container}>
      {showConfetti && <ConfettiCannon count={150} origin={{ x: width / 2, y: 0 }} fadeOut />}

      {message ? (
        <Animated.View style={[styles.messageBox, { opacity: fadeAnim }]}>
          <Text style={styles.messageText}>{message}</Text>
        </Animated.View>
      ) : null}

      <LinearGradient
        colors={["#F93827", "#FF6B6B"]}
        style={[styles.header, { paddingTop: Platform.OS === "android" ? 40 : 10 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>Memorice</Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <View style={styles.grid}>
        {cards.map((card, i) => (
          <MemoryCard
            key={card.id}
            index={i}
            emoji={card.emoji}
            isFlipped={flipped.includes(card.id)}
            isMatched={matched.includes(card.id)}
            onPress={() => handleFlip(card.id)}
          />
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Movimientos: {moves}</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={initGame}>
          <FontAwesome5 name="redo-alt" size={18} color="#fff" />
          <Text style={styles.resetText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "space-between",
    backgroundColor: "#EDEDED", 
    paddingBottom: Platform.OS === "android" ? 40 : 20, 
  },
  header: { 
    width: "100%", 
    flexDirection: "row", 
    alignItems: "center", justifyContent: "space-between", 
    paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, elevation: 5, 
  },
  headerTitle: { 
    color: "#FFF", 
    fontSize: 24, 
    fontWeight: "bold" 
  },
  grid: {
     width: width * 0.9, 
     flexDirection: "row", flexWrap: "wrap", 
     justifyContent: "center", 
     alignItems: "center", 
     marginTop: 20, 
    },
  infoBox: { 
    width: width * 0.9, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    backgroundColor: "#F93827", 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    marginBottom: 10,
    borderRadius: 20,
   },
  infoText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
  resetBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#FF6B6B", 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 12 
  },
  resetText: { 
    color: "#fff", 
    fontWeight: "bold",
    marginLeft: 6 
    },
  messageBox: { 
    position: "absolute", 
    top: "45%", 
    left: 0, 
    right: 0, 
    alignItems: "center", 
    zIndex: 10 
  },
  messageText: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#F93827", 
    backgroundColor: "rgba(255,255,255,0.85)", 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20 },
});
