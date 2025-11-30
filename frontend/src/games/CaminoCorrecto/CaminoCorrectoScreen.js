import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
  Vibration,
  Alert,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Canvas, Group, Rect, Circle } from "@shopify/react-native-skia";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_W } = Dimensions.get("window");
const WRAP_PAD = 16;
const BOARD_SIZE = Math.min(SCREEN_W * 0.9, 440);

const COL_APP_BG = "#F5F5F5";
const COL_CARD = "#FFFFFF";
const COL_WALL = "#ff9a9e"; // Magic Pink for walls
const COL_PLAYER = "#FFE066";
const COL_ORB = "#00FFF5";
const COL_PORTAL_OUT = "#C86BFA";
const COL_PORTAL_IN = "#A43FF0";

// Magic Gradient (Peach to Pink)
const gradientColors = ["#ff9a9e", "#fecfef"];

const DIFFS = {
  FACIL: { size: 7, orbs: 5, color: "#4CAF50", label: "Fácil" },
  NORMAL: { size: 11, orbs: 7, color: "#FF9800", label: "Normal" },
  DIFICIL: { size: 15, orbs: 10, color: "#F44336", label: "Difícil" },
};

const DIRS = { up: [-1, 0], right: [0, 1], down: [1, 0], left: [0, -1] };

function initGrid(n) {
  return Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => ({
      r,
      c,
      visited: false,
      walls: { top: true, right: true, bottom: true, left: true },
    }))
  );
}

function unvisitedNeighbors(grid, r, c) {
  const g = grid, N = g.length, out = [];
  if (r > 0 && !g[r - 1][c].visited) out.push(g[r - 1][c]);
  if (r < N - 1 && !g[r + 1][c].visited) out.push(g[r + 1][c]);
  if (c > 0 && !g[r][c - 1].visited) out.push(g[r][c - 1]);
  if (c < N - 1 && !g[r][c + 1].visited) out.push(g[r][c + 1]);
  return out;
}

function knock(a, b) {
  const dr = b.r - a.r, dc = b.c - a.c;
  if (dr === -1) { a.walls.top = false; b.walls.bottom = false; }
  else if (dr === 1) { a.walls.bottom = false; b.walls.top = false; }
  else if (dc === -1) { a.walls.left = false; b.walls.right = false; }
  else if (dc === 1) { a.walls.right = false; b.walls.left = false; }
}

function generatePerfectMaze(n) {
  const grid = initGrid(n);
  const stack = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const nb = unvisitedNeighbors(grid, cur.r, cur.c);
    if (nb.length) {
      const next = nb[Math.floor(Math.random() * nb.length)];
      knock(cur, next);
      next.visited = true;
      stack.push(next);
    } else stack.pop();
  }
  return grid;
}

function openNeighbors(maze, r, c) {
  const N = maze.length;
  const cell = maze[r][c];
  const res = [];
  if (!cell.walls.top && r > 0) res.push({ r: r - 1, c });
  if (!cell.walls.right && c < N - 1) res.push({ r, c: c + 1 });
  if (!cell.walls.bottom && r < N - 1) res.push({ r: r + 1, c });
  if (!cell.walls.left && c > 0) res.push({ r, c: c - 1 });
  return res;
}

function degree(maze, r, c) {
  return openNeighbors(maze, r, c).length;
}

function bfs(maze, start) {
  const q = [start];
  const seen = new Set([`${start.r},${start.c}`]);
  const prev = new Map();
  while (q.length) {
    const { r, c } = q.shift();
    for (const n of openNeighbors(maze, r, c)) {
      const key = `${n.r},${n.c}`;
      if (!seen.has(key)) {
        seen.add(key);
        prev.set(key, `${r},${c}`);
        q.push(n);
      }
    }
  }
  return { seen, prev };
}

function shortestPath(prev, goal) {
  const goalKey = `${goal.r},${goal.c}`;
  const path = [];
  let cur = goalKey;
  while (cur && prev.has(cur)) {
    const [r, c] = cur.split(",").map(Number);
    path.push({ r, c });
    cur = prev.get(cur);
  }
  if (cur) {
    const [r0, c0] = cur.split(",").map(Number);
    path.push({ r: r0, c: c0 });
  }
  return path.reverse();
}

