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
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import ConfettiCannon from "react-native-confetti-cannon";
import MemoryCard from "../../components/MemoryCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FadeInDown, FadeInUp } from "react-native-reanimated"; // Import reanimated animations if needed, but here we use Animated API for legacy compatibility or switch to reanimated fully.
// Note: The original code used Animated from react-native. I will stick to that for internal logic but use the style of the new design.

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
  const insets = useSafeAreaInsets();
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

  // Magic Gradient (Peach to Pink)
  const gradientColors = ["#ff9a9e", "#fecfef"];

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

      const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "normal" ? 2 : 3;
      const difficultyText = difficulty === "easy" ? "Fácil" : difficulty === "normal" ? "Normal" : "Difícil";

      import("../../api/achievementService").then(({ unlockAchievement }) => {
        unlockAchievement("memorice", difficultyLevel)
          .then((data) => {
            if (data && !data.message) {
              setTimeout(() => {
                Alert.alert(
                  "🏆 ¡Logro Desbloqueado!",
                  `Has completado Memorice en dificultad ${difficultyText}`,
                  [{ text: "¡Genial!" }]
                );
              }, 500);
            }
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
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => setGameStarted(false)} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={45} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Memorice</Text>
          <TouchableOpacity onPress={toggleMusic} style={styles.musicButton}>
            <Ionicons
              name={musicEnabled ? "musical-notes" : "volume-mute"}
              size={28}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {cards.map((card, i) => (
            <MemoryCard
              key={card.id}
              index={i}
              emoji={card.emoji}
              isFlipped={flipped.includes(card.id)}
              isMatched={matched.includes(card.id)}
              onPress={() => handleFlip(card.id)}
              gradientColors={gradientColors}
            />
          ))}
        </View>
      </View>

      <View style={[styles.infoBox, { marginBottom: insets.bottom + 20 }]}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Movimientos</Text>
          <Text style={styles.infoValue}>{moves}</Text>
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={initGame}>
          <FontAwesome5 name="redo-alt" size={16} color="#fff" />
          <Text style={styles.resetText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  const renderMenu = () => (
    <View style={styles.menuContainer}>
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
          <Text style={styles.headerTitle}>Memorice</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.menuContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.tutorialBox}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="lightbulb" size={20} color="#ff9a9e" />
            </View>
            <Text style={styles.tutorialText}>
              Encuentra todas las parejas volteando dos cartas por turno. ¡Entrena tu memoria!
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dificultad</Text>
        <View style={styles.optionsRow}>
          {["easy", "normal", "hard"].map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[
                styles.optionButton,
                difficulty === lvl && { backgroundColor: "#ff9a9e", borderColor: "#ff9a9e" },
              ]}
              onPress={() => setDifficulty(lvl)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: difficulty === lvl ? "#fff" : "#666" },
                ]}
              >
                {lvl === "easy" ? "Fácil" : lvl === "normal" ? "Normal" : "Difícil"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Tema</Text>
        <View style={styles.optionsRow}>
          {Object.keys(emojiSets).map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.optionButton,
                emojiSet === key && { backgroundColor: "#ff9a9e", borderColor: "#ff9a9e" },
              ]}
              onPress={() => setEmojiSet(key)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: emojiSet === key ? "#fff" : "#666" },
                ]}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={initGame} activeOpacity={0.8}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.startText}>Comenzar Juego</Text>
            <Ionicons name="play-circle" size={24} color="#FFF" style={{ marginLeft: 10 }} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {!gameStarted ? renderMenu() : renderGame()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  menuContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
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
    width: "100%",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 28,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuContent: {
    padding: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tutorialBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF0F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  tutorialText: {
    flex: 1,
    color: "#555",
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginLeft: 5,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionText: {
    fontWeight: "600",
    fontSize: 14,
  },
  startButton: {
    marginTop: 10,
    borderRadius: 25,
    shadowColor: "#ff9a9e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  startText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  gridContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  infoBox: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoItem: {
    alignItems: "flex-start",
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff9a9e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  resetText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  messageBox: {
    position: "absolute",
    top: "15%",
    zIndex: 20,
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
  },
  messageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    backgroundColor: "rgba(255, 154, 158, 0.95)",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
