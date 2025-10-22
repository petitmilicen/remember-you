import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { Canvas, Group, Rect, Circle, Path } from "@shopify/react-native-skia";
import { Audio } from "expo-av"; 

const { width } = Dimensions.get("window");
const BOARD_MARGIN = 16;
const BOARD_SIZE = Math.min(width * 0.92, 420);
const GRID = 9;
const CELL = BOARD_SIZE / GRID;
const WALL_THICK = Math.max(4, Math.floor(CELL * 0.14));
const PLAYER_R = Math.max(8, Math.floor(CELL * 0.22));
const VISION_R = Math.floor(CELL * 2.2);
const BG_COLOR = "#EDEDED";
const PATH_COLOR = "#EDEDED";
const WALL_COLOR = "#F93827";
const FOG_ALPHA = 1;
const MOVE_SPEED = 6;

function initGrid(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      visited: false,
      walls: { top: true, right: true, bottom: true, left: true },
    }))
  );
}
function unvisitedNeighbors(grid, r, c) {
  const res = [];
  if (r > 0 && !grid[r - 1][c].visited) res.push(grid[r - 1][c]);
  if (c < grid[0].length - 1 && !grid[r][c + 1].visited) res.push(grid[r][c + 1]);
  if (r < grid.length - 1 && !grid[r + 1][c].visited) res.push(grid[r + 1][c]);
  if (c > 0 && !grid[r][c - 1].visited) res.push(grid[r][c - 1]);
  return res;
}
function knock(a, b) {
  const dr = b.r - a.r;
  const dc = b.c - a.c;
  if (dr === -1) {
    a.walls.top = false;
    b.walls.bottom = false;
  } else if (dr === 1) {
    a.walls.bottom = false;
    b.walls.top = false;
  } else if (dc === 1) {
    a.walls.right = false;
    b.walls.left = false;
  } else if (dc === -1) {
    a.walls.left = false;
    b.walls.right = false;
  }
}
function generateMaze(rows, cols) {
  const grid = initGrid(rows, cols);
  const stack = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);
  while (stack.length) {
    const curr = stack[stack.length - 1];
    const nb = unvisitedNeighbors(grid, curr.r, curr.c);
    if (nb.length > 0) {
      const next = nb[Math.floor(Math.random() * nb.length)];
      knock(curr, next);
      next.visited = true;
      stack.push(next);
    } else stack.pop();
  }
  for (const row of grid) for (const c of row) c.visited = false;
  return grid;
}
function buildWallRects(maze) {
  const rects = [];
  const t = WALL_THICK;
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const x = c * CELL;
      const y = r * CELL;
      const m = maze[r][c].walls;
      if (m.top) rects.push({ x, y: y - t / 2, w: CELL, h: t });
      if (m.bottom) rects.push({ x, y: y + CELL - t / 2, w: CELL, h: t });
      if (m.left) rects.push({ x: x - t / 2, y, w: t, h: CELL });
      if (m.right) rects.push({ x: x + CELL - t / 2, y, w: t, h: CELL });
    }
  }
  rects.push({ x: -t / 2, y: -t / 2, w: BOARD_SIZE + t, h: t });
  rects.push({ x: -t / 2, y: BOARD_SIZE - t / 2, w: BOARD_SIZE + t, h: t });
  rects.push({ x: -t / 2, y: -t / 2, w: t, h: BOARD_SIZE + t });
  rects.push({
    x: BOARD_SIZE - t / 2,
    y: -t / 2,
    w: t,
    h: BOARD_SIZE + t,
  });
  return rects;
}
function circleRectCollision(cx, cy, r, rect) {
  const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
  const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy <= r * r;
}