function ensureMinDegree(maze, allow = new Set(), maxPasses = 6) {
  const N = maze.length;
  const neighborsDirs = (r, c) => {
    const list = [];
    if (r > 0) list.push({ r: r - 1, c, dir: "top" });
    if (c < N - 1) list.push({ r, c: c + 1, dir: "right" });
    if (r < N - 1) list.push({ r: r + 1, c, dir: "bottom" });
    if (c > 0) list.push({ r, c: c - 1, dir: "left" });
    return list;
  };
  const openBetween = (r, c, n) => {
    const here = maze[r][c];
    const there = maze[n.r][n.c];
    if (n.dir === "top") { here.walls.top = false; there.walls.bottom = false; }
    else if (n.dir === "right") { here.walls.right = false; there.walls.left = false; }
    else if (n.dir === "bottom") { here.walls.bottom = false; there.walls.top = false; }
    else if (n.dir === "left") { here.walls.left = false; there.walls.right = false; }
  };

  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = false;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const key = `${r},${c}`;
        if (allow.has(key)) continue;
        if (degree(maze, r, c) >= 2) continue;
        const options = neighborsDirs(r, c).filter((n) => {
          const w = maze[r][c].walls;
          return (n.dir === "top" && w.top) || (n.dir === "right" && w.right) || (n.dir === "bottom" && w.bottom) || (n.dir === "left" && w.left);
        });
        if (options.length) {
          openBetween(r, c, options[0]);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
  return maze;
}

function placeOrbsAlongPath(maze, count) {
  const N = maze.length;
  const start = { r: 0, c: 0 };
  const goal = { r: N - 1, c: N - 1 };
  const { prev, seen } = bfs(maze, start);
  if (!seen.has(`${goal.r},${goal.c}`)) return [];
  const path = shortestPath(prev, goal);
  if (path.length <= 2 || count <= 0) return [];
  const spacing = Math.max(3, Math.floor(path.length / (count + 1)));
  const orbs = [];
  let lastIdx = -Infinity;
  for (let i = spacing; i < path.length - 1 && orbs.length < count; i += spacing) {
    if (i - lastIdx < 2) continue;
    const p = path[i];
    if ((p.r === 0 && p.c === 0) || (p.r === N - 1 && p.c === N - 1)) continue;
    orbs.push({ r: p.r, c: p.c, taken: false, id: `orb-${p.r}-${p.c}` });
    lastIdx = i;
  }
  return orbs.slice(0, count);
}

function generateResolvableLevel(size, orbCount, maxTries = 60) {
  const start = { r: 0, c: 0 };
  const goal = { r: size - 1, c: size - 1 };
  for (let attempt = 0; attempt < maxTries; attempt++) {
    let maze = generatePerfectMaze(size);
    const allow = new Set([`${start.r},${start.c}`, `${goal.r},${goal.c}`]);
    maze = ensureMinDegree(maze, allow, 6);
    const { seen } = bfs(maze, start);
    if (!seen.has(`${goal.r},${goal.c}`)) continue;
    const orbs = placeOrbsAlongPath(maze, orbCount);
    if (orbs.length !== orbCount) continue;
    return { maze, orbs };
  }
  const maze = generatePerfectMaze(size);
  const orbs = placeOrbsAlongPath(maze, Math.max(1, Math.min(orbCount, 3)));
  return { maze, orbs };
}

export default function CaminoCorrectoScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("FACIL");
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);

  const size = DIFFS[difficulty].size;
  const orbCount = DIFFS[difficulty].orbs;

  const [{ maze, orbs: initOrbs }, setLevelData] = useState(() => generateResolvableLevel(size, orbCount));
  const [player, setPlayer] = useState({ r: 0, c: 0 });
  const [orbs, setOrbs] = useState(initOrbs);
  const CELL = BOARD_SIZE / maze.length;
  const portal = { r: maze.length - 1, c: maze.length - 1 };
  const touchStart = useRef({ x: 0, y: 0 }).current;
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 60), 1000 / 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;
    const data = generateResolvableLevel(size, orbCount);
    setLevelData(data);
    setOrbs(data.orbs);
    setPlayer({ r: 0, c: 0 });
    setWon(false);
    setScore(0);
  }, [gameStarted, difficulty]);

  function canMove(r, c, dr, dc) {
    const cell = maze[r][c];
    const nr = r + dr, nc = c + dc, N = maze.length;
    if (nr < 0 || nc < 0 || nr >= N || nc >= N) return false;
    if (dr === -1 && (cell.walls.top || maze[nr][nc].walls.bottom)) return false;
    if (dr === 1 && (cell.walls.bottom || maze[nr][nc].walls.top)) return false;
    if (dc === -1 && (cell.walls.left || maze[nr][nc].walls.right)) return false;
    if (dc === 1 && (cell.walls.right || maze[nr][nc].walls.left)) return false;
    return true;
  }

  function step(dirKey) {
    const [dr, dc] = DIRS[dirKey];
    const { r, c } = player;
    if (!canMove(r, c, dr, dc)) return;
    const nr = r + dr, nc = c + dc;
    const idx = orbs.findIndex((o) => o.r === nr && o.c === nc && !o.taken);
    let nextOrbs = orbs;
    if (idx !== -1) {
      nextOrbs = [...orbs];
      nextOrbs[idx] = { ...nextOrbs[idx], taken: true };
      setOrbs(nextOrbs);
      setScore((s) => s + 10);
      Vibration?.vibrate?.(15);
    }
    setPlayer({ r: nr, c: nc });
    if (nextOrbs.every((o) => o.taken) && nr === portal.r && nc === portal.c) {
      setWon(true);
      setScore((s) => s + 50);

      // Unlock achievement
      const difficultyLevel = difficulty === "FACIL" ? 1 : difficulty === "NORMAL" ? 2 : 3;
      const difficultyText = difficulty === "FACIL" ? "Fácil" : difficulty === "NORMAL" ? "Normal" : "Difícil";

      import("../../api/achievementService").then(({ unlockAchievement }) => {
        unlockAchievement("camino", difficultyLevel)
          .then(() => {
            setTimeout(() => {
              Alert.alert(
                "🏆 ¡Logro Desbloqueado!",
                `Has completado Camino Correcto en dificultad ${difficultyText}`,
                [{ text: "¡Genial!" }]
              );
            }, 1000); // Más delay para que no interfiera con el overlay de victoria
          })
          .catch(err => console.error("Failed to unlock achievement:", err));
      });
    }
  }

  const handleTouchStart = (e) => {
    const t = e.nativeEvent.touches[0];
    touchStart.x = t.pageX;
    touchStart.y = t.pageY;
  };
  const handleTouchEnd = (e) => {
    const t = e.nativeEvent.changedTouches[0];
    const dx = t.pageX - touchStart.x;
    const dy = t.pageY - touchStart.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 20) return;
    const ang = Math.atan2(dy, dx);
    if (ang > -Math.PI / 4 && ang <= Math.PI / 4) step("right");
    else if (ang > Math.PI / 4 && ang <= (3 * Math.PI) / 4) step("down");
    else if (ang <= -Math.PI / 4 && ang > (-3 * Math.PI) / 4) step("up");
    else step("left");
  };

  const center = (r, c) => ({ x: c * CELL + CELL / 2, y: r * CELL + CELL / 2 });
  const px = player.c * CELL + CELL / 2;
  const py = player.r * CELL + CELL / 2;
  const portalPulse = 0.85 + 0.15 * Math.sin((pulse / 60) * Math.PI * 2);
  const restartSameDifficulty = () => {
    const data = generateResolvableLevel(size, orbCount);
    setLevelData(data);
    setOrbs(data.orbs);
    setPlayer({ r: 0, c: 0 });
    setWon(false);
    setScore(0);
  };

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
          <Text style={styles.headerTitle}>Camino Correcto</Text>
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
              Desliza en la dirección que quieras moverte.
              Recoge todos los orbes para abrir el portal y llegar a la salida.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dificultad</Text>
        <View style={styles.optionsRow}>
          {Object.entries(DIFFS).map(([key, cfg]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.optionButton,
                difficulty === key && { backgroundColor: "#ff9a9e", borderColor: "#ff9a9e" },
              ]}
              onPress={() => setDifficulty(key)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: difficulty === key ? "#fff" : "#666" },
                ]}
              >
                {cfg.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setGameStarted(true);
            setScore(0);
            setWon(false);
          }}
          activeOpacity={0.8}
        >
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
          <Text style={styles.headerTitle}>Camino Correcto</Text>
          <View style={{ width: 45 }} />
        </View>
      </LinearGradient>

      <View
        style={styles.boardWrapper}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Canvas style={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
          <Group>
            <Rect x={0} y={0} width={BOARD_SIZE} height={BOARD_SIZE} color={COL_CARD} />
            {maze.map((row, r) =>
              row.map((cell, c) => {
                const x = c * CELL;
                const y = r * CELL;
                const t = Math.max(2, Math.floor(CELL * 0.14));
                const walls = [];
                if (cell.walls.top)
                  walls.push(<Rect key={`t-${r}-${c}`} x={x} y={y - t / 2} width={CELL} height={t} color={COL_WALL} />);
                if (cell.walls.bottom)
                  walls.push(<Rect key={`b-${r}-${c}`} x={x} y={y + CELL - t / 2} width={CELL} height={t} color={COL_WALL} />);
                if (cell.walls.left)
                  walls.push(<Rect key={`l-${r}-${c}`} x={x - t / 2} y={y} width={t} height={CELL} color={COL_WALL} />);
                if (cell.walls.right)
                  walls.push(<Rect key={`r-${r}-${c}`} x={x + CELL - t / 2} y={y} width={t} height={CELL} color={COL_WALL} />);
                return walls;
              })
            )}
            {orbs.map((o) => {
              const { x, y } = center(o.r, o.c);
              return <Circle key={o.id} cx={x} cy={y} r={CELL * 0.18} color={COL_ORB} opacity={o.taken ? 0.25 : 1} />;
            })}
            {(() => {
              const { x, y } = center(portal.r, portal.c);
              const rr = CELL * 0.22 * portalPulse;
              return (
                <Group>
                  <Circle cx={x} cy={y} r={rr * 2} color="rgba(164,63,240,0.12)" />
                  <Circle cx={x} cy={y} r={rr * 1.3} color={COL_PORTAL_OUT} />
                  <Circle cx={x} cy={y} r={rr * 0.8} color={COL_PORTAL_IN} />
                </Group>
              );
            })()}
            <Circle cx={px} cy={py} r={CELL * 0.25} color={COL_PLAYER} />
          </Group>
        </Canvas>
      </View>

      <View style={[styles.hud, { marginBottom: insets.bottom + 20 }]}>
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Dificultad</Text>
          <Text style={styles.hudValue}>{DIFFS[difficulty].label}</Text>
        </View>
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Puntos</Text>
          <Text style={styles.hudValue}>{score}</Text>
        </View>
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Orbes</Text>
          <Text style={styles.hudValue}>{orbs.filter((o) => o.taken).length}/{orbs.length}</Text>
        </View>
      </View>

      {won && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayTitle}>¡Nivel completado!</Text>
            <Text style={styles.overlayText}>Puntaje total: {score}</Text>
            <TouchableOpacity style={styles.btn} onPress={restartSameDifficulty}>
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButtonSmall}
              >
                <Text style={styles.btnText}>Volver a jugar</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnBack}
              onPress={() => {
                setGameStarted(false);
                setWon(false);
                setScore(0);
              }}
            >
              <Text style={styles.btnBackText}>Volver al menú</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {gameStarted ? renderGame() : renderMenu()}
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
  boardWrapper: {
    marginTop: 20,
    backgroundColor: COL_CARD,
    borderRadius: 25,
    padding: WRAP_PAD,
    width: BOARD_SIZE + WRAP_PAD * 2,
    height: BOARD_SIZE + WRAP_PAD * 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  hud: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  hudItem: {
    alignItems: "center",
  },
  hudLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  hudValue: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  overlayContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  overlayTitle: {
    color: "#ff9a9e",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  overlayText: {
    color: "#555",
    marginBottom: 25,
    fontSize: 18,
  },
  btn: {
    width: "100%",
    marginBottom: 15,
    borderRadius: 25,
    shadowColor: "#ff9a9e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButtonSmall: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnBack: {
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  btnBackText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
});
