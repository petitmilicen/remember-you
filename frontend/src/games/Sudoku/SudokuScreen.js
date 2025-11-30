import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Magic Gradient (Peach to Pink)
const gradientColors = ["#ff9a9e", "#fecfef"];

export default function SudokuScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [difficulty, setDifficulty] = useState("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);

  const difficultySettings = {
    easy: { cellsToRemove: 40, maxMistakes: 5, label: "Fácil" },
    normal: { cellsToRemove: 50, maxMistakes: 3, label: "Normal" },
    hard: { cellsToRemove: 60, maxMistakes: 1, label: "Difícil" },
  };

  const generateSudoku = () => {
    const emptyBoard = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    solveSudoku(emptyBoard);
    const solvedBoard = emptyBoard.map((r) => [...r]);
    const gameBoard = solvedBoard.map((r) => [...r]);
    removeCells(gameBoard, difficultySettings[difficulty].cellsToRemove);
    setBoard(gameBoard);
    setSolution(solvedBoard);
    setInitialBoard(gameBoard.map((r) => [...r]));
    setSelectedCell(null);
    setMistakes(0);
    setTimer(0);
  };

  const solveSudoku = (board) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(
            () => Math.random() - 0.5
          );
          for (let num of nums) {
            if (isValid(board, r, c, num)) {
              board[r][c] = num;
              if (solveSudoku(board)) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const isValid = (board, row, col, num) => {
    for (let i = 0; i < 9; i++)
      if (board[row][i] === num || board[i][col] === num) return false;
    const sr = row - (row % 3);
    const sc = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (board[sr + i][sc + j] === num) return false;
    return true;
  };

  const removeCells = (board, count) => {
    let removed = 0;
    while (removed < count) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (board[r][c] !== 0) {
        board[r][c] = 0;
        removed++;
      }
    }
  };

  const startGame = () => {
    generateSudoku();
    setGameStarted(true);
  };

  const handleCellPress = (r, c) => {
    if (initialBoard[r][c] === 0) setSelectedCell({ r, c });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const newBoard = board.map((row) => [...row]);

    if (num === solution[r][c]) {
      newBoard[r][c] = num;
      setBoard(newBoard);
      if (isComplete(newBoard)) {
        // Unlock achievement
        const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "normal" ? 2 : 3;
        const difficultyText = difficultySettings[difficulty].label;

        import("../../api/achievementService").then(({ unlockAchievement }) => {
          unlockAchievement("sudoku", difficultyLevel)
            .then(() => {
              setTimeout(() => {
                Alert.alert(
                  "🏆 ¡Logro Desbloqueado!",
                  `Has completado Sudoku en dificultad ${difficultyText}`,
                  [{ text: "¡Genial!" }]
                );
              }, 500);
            })
            .catch(err => console.error("Failed to unlock achievement:", err));
        });

        Alert.alert(
          "🎉 ¡Felicidades!",
          `Completaste el Sudoku en ${formatTime(timer)}.`,
          [
            { text: "Jugar de nuevo", onPress: startGame },
            { text: "Volver", onPress: () => setGameStarted(false) },
          ]
        );
      }
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= difficultySettings[difficulty].maxMistakes) {
        Alert.alert("💀 Game Over", "Has alcanzado el máximo de errores.", [
          { text: "Reintentar", onPress: startGame },
          { text: "Volver", onPress: () => setGameStarted(false) },
        ]);
      } else {
        Alert.alert(
          "Incorrecto",
          `Te quedan ${difficultySettings[difficulty].maxMistakes - newMistakes
          } intentos.`
        );
      }
    }

    setSelectedCell(null);
  };

  const isComplete = (b) =>
    b.every((r, i) => r.every((v, j) => v === solution[i][j]));

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    let t;
    if (gameStarted) t = setInterval(() => setTimer((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [gameStarted]);

  const renderCell = (r, c) => {
    const v = board[r]?.[c] || 0;
    const init = initialBoard[r]?.[c] !== 0;
    const sel = selectedCell?.r === r && selectedCell?.c === c;
    const wrong = v !== 0 && v !== solution[r]?.[c];

    const borderTop = r % 3 === 0 ? 2 : 0.5;
    const borderLeft = c % 3 === 0 ? 2 : 0.5;
    const borderBottom = r === 8 ? 2 : (r + 1) % 3 === 0 ? 2 : 0.5;
    const borderRight = c === 8 ? 2 : (c + 1) % 3 === 0 ? 2 : 0.5;

    return (
      <TouchableOpacity
        key={`${r}-${c}`}
        style={[
          styles.cell,
          {
            borderTopWidth: borderTop,
            borderLeftWidth: borderLeft,
            borderBottomWidth: borderBottom,
            borderRightWidth: borderRight,
            backgroundColor: sel
              ? "#FFF0F5" // Light pink for selection
              : wrong
                ? "#FFD1D1"
                : init
                  ? "#F9F9F9"
                  : "#FFFFFF",
            borderColor: "#ff9a9e", // Magic pink for borders
          },
        ]}
        onPress={() => handleCellPress(r, c)}
        disabled={init}
      >
        <Text
          style={[
            styles.cellText,
            { color: init ? "#333" : wrong ? "#D32F2F" : "#ff9a9e" },
          ]}
        >
          {v !== 0 ? v : ""}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderNumberPad = () => (
    <View style={styles.numberPad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <TouchableOpacity
          key={n}
          style={styles.numberButton}
          onPress={() => handleNumberInput(n)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradientColors}
            style={styles.numberButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.numberButtonText}>{n}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGame = () => (
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
          <Text style={styles.headerTitle}>Sudoku</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <FontAwesome5 name="clock" size={16} color="#ff9a9e" style={{ marginBottom: 4 }} />
            <Text style={styles.infoValue}>{formatTime(timer)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <FontAwesome5 name="times-circle" size={16} color="#ff9a9e" style={{ marginBottom: 4 }} />
            <Text style={styles.infoValue}>
              {mistakes}/{difficultySettings[difficulty].maxMistakes}
            </Text>
          </View>
        </View>

        <View style={styles.sudokuBoard}>
          {board.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((_, j) => renderCell(i, j))}
            </View>
          ))}
        </View>

        {renderNumberPad()}

        <TouchableOpacity style={styles.resetBtnContainer} onPress={startGame}>
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
          <Text style={styles.headerTitle}>Sudoku</Text>
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
              Llena todas las celdas con números del 1 al 9 sin repetir en la misma fila, columna o bloque. ¡Diviértete!
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

        <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.8}>
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
    justifyContent: "space-around",
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
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#EEE",
  },
  sudokuBoard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  row: { flexDirection: "row" },
  cell: {
    width: (width - 60) / 9,
    height: (width - 60) / 9,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: { fontSize: 18, fontWeight: "bold" },
  numberPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
    marginBottom: 20,
    gap: 10,
  },
  numberButton: {
    width: (width - 100) / 5,
    height: (width - 100) / 5,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numberButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  numberButtonText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
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
