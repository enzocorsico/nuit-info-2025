"use client";

import { useEffect, useRef } from "react";

type SoundType = "eat" | "gameOver" | "move";

// Create audio context and oscillator for retro sounds
const createSound = (type: SoundType) => {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  switch (type) {
    case "eat":
      // Happy "plink" sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.type = "square";
      break;

    case "gameOver":
      // Dramatic descending sound
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.type = "sawtooth";
      break;

    case "move":
      // Subtle tick sound
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      oscillator.type = "triangle";
      break;
  }

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + (type === "gameOver" ? 0.5 : type === "eat" ? 0.1 : 0.05));
};

export function useSound() {
  const enabledRef = useRef(true);

  useEffect(() => {
    // Enable sound on first user interaction (required by browsers)
    const enableSound = () => {
      enabledRef.current = true;
    };

    window.addEventListener("click", enableSound, { once: true });
    window.addEventListener("keydown", enableSound, { once: true });
    window.addEventListener("touchstart", enableSound, { once: true });

    return () => {
      window.removeEventListener("click", enableSound);
      window.removeEventListener("keydown", enableSound);
      window.removeEventListener("touchstart", enableSound);
    };
  }, []);

  const play = (type: SoundType) => {
    if (!enabledRef.current) return;

    try {
      createSound(type);
    } catch (error) {
      console.warn("Sound playback failed:", error);
    }
  };

  return { play };
}
