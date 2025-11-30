import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Magic Gradient (Peach to Pink)
const gradientColors = ["#ff9a9e", "#fecfef"];

export default function PuzzleScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [difficulty, setDifficulty] = useState("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(null);
  const [moves, setMoves] = useState(0);

  const difficultySettings = {
    easy: { grid: 3, size: width - 40, label: "Fácil (3x3)" },
    normal: { grid: 4, size: width - 40, label: "Normal (4x4)" },
    hard: { grid: 5, size: width - 40, label: "Difícil (5x5)" },
  };

  const initializePuzzle = () => {
    const { grid } = difficultySettings[difficulty];
    const total = grid * grid;

    const pieces = [];
    for (let i = 0; i < total - 1; i++) {
      pieces.push({
        id: i,
        number: i + 1,
        currentPosition: i,
        correctPosition: i,
      });
    }

    const emptyPos = total - 1;
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = tmp;
    }

    setPuzzlePieces(shuffled);
    setEmptyIndex(emptyPos);
    setMoves(0);
    setGameStarted(true);
  };

  const isAdjacent = (p1, p2, grid) => {
    const r1 = Math.floor(p1 / grid);
    const c1 = p1 % grid;
    const r2 = Math.floor(p2 / grid);
    const c2 = p2 % grid;
    return (
      (Math.abs(r1 - r2) === 1 && c1 === c2) ||
      (Math.abs(c1 - c2) === 1 && r1 === r2)
    );
  };

  const handlePiecePress = (pos) => {
    const { grid } = difficultySettings[difficulty];
    if (!isAdjacent(pos, emptyIndex, grid)) return;

    const newPieces = [...puzzlePieces];
    const pieceIndex = newPieces.findIndex((p) => p.currentPosition === pos);
    if (pieceIndex === -1) return;

    newPieces[pieceIndex].currentPosition = emptyIndex;
    setPuzzlePieces(newPieces);
    setEmptyIndex(pos);

    const newMoves = moves + 1;
    setMoves(newMoves);

    setTimeout(() => checkPuzzleSolved(newPieces, pos, newMoves), 50);
  };

  const checkPuzzleSolved = (pieces, newEmptyPos, moveCount) => {
    const grid = difficultySettings[difficulty].grid;
    const total = grid * grid;

    const allCorrect = pieces.every(
      (p) => p.currentPosition === p.correctPosition
    );
    const emptyCorrect = newEmptyPos === total - 1;

    if (allCorrect && emptyCorrect) {
      // Unlock achievement
      const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "normal" ? 2 : 3;
      const difficultyText = difficultySettings[difficulty].label;

      import("../../api/achievementService").then(({ unlockAchievement }) => {
        unlockAchievement("puzzle", difficultyLevel)
          .then((data) => {
            if (data && !data.message) {
              setTimeout(() => {
                Alert.alert(
                  "🏆 ¡Logro Desbloqueado!",
                  `Has completado el Rompecabezas en dificultad ${difficultyText}`,
                  [{ text: "¡Genial!" }]
                );
              }, 500);
            }
          })
          .catch(err => console.error("Failed to unlock achievement:", err));
      });

      Alert.alert(
        "🎉 ¡Excelente!",
        `Completaste el rompecabezas en ${moveCount} movimientos.`,
        [
          { text: "Jugar de nuevo", onPress: initializePuzzle },
          { text: "Volver al menú", onPress: () => setGameStarted(false) },
        ]
      );
    }
  };

  const renderPuzzleGame = () => {
    const { grid, size } = difficultySettings[difficulty];
    const total = grid * grid;
    const pieceSize = size / grid;

    return (
      <View style={styles.container}>
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
            <Text style={styles.headerTitle}>Rompecabezas</Text>
            <View style={{ width: 45 }} />
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoBox}>
            <View style={styles.infoItem}>
              <FontAwesome5 name="arrows-alt" size={16} color="#ff9a9e" style={{ marginBottom: 4 }} />
              <Text style={styles.infoValue}>{moves} Movimientos</Text>
            </View>
          </View>

          <Text style={styles.instructions}>
            Toca una pieza adyacente al espacio vacío para moverla.
          </Text>

          <View
            style={[
              styles.puzzleBoard,
              { width: size, height: size, backgroundColor: "#fff" },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: size,
                height: size,
              }}
            >
              {Array.from({ length: total }).map((_, position) => {
                const piece = puzzlePieces.find(
                  (p) => p.currentPosition === position
                );
                const isEmpty = position === emptyIndex;
                const pieceExists = piece && !isEmpty;

                return (
                  <TouchableOpacity
                    key={position}
                    style={[
                      styles.puzzlePiece,
                      {
                        width: pieceSize,
                        height: pieceSize,
                        backgroundColor: isEmpty
                          ? "transparent"
                          : piece.currentPosition === piece.correctPosition
                            ? "#C8E6C9" // Green for correct
                            : "#FFF0F5", // Light pink for incorrect
                        borderColor: "#ff9a9e",
                        borderWidth: isEmpty ? 0 : 1,
                      },
                    ]}
                    onPress={() => pieceExists && handlePiecePress(position)}
                    disabled={isEmpty}
                    activeOpacity={0.8}
                  >
                    {pieceExists && (
                      <Text
                        style={[
                          styles.pieceText,
                          {
                            color:
                              piece.currentPosition === piece.correctPosition
                                ? "#2E7D32"
                                : "#ff9a9e",
                            fontSize: grid === 3 ? 24 : grid === 4 ? 20 : 18,
                          },
                        ]}
                      >
                        {piece.number}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text style={styles.objectiveText}>
            Objetivo: Ordena los números del 1 al {total - 1}.
          </Text>

          <TouchableOpacity style={styles.resetBtnContainer} onPress={initializePuzzle}>
            <LinearGradient
              colors={gradientColors}
              style={styles.resetBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <FontAwesome5 name="redo-alt" size={16} color="#fff" />
              <Text style={styles.resetText}>Reiniciar</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  };

  const renderDifficultySelector = () => (
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
          <Text style={styles.headerTitle}>Rompecabezas</Text>
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
              Mueve las piezas tocando una adyacente al espacio vacío. El objetivo
              es ordenar los números hasta formar la secuencia correcta.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dificultad</Text>
        <View style={styles.optionsRow}>
          {Object.keys(difficultySettings).map((lvl) => (
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
                {difficultySettings[lvl].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={initializePuzzle} activeOpacity={0.8}>
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
      {!gameStarted ? renderDifficultySelector() : renderPuzzleGame()}
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
  gameContent: {
    alignItems: "center",
    paddingTop: 20,
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
  infoBox: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoItem: {
    alignItems: "center",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  instructions: {
    fontSize: 15,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  puzzleBoard: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 3,
    borderColor: "#ff9a9e",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  puzzlePiece: {
    justifyContent: "center",
    alignItems: "center",
  },
  pieceText: { fontWeight: "bold" },
  objectiveText: {
    color: "#888",
    marginVertical: 10,
    fontSize: 14,
    textAlign: "center",
  },
  resetBtnContainer: {
    marginTop: 10,
    borderRadius: 25,
    shadowColor: "#ff9a9e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  resetText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
});
