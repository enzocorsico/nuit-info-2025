"use client";

import { useEffect, useState } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonamiCode(callback: () => void) {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key];

        // Keep only the last N keys where N is the length of the code
        const relevantKeys = newKeys.slice(-KONAMI_CODE.length);

        // Check if the sequence matches
        const matches = relevantKeys.every(
          (key, index) => key === KONAMI_CODE[index]
        );

        if (matches && relevantKeys.length === KONAMI_CODE.length) {
          callback();
          return []; // Reset after activation
        }

        return relevantKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback]);

  return keys;
}
