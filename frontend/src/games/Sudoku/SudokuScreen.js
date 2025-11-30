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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function SudokuScreen({ navigation }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);

  const difficultySettings = {
    easy: { cellsToRemove: 40, maxMistakes: 5 },
    normal: { cellsToRemove: 50, maxMistakes: 3 },
    hard: { cellsToRemove: 60, maxMistakes: 1 },
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
        const difficultyText = difficulty === "easy" ? "Fácil" : difficulty === "normal" ? "Normal" : "Difícil";

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

    const borderTop = r % 3 === 0 ? 3 : 1;
    const borderLeft = c % 3 === 0 ? 3 : 1;
    const borderBottom = r === 8 ? 3 : (r + 1) % 3 === 0 ? 3 : 1;
    const borderRight = c === 8 ? 3 : (c + 1) % 3 === 0 ? 3 : 1;

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
              ? "#FFF4E0"
              : wrong
                ? "#FFD1D1"
                : init
                  ? "#F5F5F5"
                  : "#FFFFFF",
          },
        ]}
        onPress={() => handleCellPress(r, c)}
        disabled={init}
      >
        <Text
          style={[
            styles.cellText,
            { color: init ? "#000" : wrong ? "#D32F2F" : "#F93827" },
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
        >
          <Text style={styles.numberButtonText}>{n}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGame = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={["#F93827", "#FF6B6B"]}
        style={[styles.header, { paddingTop: Platform.OS === "android" ? 40 : 10 }]}
      >
        <TouchableOpacity onPress={() => setGameStarted(false)}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>
            Sudoku
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>⏱ {formatTime(timer)}</Text>
        <Text style={styles.infoText}>
          😵 {mistakes}/{difficultySettings[difficulty].maxMistakes}
        </Text>
      </View>

      <View style={styles.sudokuBoard}>
        {board.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((_, j) => renderCell(i, j))}
          </View>
        ))}
      </View>

      {renderNumberPad()}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={startGame}>
          <FontAwesome5 name="redo-alt" size={18} color="#fff" />
          <Text style={styles.controlText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDifficulty = () => (
    <View style={styles.diffContainer}>
      {/* Header con botón de retroceso */}
      <LinearGradient
        colors={["#F93827", "#FF6B6B"]}
        style={[styles.menuHeader, { paddingTop: Platform.OS === "android" ? 40 : 10 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={26} color="#FFF" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { flex: 1, textAlign: "center" }]}>Sudoku</Text>

        <View style={{ width: 26 }} />
      </LinearGradient>

      <View style={styles.diffContent}>
        <Text style={styles.diffTitle}>Selecciona la dificultad</Text>

        <View style={styles.tutorialBox}>
          <FontAwesome5 name="lightbulb" size={20} color="#F93827" />
          <Text style={styles.tutorialText}>
            El objetivo del Sudoku es llenar todas las celdas con números del 1 al
            9 sin repetir en la misma fila, columna o bloque. ¡Piensa con calma y
            diviértete!
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
              {lvl === "easy"
                ? "Fácil"
                : lvl === "normal"
                  ? "Normal"
                  : "Difícil"}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startText}> Comenzar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {!gameStarted ? renderDifficulty() : renderGame()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, alignItems: "center", backgroundColor: "#EDEDED" },
  container: { flex: 1, alignItems: "center", backgroundColor: "#EDEDED" },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  infoBox: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F93827",
    padding: 12,
    borderRadius: 20,
    marginVertical: 10,
  },
  infoText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  sudokuBoard: {
    backgroundColor: "#000",
    borderWidth: 3,
    borderColor: "#000",
    marginVertical: 20,
  },
  row: { flexDirection: "row" },
  cell: {
    width: (width - 80) / 9,
    height: (width - 80) / 9,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
  },
  cellText: { fontSize: 16, fontWeight: "bold" },
  numberPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  numberButton: {
    width: 60,
    height: 60,
    backgroundColor: "#F93827",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    margin: 5,
  },
  numberButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  controls: {
    width: width * 0.9,
    alignItems: "center",
    marginBottom: 20,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  controlText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
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
