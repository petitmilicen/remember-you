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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { Canvas, Group, Rect, Circle } from "@shopify/react-native-skia";

const { width: SCREEN_W } = Dimensions.get("window");
const WRAP_PAD = 16;
const BOARD_SIZE = Math.min(SCREEN_W * 0.9, 440);

const COL_APP_BG = "#EDEDED";
const COL_CARD = "#FFFFFF";
const COL_WALL = "#F93827";
const COL_PLAYER = "#FFE066";
const COL_ORB = "#00FFF5";
const COL_PORTAL_OUT = "#C86BFA";
const COL_PORTAL_IN = "#A43FF0";

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
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Selecciona la dificultad</Text>

        <View style={styles.tutorialBox}>
          <FontAwesome5 name="lightbulb" size={20} color="#F93827" />
          <Text style={styles.tutorialText}>
            Desliza en la dirección que quieras moverte.
            Recoge todos los orbes para abrir el portal y llegar a la salida.
            Los niveles cambian cada vez que juegas.
          </Text>
        </View>

        {Object.entries(DIFFS).map(([key, cfg]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.diffButton,
              difficulty === key && { backgroundColor: "#F93827" },
            ]}
            onPress={() => setDifficulty(key)}
          >
            <Text
              style={[
                styles.diffText,
                { color: difficulty === key ? "#fff" : "#333" },
              ]}
            >
              {cfg.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setGameStarted(true);
            setScore(0);
            setWon(false);
          }}
        >
          <Text style={styles.startText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderGame = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={["#F93827", "#FF6B6B"]}
        style={[styles.header, { paddingTop: Platform.OS === "android" ? 40 : 10 }]}
      >
        <TouchableOpacity onPress={() => setGameStarted(false)}>
          <FontAwesome5 name="arrow-alt-circle-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Camino Correcto</Text>
        <View style={{ width: 26 }} />
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

      <View style={styles.hud}>
        <Text style={styles.hudText}>{DIFFS[difficulty].label}</Text>
        <Text style={styles.hudText}>Puntos {score}</Text>
        <Text style={styles.hudText}>
          {orbs.filter((o) => o.taken).length}/{orbs.length} orbes
        </Text>
      </View>

      {won && (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>¡Nivel completado!</Text>
          <Text style={styles.overlayText}>Puntaje total: {score}</Text>
          <TouchableOpacity style={[styles.btn, styles.btnFull]} onPress={restartSameDifficulty}>
            <Text style={styles.btnText}>Volver a jugar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnBack, styles.btnFull]}
            onPress={() => {
              setGameStarted(false);
              setWon(false);
              setScore(0);
            }}
          >
            <Text style={styles.btnBackText}>Volver al menú</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return gameStarted ? renderGame() : renderMenu();
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, alignItems: "center", backgroundColor: COL_APP_BG },
  menuContainer: {
    alignItems: "center",
    marginTop: 60,
    backgroundColor: "#fff",
    width: SCREEN_W * 0.9,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  menuTitle: {
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
  startButton: {
    backgroundColor: "#F93827",
    padding: 15,
    borderRadius: 15,
    marginTop: 25,
    width: "100%",
    alignItems: "center",
  },
  startText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  container: { flex: 1, backgroundColor: COL_APP_BG, alignItems: "center" },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  boardWrapper: {
    marginTop: 14,
    backgroundColor: COL_CARD,
    borderRadius: 22,
    padding: WRAP_PAD,
    width: BOARD_SIZE + WRAP_PAD * 2,
    height: BOARD_SIZE + WRAP_PAD * 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  hud: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F93827",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 16,
  },
  hudText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  overlay: {
    position: "absolute",
    top: "32%",
    left: "5%",
    right: "5%",
    backgroundColor: COL_CARD,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 6,
  },
  overlayTitle: { color: "#F93827", fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  overlayText: { color: "#333", marginBottom: 14, fontSize: 16 },
  btn: {
    backgroundColor: "#F93827",
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: "center",
    width: "100%",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnBack: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
    width: "100%",
  },
  btnBackText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnFull: { width: "100%" },
});
