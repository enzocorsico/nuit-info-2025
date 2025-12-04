"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Letter configuration with manual sizing and offsets
const letterConfig = {
  K: { sourceX: 0, sourceWidth: 0.3 },
  L: { sourceX: 0.3, sourceWidth: 0.19 },
  U: { sourceX: 0.5, sourceWidth: 0.21 },
  B: { sourceX: 0.75, sourceWidth: 0.25 },
};

// Helper function to create a canvas texture for each letter
const createLetterTexture = (
  sourceTexture: THREE.Texture,
  letterKey: "K" | "L" | "U" | "B"
): THREE.CanvasTexture => {
  const image = sourceTexture.image as HTMLImageElement;
  const config = letterConfig[letterKey];

  const canvas = document.createElement("canvas");
  canvas.width = 250;
  canvas.height = 300;

  const ctx = canvas.getContext("2d");
  if (ctx && image) {
    const sourceX = config.sourceX * image.width;
    const sourceWidth = config.sourceWidth * image.width;

    ctx.drawImage(
      image,
      sourceX,
      0,
      sourceWidth,
      image.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  const canvasTexture = new THREE.CanvasTexture(canvas);
  canvasTexture.flipY = true;
  return canvasTexture;
};// K Letter with texture clipping
const LetterK: React.FC<{ sourceTexture: THREE.Texture }> = ({
  sourceTexture,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [letterTexture, setLetterTexture] = useState<THREE.CanvasTexture | null>(
    null
  );

  useEffect(() => {
    const texture = createLetterTexture(sourceTexture, "K");
    setLetterTexture(texture);
  }, [sourceTexture]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      // Mode vague - oscillation verticale avec phase décalée
      meshRef.current.position.y = Math.sin(time * 2 - 0.5) * 0.8;
      meshRef.current.scale.y = 1 + Math.sin(time * 2 - 0.5) * 0.15;
      meshRef.current.rotation.z = Math.sin(time * 2 - 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[-1.8, 0, 0]}>
      <planeGeometry args={[1.0, 2.4]} />
      <meshPhongMaterial map={letterTexture} transparent={true} />
    </mesh>
  );
};

// L Letter with texture clipping
const LetterL: React.FC<{ sourceTexture: THREE.Texture }> = ({
  sourceTexture,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [letterTexture, setLetterTexture] = useState<THREE.CanvasTexture | null>(
    null
  );

  useEffect(() => {
    const texture = createLetterTexture(sourceTexture, "L");
    setLetterTexture(texture);
  }, [sourceTexture]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      // Mode vague - oscillation verticale avec phase décalée
      meshRef.current.position.y = Math.sin(time * 2) * 0.8;
      meshRef.current.scale.y = 1 + Math.sin(time * 2) * 0.15;
      meshRef.current.rotation.z = Math.sin(time * 2) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[-0.6, 0, 0]}>
      <planeGeometry args={[1.0, 2.4]} />
      <meshPhongMaterial map={letterTexture} transparent={true} />
    </mesh>
  );
};

// U Letter with texture clipping
const LetterU: React.FC<{ sourceTexture: THREE.Texture }> = ({
  sourceTexture,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [letterTexture, setLetterTexture] = useState<THREE.CanvasTexture | null>(
    null
  );

  useEffect(() => {
    const texture = createLetterTexture(sourceTexture, "U");
    setLetterTexture(texture);
  }, [sourceTexture]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      // Mode vague - oscillation verticale avec phase décalée
      meshRef.current.position.y = Math.sin(time * 2 + 0.5) * 0.8;
      meshRef.current.scale.y = 1 + Math.sin(time * 2 + 0.5) * 0.15;
      meshRef.current.rotation.z = Math.sin(time * 2 + 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0.6, 0, 0]}>
      <planeGeometry args={[1.2, 2.4]} />
      <meshPhongMaterial map={letterTexture} transparent={true} />
    </mesh>
  );
};

// B Letter with texture clipping
const LetterB: React.FC<{ sourceTexture: THREE.Texture }> = ({
  sourceTexture,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [letterTexture, setLetterTexture] = useState<THREE.CanvasTexture | null>(
    null
  );

  useEffect(() => {
    const texture = createLetterTexture(sourceTexture, "B");
    setLetterTexture(texture);
  }, [sourceTexture]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      // Mode vague - oscillation verticale avec phase décalée
      meshRef.current.position.y = Math.sin(time * 2 + 1) * 0.8;
      meshRef.current.scale.y = 1 + Math.sin(time * 2 + 1) * 0.15;
      meshRef.current.rotation.z = Math.sin(time * 2 + 1) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[1.8, 0, 0]}>
      <planeGeometry args={[1.0, 2.4]} />
      <meshPhongMaterial map={letterTexture} transparent={true} />
    </mesh>
  );
};

// Particle System
const Particles: React.FC = () => {
  return null;
};

const Scene: React.FC<{ sourceTexture: THREE.Texture }> = ({
  sourceTexture,
}) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ff1493" />
      <pointLight position={[-5, -5, 5]} intensity={0.9} color="#ffffff" />

      {/* Animated Letters */}
      <LetterK sourceTexture={sourceTexture} />
      <LetterL sourceTexture={sourceTexture} />
      <LetterU sourceTexture={sourceTexture} />
      <LetterB sourceTexture={sourceTexture} />

      {/* Particles */}
      <Particles />
    </>
  );
};

// Wrapper component that loads texture inside Canvas
const SceneWrapper: React.FC = () => {
  const texture = useTexture("/logo_klub_rose.png");
  return <Scene sourceTexture={texture} />;
};

interface Logo3DImageProps {
  imageUrl?: string;
}

export const Logo3DImage: React.FC<Logo3DImageProps> = () => {
  return (
    <div className="w-full h-[400px] flex items-center justify-center overflow-hidden">
      <Canvas>
        <SceneWrapper />
      </Canvas>
    </div>
  );
};
