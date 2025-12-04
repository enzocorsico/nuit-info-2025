"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Box } from "@react-three/drei";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSound } from "../hooks/useSound";
import * as THREE from "three";

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const FOOD_ITEMS = [
  { emoji: "💻", name: "PC reconditionné", color: "#3b82f6" },
  { emoji: "☁️", name: "Cloud", color: "#ec4899" },
  { emoji: "🐝", name: "Abeille", color: "#facc15" },
  { emoji: "🌱", name: "Écologie", color: "#22c55e" },
  { emoji: "♻️", name: "Recyclage", color: "#f97316" },
  { emoji: "🔋", name: "Énergie", color: "#8b5cf6" },
];

interface Snake3DProps {
  snake: Position[];
  food: Position;
  foodType: number;
}

function Snake3D({ snake, food, foodType }: Snake3DProps) {
  return (
    <group>
      {/* Snake segments */}
      {snake.map((segment, index) => {
        const isHead = index === 0;
        const scale = isHead ? 1.2 : 1 - index * 0.02;
        const height = isHead ? 1.5 : 1;
        
        return (
          <Box
            key={index}
            position={[segment.x - GRID_SIZE / 2, height / 2, segment.y - GRID_SIZE / 2]}
            args={[scale, height, scale]}
          >
            <meshStandardMaterial
              color={isHead ? "#3b82f6" : `hsl(${280 + index * 5}, 80%, 60%)`}
              emissive={isHead ? "#3b82f6" : "#ec4899"}
              emissiveIntensity={isHead ? 0.8 : 0.4 - index * 0.02}
              metalness={0.8}
              roughness={0.2}
            />
          </Box>
        );
      })}

      {/* Food with floating animation */}
      <group position={[food.x - GRID_SIZE / 2, 1, food.y - GRID_SIZE / 2]}>
        <FloatingFood color={FOOD_ITEMS[foodType].color} />
        <Text
          position={[0, 2, 0]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {FOOD_ITEMS[foodType].emoji}
        </Text>
      </group>
    </group>
  );
}

function FloatingFood({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

function Grid3D() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // Pulsing grid effect
      gridRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const wave = Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.1 + 1;
          child.scale.y = wave;
        }
      });
    }
  });

  return (
    <group ref={gridRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.9}
          roughness={0.1}
          emissive="#1a1a2e"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Grid lines */}
      {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
        <group key={i}>
          <mesh position={[i - GRID_SIZE / 2, 0.01, 0]}>
            <boxGeometry args={[0.05, 0.1, GRID_SIZE]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
            />
          </mesh>
          <mesh position={[0, 0.01, i - GRID_SIZE / 2]}>
            <boxGeometry args={[GRID_SIZE, 0.1, 0.05]} />
            <meshStandardMaterial
              color="#ec4899"
              emissive="#ec4899"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Corner pillars */}
      {[
        [-GRID_SIZE / 2, -GRID_SIZE / 2],
        [GRID_SIZE / 2, -GRID_SIZE / 2],
        [-GRID_SIZE / 2, GRID_SIZE / 2],
        [GRID_SIZE / 2, GRID_SIZE / 2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 2, z]}>
          <cylinderGeometry args={[0.3, 0.3, 4, 8]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#facc15"
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene3D({ snake, food, foodType }: Snake3DProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={1} color="#3b82f6" />
      <pointLight position={[10, 5, 10]} intensity={0.5} color="#ec4899" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#facc15" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.6}
        penumbra={1}
        intensity={1}
        castShadow
        color="#ffffff"
      />

      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Grid and game elements */}
      <Grid3D />
      <Snake3D snake={snake} food={food} foodType={foodType} />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={15}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

interface SnakeGame3DProps {
  onClose: () => void;
}

export default function SnakeGame3D({ onClose }: SnakeGame3DProps) {
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [foodType, setFoodType] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [showVideo, setShowVideo] = useState(false);

  const directionRef = useRef<Direction>("RIGHT");
  const gameLoopRef = useRef<number | undefined>(undefined);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sound = useSound();

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
    setFoodType(Math.floor(Math.random() * FOOD_ITEMS.length));
  }, []);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return snakeBody.some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead: Position;

      switch (directionRef.current) {
        case "UP":
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case "DOWN":
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case "LEFT":
          newHead = { x: head.x - 1, y: head.y };
          break;
        case "RIGHT":
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      if (checkCollision(newHead, prevSnake)) {
        setGameOver(true);
        sound.play("gameOver");
        // Pause video on game over
        if (videoRef.current) {
          videoRef.current.pause();
        }
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 20;
          // Trigger video at 150 points (7 items)
          if (newScore >= 150 && !showVideo) {
            setShowVideo(true);
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.play().catch((err) => {
                  console.log("Video autoplay blocked:", err);
                });
              }
            }, 100);
          }
          return newScore;
        });
        setSpeed((prev) => Math.max(50, prev - 2));
        generateFood();
        sound.play("eat");
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPaused, food, checkCollision, generateFood, sound]);

  useEffect(() => {
    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastTime > speed) {
        moveSnake();
        lastTime = timestamp;
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (!gameOver && !isPaused) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [moveSnake, speed, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
        case "z":
        case "w":
          if (directionRef.current !== "DOWN") {
            setDirection("UP");
            directionRef.current = "UP";
          }
          break;
        case "ArrowDown":
        case "s":
          if (directionRef.current !== "UP") {
            setDirection("DOWN");
            directionRef.current = "DOWN";
          }
          break;
        case "ArrowLeft":
        case "q":
        case "a":
          if (directionRef.current !== "RIGHT") {
            setDirection("LEFT");
            directionRef.current = "LEFT";
          }
          break;
        case "ArrowRight":
        case "d":
          if (directionRef.current !== "LEFT") {
            setDirection("RIGHT");
            directionRef.current = "RIGHT";
          }
          break;
        case " ":
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) > 30) {
      if (absDeltaX > absDeltaY) {
        if (deltaX > 0 && directionRef.current !== "LEFT") {
          setDirection("RIGHT");
          directionRef.current = "RIGHT";
        } else if (deltaX < 0 && directionRef.current !== "RIGHT") {
          setDirection("LEFT");
          directionRef.current = "LEFT";
        }
      } else {
        if (deltaY > 0 && directionRef.current !== "UP") {
          setDirection("DOWN");
          directionRef.current = "DOWN";
        } else if (deltaY < 0 && directionRef.current !== "DOWN") {
          setDirection("UP");
          directionRef.current = "UP";
        }
      }
    }

    touchStartRef.current = null;
  };

  const handleRestart = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    generateFood();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* UI Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-linear-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-6">
          <div className="text-nird-blue font-bold text-2xl md:text-3xl tracking-wider animate-pulse">
            SNAKE <span className="text-nird-pink">3D</span>
          </div>
          <div className="text-nird-yellow text-xl md:text-2xl font-mono">
            Score: <span className="text-white font-bold">{score}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
          aria-label="Close game"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 20, 25], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ position: "relative", zIndex: 5 }}
      >
        <Scene3D snake={snake} food={food} foodType={foodType} />
      </Canvas>

      {/* Video Overlay - on top of canvas */}
      {showVideo && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover opacity-60"
            loop
            playsInline
            autoPlay
          >
            <source src="/Meilleurs memes - Tu vas repartir mal mon copain.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 animate-in fade-in backdrop-blur-md">
          <div className="bg-linear-to-br from-gray-900 to-black p-8 rounded-2xl border-4 border-nird-pink shadow-2xl text-center max-w-md">
            <h2 className="text-5xl font-bold text-nird-yellow mb-4 animate-pulse">
              GAME OVER
            </h2>
            <p className="text-2xl text-white mb-2">Score Final</p>
            <p className="text-6xl font-bold text-nird-blue mb-8">{score}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-nird-blue hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-xl transition-all hover:scale-110"
              >
                Rejouer
              </button>
              <button
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold text-xl transition-all hover:scale-110"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="text-6xl font-bold text-nird-yellow animate-pulse">
            PAUSE
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-400 text-sm">
        <div className="md:hidden">Swipe pour diriger • Drag pour tourner la caméra</div>
        <div className="hidden md:block">
          Flèches / ZQSD pour diriger • Souris pour tourner la caméra • Espace pour pause
        </div>
      </div>
    </div>
  );
}