export default function CaminoCorrectoSkiaScreen({ navigation, title = "Camino Correcto" }) {
  const [maze, setMaze] = useState(() => generateMaze(GRID, GRID));
  const wallRects = useMemo(() => buildWallRects(maze), [maze]);

  const startX = CELL / 2;
  const startY = CELL / 2;
  const [px, setPx] = useState(startX);
  const [py, setPy] = useState(startY);
  const [won, setWon] = useState(false);
  const [steps, setSteps] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);

  const moveSound = useRef(null);
  const bumpSound = useRef(null);
  const victorySound = useRef(null);

  useEffect(() => {
    async function loadSounds() {
      moveSound.current = new Audio.Sound();
      bumpSound.current = new Audio.Sound();
      victorySound.current = new Audio.Sound();

      await moveSound.current.loadAsync(require("../../assets/sounds/move.mp3"));
      await bumpSound.current.loadAsync(require("../../assets/sounds/bump.mp3"));
      await victorySound.current.loadAsync(require("../../assets/sounds/victory.mp3"));
    }
    loadSounds();

    return () => {
      moveSound.current?.unloadAsync();
      bumpSound.current?.unloadAsync();
      victorySound.current?.unloadAsync();
    };
  }, []);

  async function playSound(ref, volume = 0.4) {
    try {
      await ref.current.setPositionAsync(0);
      await ref.current.setVolumeAsync(volume);
      await ref.current.playAsync();
    } catch (e) {
      console.log("Error de sonido:", e);
    }
  }

  useEffect(() => {
    if (won) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [won]);

  const goal = {
    x: BOARD_SIZE - CELL / 2,
    y: BOARD_SIZE - CELL / 2,
    r: Math.max(10, CELL * 0.25),
  };

  function handleMove(dir) {
    if (won) return;
    const moved = move(dir);
    if (moved) {
      setSteps((s) => s + 1);
      playSound(moveSound);
    } else {
      playSound(bumpSound, 0.25);
    }
  }

  function move(dir) {
    let dx = 0, dy = 0;
    if (dir === "up") dy = -MOVE_SPEED;
    if (dir === "down") dy = MOVE_SPEED;
    if (dir === "left") dx = -MOVE_SPEED;
    if (dir === "right") dx = MOVE_SPEED;

    let nx = px, ny = py;
    const oldX = nx, oldY = ny;
    const stepsCount = 3;

    for (let i = 0; i < stepsCount; i++) {
      const stepX = dx / stepsCount;
      const stepY = dy / stepsCount;
      if (!collides(nx + stepX, ny)) nx += stepX;
      if (!collides(nx, ny + stepY)) ny += stepY;
    }

    const movedDist = Math.hypot(nx - oldX, ny - oldY);
    if (movedDist < 0.5) return false;

    setPx(nx);
    setPy(ny);

    const dxGoal = nx - goal.x;
    const dyGoal = ny - goal.y;
    if (dxGoal * dxGoal + dyGoal * dyGoal <= goal.r * goal.r) {
      const efficiency = Math.max(1, steps + seconds * 0.8);
      const newScore = Math.floor(2000 / efficiency);
      setScore(newScore);
      setWon(true);
      playSound(victorySound, 0.6);
    }
    return true;
  }

  function collides(cx, cy) {
    if (cx - PLAYER_R < 0 || cy - PLAYER_R < 0 || cx + PLAYER_R > BOARD_SIZE || cy + PLAYER_R > BOARD_SIZE)
      return true;
    for (const wr of wallRects) if (circleRectCollision(cx, cy, PLAYER_R, wr)) return true;
    return false;
  }

  const resetMaze = () => {
    setWon(false);
    setPx(startX);
    setPy(startY);
    setSteps(0);
    setSeconds(0);
  };
  const newMaze = () => {
    setWon(false);
    setMaze(generateMaze(GRID, GRID));
    setPx(startX);
    setPy(startY);
    setSteps(0);
    setSeconds(0);
  };

  const wallsPath = useMemo(() => {
    const toPathCmd = (r) => `M ${r.x} ${r.y} h ${r.w} v ${r.h} h ${-r.w} Z`;
    return wallRects.map((r) => toPathCmd(r)).join(" ");
  }, [wallRects]);

  const phaseRef = useRef(0);
  const [, setTick] = useState(0);
  const [visionMod, setVisionMod] = useState(1);
  useEffect(() => {
    let rafId;
    const loop = () => {
      phaseRef.current += 0.03;
      setVisionMod(1 + 0.05 * Math.sin(phaseRef.current));
      setTick((t) => (t >= 1000 ? 0 : t + 1));
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const pulseIntensity = 0.15 + 0.15 * Math.sin(phaseRef.current);
  const goalPulse = 1 + pulseIntensity;

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#F93827", "#FF6B6B"]} style={[styles.header, { paddingTop: Platform.OS === "android" ? 40 : 10 }]}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <FontAwesome5 name="arrow-alt-circle-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <View style={[styles.boardWrapper, { width: BOARD_SIZE + BOARD_MARGIN * 2 }]}>
        <Canvas style={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
          <Rect x={0} y={0} width={BOARD_SIZE} height={BOARD_SIZE} color={PATH_COLOR} />
          <Path path={wallsPath} color={WALL_COLOR} />

          <Group layer>
            <Rect x={0} y={0} width={BOARD_SIZE} height={BOARD_SIZE} color={`rgba(0,0,0,${FOG_ALPHA})`} />
            <Circle cx={px} cy={py} r={VISION_R * visionMod} color="rgba(0,0,0,0)" blendMode="clear" />
          </Group>

          <Group>
            <Circle cx={goal.x} cy={goal.y} r={goal.r * goalPulse} color="#FFD54F" />
            <Circle cx={goal.x} cy={goal.y} r={goal.r * 0.6} color="#FFA000" />
          </Group>

          <Group>
            <Circle cx={px} cy={py} r={PLAYER_R + 8} color="rgba(249,56,39,0.1)" />
            <Circle cx={px} cy={py} r={PLAYER_R} color="#F93827" />
            <Circle cx={px} cy={py} r={PLAYER_R * 0.4} color="#FF6B6B" />
          </Group>
        </Canvas>
      </View>

      <View style={styles.controls}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.ctrlBtn, { opacity: 0 }]} disabled />
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleMove("up")}>
            <FontAwesome5 name="arrow-up" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, { opacity: 0 }]} disabled />
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleMove("left")}>
            <FontAwesome5 name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, { backgroundColor: "#F93827" }]} disabled>
            <FontAwesome5 name="user" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleMove("right")}>
            <FontAwesome5 name="arrow-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.ctrlBtn, { opacity: 0 }]} disabled />
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleMove("down")}>
            <FontAwesome5 name="arrow-down" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, { opacity: 0 }]} disabled />
        </View>
      </View>

      {won && (
        <View style={styles.winOverlay}>
          <Text style={styles.winTitle}>¡Excelente! 🎉</Text>
          <Text style={styles.winSubtitle}>Has encontrado la salida</Text>
          <Text style={styles.winStat}>🕓 Tiempo: {seconds}s</Text>
          <Text style={styles.winStat}>🚶‍♂️‍➡️ Pasos: {steps}</Text>
          <Text style={styles.winStat}>⭐ Puntuación: {score}</Text>
          <View style={{ flexDirection: "row", marginTop: 12, gap: 10 }}>
            <TouchableOpacity style={[styles.winBtn, { backgroundColor: "#00C897" }]} onPress={newMaze}>
              <Text style={styles.winBtnText}>Nuevo laberinto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.winBtn, { backgroundColor: "#F25F5C" }]} onPress={resetMaze}>
              <Text style={styles.winBtnText}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BG_COLOR, 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingBottom: Platform.OS === "android" ? 40 : 20, 
  },
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
  headerTitle: {
     color: "#FFF", 
     fontSize: 24, 
     fontWeight: "bold" 
    },
  boardWrapper: {
     marginTop: 10, 
     borderRadius: 20, 
     padding: BOARD_MARGIN, 
     backgroundColor: "#F7F7F7", 
     elevation: 6 
    },
  controls: {
     alignItems: "center", 
     justifyContent: "center", 
     marginVertical: 10 
    },
  row: {
     flexDirection: "row" 
    },
  ctrlBtn: {
     backgroundColor: "#F25F5C", 
     width: 65, height: 65, 
     borderRadius: 35, 
     alignItems: "center", 
     ustifyContent: "center", 
     argin: 6, 
     elevation: 4 ,
    },
  winOverlay: {
     position: "absolute", 
     top: "35%", 
     left: 20, 
     right: 20, 
     backgroundColor: "#FFFFFF", 
     paddingVertical: 22, 
     paddingHorizontal: 18, 
     borderRadius: 18, 
     elevation: 10, 
     alignItems: "center" 
    },
  winTitle: { 
    fontSize: 22, 
    color: "#007F5F", 
    fontWeight: "bold", 
    textAlign: "center" 
  },
  winSubtitle: {
     fontSize: 16, 
     color: "#37474F", 
     marginTop: 6, 
     textAlign: "center" 
    },
  winStat: {
     fontSize: 16, 
     color: "#333", 
     marginTop: 5, 
     textAlign: "center" 
    },
  winBtn: { 
    paddingVertical: 10,
    paddingHorizontal: 18, 
    borderRadius: 12 
  },
  winBtnText: {
    color: "#FFF", 
    fontWeight: "bold" 
  },
});
