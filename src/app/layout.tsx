"use client";

import { useState } from "react";
import "./globals.css";
import { useKonamiCode } from "./hooks/useKonamiCode";
import SnakeGame3D from "./components/SnakeGame3D";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSnake, setShowSnake] = useState(false);

  // Activate Snake game 3D with Konami code
  useKonamiCode(() => {
    setShowSnake(true);
  });

  return (
    <html lang="fr">
      <body>
        {children}
        {showSnake && <SnakeGame3D onClose={() => setShowSnake(false)} />}
      </body>
    </html>
  );
}
