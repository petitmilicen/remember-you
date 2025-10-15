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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function PuzzleScreen({ navigation }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(null);
  const [moves, setMoves] = useState(0);

  const difficultySettings = {
    easy: { grid: 3, size: width - 40 },
    normal: { grid: 4, size: width - 40 },
    hard: { grid: 5, size: width - 40 },
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
          colors={["#F93827", "#FF6B6B"]}
          style={[
            styles.header,
            { paddingTop: Platform.OS === "android" ? 40 : 10 },
          ]}
        >
          <TouchableOpacity onPress={() => setGameStarted(false)}>
            <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rompecabezas</Text>
          <View style={{ width: 28 }} />
        </LinearGradient>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}> Movimientos: {moves}</Text>
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
                        ? "#C8E6C9"
                        : "#FFF4E0",
                      borderColor: "#999",
                      borderWidth: isEmpty ? 0 : 1,
                    },
                  ]}
                  onPress={() => pieceExists && handlePiecePress(position)}
                  disabled={isEmpty}
                >
                  {pieceExists && (
                    <Text
                      style={[
                        styles.pieceText,
                        {
                          color:
                            piece.currentPosition === piece.correctPosition
                              ? "#2E7D32"
                              : "#F93827",
                          fontSize: grid === 3 ? 20 : grid === 4 ? 18 : 16,
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

        <TouchableOpacity style={styles.resetButton} onPress={initializePuzzle}>
          <FontAwesome5 name="redo-alt" size={18} color="#fff" />
          <Text style={styles.resetText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDifficultySelector = () => (
    <View style={styles.diffContainer}>
      <Text style={styles.diffTitle}>Selecciona la dificultad</Text>
      <View style={styles.tutorialBox}>
        <FontAwesome5 name="lightbulb" size={20} color="#F93827" />
        <Text style={styles.tutorialText}>
          Mueve las piezas tocando una adyacente al espacio vacío. El objetivo
          es ordenar los números hasta formar la secuencia correcta. ¡Usa tu
          lógica y paciencia!
        </Text>
      </View>

      {[
        { lvl: "easy", label: "Fácil (3x3)" },
        { lvl: "normal", label: "Normal (4x4)" },
        { lvl: "hard", label: "Difícil (5x5)" },
      ].map(({ lvl, label }) => (
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
            {label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.startButton} onPress={initializePuzzle}>
        <Text style={styles.startText}>🎯 Comenzar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {!gameStarted ? renderDifficultySelector() : renderPuzzleGame()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, alignItems: "center", backgroundColor: "#EDEDED" },
  container: { flex: 1, alignItems: "center", backgroundColor: "#EDEDED" },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold" },

  infoBox: {
    width: width * 0.9,
    backgroundColor: "#F93827",
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  instructions: {
    fontSize: 15,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },

  puzzleBoard: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
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

  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  resetText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },

  diffContainer: {
    alignItems: "center",
    marginTop: 60,
    backgroundColor: "#fff",
    width: width * 0.9,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
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
  tutorialText: {
    color: "#444",
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
  diffButton: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginVertical: 8,
  },
  diffText: { fontSize: 18, fontWeight: "600" },
  startButton: {
    backgroundColor: "#F93827",
    padding: 15,
    borderRadius: 15,
    marginTop: 25,
    width: "100%",
    alignItems: "center",
  },
  startText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
