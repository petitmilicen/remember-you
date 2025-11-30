import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  Vibration,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import ConfettiCannon from "react-native-confetti-cannon";
import MemoryCard from "../../components/MemoryCard";

const { width } = Dimensions.get("window");

const emojiSets = {
  frutas: ["🍎", "🍌", "🍇", "🍓", "🍉", "🍒", "🥝", "🍍", "🥥", "🍊"],
  animales: ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🐸", "🐧"],
  objetos: ["🎈", "🚗", "🚀", "📱", "💡", "🎮", "🎁", "🧩", "📚", "🔑"],
};

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

  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");
  const [emojiSet, setEmojiSet] = useState("frutas");
  const [musicEnabled, setMusicEnabled] = useState(true);

  const flipSound = useRef(null);
  const matchSound = useRef(null);
  const victorySound = useRef(null);
  const bgMusic = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const difficultySettings = {
    easy: 6,
    normal: 8,
    hard: 10,
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
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
        await sBg.setVolumeAsync(0.35);
        await sBg.setIsLoopingAsync(true);

        if (mounted) {
          flipSound.current = sFlip;
          matchSound.current = sMatch;
          victorySound.current = sVictory;
          bgMusic.current = sBg;
          if (musicEnabled) await sBg.playAsync();
        }
      } catch (e) {
        console.warn("Audio error:", e);
      }
    })();

    return () => {
      mounted = false;
      [flipSound, matchSound, victorySound, bgMusic].forEach((ref) => {
        const sound = ref.current;
        if (sound) {
          sound
            .getStatusAsync()
            .then((st) => {
              if (st?.isLoaded) sound.unloadAsync();
            })
            .catch(() => { });
        }
      });
    };
  }, []);

  const toggleMusic = async () => {
    const newState = !musicEnabled;
    setMusicEnabled(newState);
    try {
      if (newState) {
        await bgMusic.current?.playAsync();
      } else {
        await bgMusic.current?.pauseAsync();
      }
    } catch { }
  };

  const initGame = () => {
    const pairCount = difficultySettings[difficulty] ?? 8;
    const baseSet = emojiSets[emojiSet].slice(0, pairCount);
    const shuffled = [...baseSet, ...baseSet]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setShowConfetti(false);
    setMessage("");
    setStartTime(Date.now());
    setGameStarted(true);
  };

  const handleFlip = async (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    try {
      await flipSound.current?.replayAsync();
    } catch { }
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped.map((i) => cards.find((c) => c.id === i));
      if (first.emoji === second.emoji) {
        try {
          await matchSound.current?.replayAsync();
        } catch { }
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
      victorySound.current?.replayAsync();

      // Unlock achievement based on difficulty
      const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "normal" ? 2 : 3;
      const difficultyText = difficulty === "easy" ? "Fácil" : difficulty === "normal" ? "Normal" : "Difícil";

      import("../../api/achievementService").then(({ unlockAchievement }) => {
        unlockAchievement("memorice", difficultyLevel)
          .then(() => {
            // Notificación de logro desbloqueado
            setTimeout(() => {
              Alert.alert(
                "🏆 ¡Logro Desbloqueado!",
                `Has completado Memorice en dificultad ${difficultyText}`,
                [{ text: "¡Genial!" }]
              );
            }, 500);
          })
          .catch(err => console.error("Failed to unlock achievement:", err));
      });

      setTimeout(() => {
        Alert.alert(
          "🏆 ¡Victoria!",
          `Completaste el juego en ${moves} movimientos y ${duration} segundos.`,
          [
            { text: "Reintentar", onPress: initGame },
            { text: "Volver", onPress: () => setGameStarted(false) },
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

  const renderGame = () => (
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
        <TouchableOpacity onPress={() => setGameStarted(false)}>
          <FontAwesome5 name="arrow-alt-circle-left" size={26} color="#FFF" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { flex: 1, textAlign: "center" }]}>Memorice</Text>

        <TouchableOpacity onPress={toggleMusic}>
          <Ionicons
            name={musicEnabled ? "musical-notes" : "volume-mute"}
            size={26}
            color="#FFF"
          />
        </TouchableOpacity>
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


  const renderMenu = () => (
    <View style={styles.diffContainer}>
      {/* Header con botón de retroceso */}
      <LinearGradient
        colors={["#F93827", "#FF6B6B"]}
        style={[styles.menuHeader, { paddingTop: Platform.OS === "android" ? 40 : 10 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={26} color="#FFF" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { flex: 1, textAlign: "center" }]}>Memorice</Text>

        <View style={{ width: 26 }} />
      </LinearGradient>

      <View style={styles.diffContent}>
        <Text style={styles.diffTitle}>Selecciona la dificultad</Text>

        <View style={styles.tutorialBox}>
          <FontAwesome5 name="lightbulb" size={20} color="#F93827" />
          <Text style={styles.tutorialText}>
            Encuentra todas las parejas volteando dos cartas por turno. Observa, recuerda y
            planifica: si no coinciden, se voltearán de nuevo. ¡Entrena tu memoria!
          </Text>
        </View>

        {["easy", "normal", "hard"].map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[
              styles.diffButton,
              difficulty === lvl && { backgroundColor: "#F93827" },
            ]}
            onPress={() => setDifficulty(lvl)}
          >
            <Text
              style={[
                styles.diffText,
                { color: difficulty === lvl ? "#fff" : "#333" },
              ]}
            >
              {lvl === "easy" ? "Fácil" : lvl === "normal" ? "Normal" : "Difícil"}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.subTitle}>Tema de cartas</Text>
        <View style={styles.emojiRow}>
          {Object.keys(emojiSets).map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.emojiOption,
                emojiSet === key && { backgroundColor: "#F93827" },
              ]}
              onPress={() => setEmojiSet(key)}
            >
              <Text
                style={[
                  styles.emojiLabel,
                  { color: emojiSet === key ? "#fff" : "#333" },
                ]}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={initGame}>
          <Text style={styles.startText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {!gameStarted ? renderMenu() : renderGame()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, alignItems: "center", backgroundColor: "#EDEDED" },
  diffContainer: {
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "#fff",
    width: width,
    flex: 1,
  },
  menuHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  diffContent: {
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  diffTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F93827",
    marginBottom: 20,
  },
  tutorialBox: {
    backgroundColor: "#FFF5F5",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#FBC4C4",
  },
  tutorialText: { color: "#444", fontSize: 15, flex: 1, lineHeight: 20 },
  diffButton: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginVertical: 8,
  },
  diffText: { fontSize: 18, fontWeight: "600" },
  subTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#F93827",
    marginTop: 20,
    marginBottom: 8,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  emojiOption: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#E0E0E0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  emojiLabel: { fontSize: 16, fontWeight: "600" },
  startButton: {
    backgroundColor: "#F93827",
    padding: 15,
    borderRadius: 15,
    marginTop: 25,
    width: "100%",
    alignItems: "center",
  },
  startText: { color: "#fff", fontSize: 20, fontWeight: "bold" },

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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  grid: {
    width: width * 0.9,
    flexDirection: "row",
    flexWrap: "wrap",
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
  infoText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  resetText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },
  messageBox: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  messageText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F93827",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
