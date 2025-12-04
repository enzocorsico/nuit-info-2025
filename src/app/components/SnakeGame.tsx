"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSound } from "../hooks/useSound";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const FOOD_ITEMS = [
  { emoji: "💻", name: "PC reconditionné" },
  { emoji: "☁️", name: "Cloud" },
  { emoji: "🐝", name: "Abeille" },
  { emoji: "🌱", name: "Écologie" },
  { emoji: "♻️", name: "Recyclage" },
  { emoji: "🔋", name: "Énergie" },
];

interface SnakeGameProps {
  onClose: () => void;
}

export default function SnakeGame({ onClose }: SnakeGameProps) {
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

  const directionRef = useRef<Direction>("RIGHT");
  const gameLoopRef = useRef<number | undefined>(undefined);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // Sound effects
  const sound = useSound();

  // Generate random food position
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
    setFoodType(Math.floor(Math.random() * FOOD_ITEMS.length));
  }, []);

  // Check collision
  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return snakeBody.some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  // Game loop
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

      // Check collision
      if (checkCollision(newHead, prevSnake)) {
        setGameOver(true);
        sound.play("gameOver");
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setSpeed((prev) => Math.max(50, prev - 2)); // Speed up
        generateFood();
        sound.play("eat");
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [gameOver, isPaused, food, checkCollision, generateFood]);

  // Game loop with requestAnimationFrame
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

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current !== "DOWN") {
            setDirection("UP");
            directionRef.current = "UP";
          }
          break;
        case "ArrowDown":
          if (directionRef.current !== "UP") {
            setDirection("DOWN");
            directionRef.current = "DOWN";
          }
          break;
        case "ArrowLeft":
          if (directionRef.current !== "RIGHT") {
            setDirection("LEFT");
            directionRef.current = "LEFT";
          }
          break;
        case "ArrowRight":
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

  // Touch controls for mobile
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
        // Horizontal swipe
        if (deltaX > 0 && directionRef.current !== "LEFT") {
          setDirection("RIGHT");
          directionRef.current = "RIGHT";
        } else if (deltaX < 0 && directionRef.current !== "RIGHT") {
          setDirection("LEFT");
          directionRef.current = "LEFT";
        }
      } else {
        // Vertical swipe
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
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    generateFood();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(236, 72, 153, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            animation: "grid-scroll 20s linear infinite",
          }}
        />
      </div>

      {/* UI Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <div className="text-nird-blue font-bold text-2xl md:text-3xl tracking-wider animate-pulse">
            SNAKE <span className="text-nird-pink">NIRD</span>
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

      {/* Game Grid */}
      <div
        className="relative border-4 border-nird-blue shadow-2xl"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(236, 72, 153, 0.3)",
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute transition-all duration-100"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor:
                index === 0
                  ? "#3b82f6" // Head - nird-blue
                  : `rgba(236, 72, 153, ${1 - index / snake.length})`, // Body gradient
              boxShadow:
                index === 0
                  ? "0 0 20px rgba(59, 130, 246, 0.8)"
                  : "0 0 10px rgba(236, 72, 153, 0.5)",
              borderRadius: index === 0 ? "4px" : "2px",
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute flex items-center justify-center animate-bounce"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.8))",
          }}
        >
          <span className="text-2xl">{FOOD_ITEMS[foodType].emoji}</span>
        </div>

        {/* Glitch overlay effect */}
        {!gameOver && (
          <div className="absolute inset-0 pointer-events-none animate-glitch opacity-10 bg-linear-to-br from-nird-pink to-nird-coral mix-blend-screen" />
        )}
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 animate-in fade-in">
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
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
          <div className="text-6xl font-bold text-nird-yellow animate-pulse">
            PAUSE
          </div>
        </div>
      )}

      {/* Mobile controls hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm md:hidden">
        Swipe pour diriger le serpent
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm hidden md:block">
        Flèches pour diriger • Espace pour pause
      </div>
    </div>
  );
}
