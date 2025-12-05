"use client";

import { useState } from "react";
import SnakeGame from "./SnakeGame";
import SnakeGame3D from "./SnakeGame3D";

interface SnakeMenuProps {
  onClose: () => void;
}

export default function SnakeMenu({ onClose }: SnakeMenuProps) {
  const [gameMode, setGameMode] = useState<"menu" | "2d" | "3d">("menu");

  if (gameMode === "2d") {
    return <SnakeGame onClose={() => setGameMode("menu")} />;
  }

  if (gameMode === "3d") {
    return <SnakeGame3D onClose={() => setGameMode("menu")} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Animated background */}
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

      {/* Menu */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl px-4">
        {/* Title */}
        <div>
          <h1 className="text-6xl md:text-8xl font-bold mb-4 animate-pulse">
            <span className="text-nird-blue">SNAKE</span>{" "}
            <span className="text-nird-pink">NIRD</span>
          </h1>
          <p className="text-nird-yellow text-xl md:text-2xl font-mono">
            🎮 Choisis ton mode 🎮
          </p>
        </div>

        {/* Game mode buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center flex-wrap">
          <button
            onClick={() => setGameMode("2d")}
            className="group relative bg-linear-to-br from-nird-blue to-nird-pink p-8 rounded-2xl border-4 border-nird-blue hover:border-nird-yellow transition-all hover:scale-110 w-64 cursor-pointer"
          >
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-3xl font-bold text-white mb-2">2D Classic</h2>
            <p className="text-white/80">Style rétro arcade</p>
          </button>

          <button
            onClick={() => setGameMode("3d")}
            className="group relative bg-linear-to-br from-nird-pink to-nird-coral p-8 rounded-2xl border-4 border-nird-pink hover:border-nird-yellow transition-all hover:scale-110 w-64 cursor-pointer"
          >
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-2">3D Ultra</h2>
            <p className="text-white/80">Expérience immersive</p>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-gray-400 text-sm space-y-2">
          <p>⌨️ Flèches ou ZQSD pour diriger</p>
          <p>📱 Swipe sur mobile</p>
          <p>🎯 Mange les items pour grandir !</p>
          <p className="text-nird-yellow">⚠️ Attention aux surprises à 60 et 150 points...</p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          ✕ Quitter
        </button>
      </div>
    </div>
  );
}
