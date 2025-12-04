"use client";

import { useState } from "react";
import "./globals.css";
import { useKonamiCode } from "./hooks/useKonamiCode";
import SnakeMenu from "./components/SnakeMenu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSnake, setShowSnake] = useState(false);

  // Activate Snake menu with Konami code
  useKonamiCode(() => {
    setShowSnake(true);
  });

  return (
    <html lang="fr">
      <body>
        {children}
        {showSnake && <SnakeMenu onClose={() => setShowSnake(false)} />}
      </body>
    </html>
  );
}
