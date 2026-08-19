"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Individual Organic Clay Blob
function ClayBlob({
  position = [0, 0, 0],
  scale = 1,
  color = "#e86034",
  roughness = 0.65,
  speed = 1,
  distortSpeed = 1.2,
  distortAmp = 0.12,
}: {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  roughness?: number;
  speed?: number;
  distortSpeed?: number;
  distortAmp?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create base geometry with geometry caching
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.4, 24), []);
  
  // Clone original positions array for procedural organic deformation
  const originalPositions = useMemo(() => {
    return geometry.attributes.position.clone();
  }, [geometry]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * distortSpeed;
    const posAttr = meshRef.current.geometry.attributes.position;
    const orig = originalPositions.array as Float32Array;
    const current = posAttr.array as Float32Array;

    for (let i = 0; i < posAttr.count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const ox = orig[ix];
      const oy = orig[iy];
      const oz = orig[iz];

      // Procedural soft wave displacement for clay-like organic squash & stretch
      const noise =
        Math.sin(ox * 1.5 + time) *
        Math.cos(oy * 1.5 + time * 0.8) *
        Math.sin(oz * 1.5 + time * 0.6);

      const displacement = 1 + noise * distortAmp;

      current[ix] = ox * displacement;
      current[iy] = oy * displacement;
      current[iz] = oz * displacement;
    }

    posAttr.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();

    // Gentle axial rotation
    meshRef.current.rotation.y += 0.003 * speed;
    meshRef.current.rotation.x += 0.0015 * speed;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow receiveShadow geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={0.06}
        flatShading={false}
      />
    </mesh>
  );
}

// Satellite Clay Pebble
function SatellitePebble({
  position,
  scale,
  color,
  orbitSpeed = 0.5,
  orbitRadius = 2.5,
  phase = 0,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  orbitSpeed?: number;
  orbitRadius?: number;
  phase?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * orbitSpeed + phase;
    ref.current.position.x = position[0] + Math.cos(t) * (orbitRadius * 0.3);
    ref.current.position.y = position[1] + Math.sin(t * 1.2) * (orbitRadius * 0.25);
    ref.current.position.z = position[2] + Math.sin(t) * 0.4;
    ref.current.rotation.x += 0.008;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.04} />
    </mesh>
  );
}

// Interactive Parallax Rig & Lights
function SceneRig({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Smooth lerp mouse parallax response
    const targetX = (mouse.x * 0.6);
    const targetY = (mouse.y * 0.4);
    
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetX,
      2.5,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      -targetY,
      2.5,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      {/* Directional Key Light (Top-Left matching CSS dual shadows) */}
      <directionalLight
        position={[-6, 7, 5]}
        intensity={2.8}
        color="#fff4eb"
        castShadow
      />
      {/* Soft Fill Light from right */}
      <directionalLight position={[6, -2, -3]} intensity={0.6} color="#45546e" />
      {/* Warm Terracotta Rim Light from Bottom */}
      <pointLight position={[3, -4, 2]} intensity={2.2} color="#e86034" distance={10} />
      {/* Ambient moody fill */}
      <ambientLight intensity={0.8} color="#151924" />

      {/* Main Central Terracotta Clay Blob */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        <ClayBlob
          position={[0, 0.1, 0]}
          scale={isMobile ? 1.05 : 1.45}
          color="#e86034"
          roughness={0.58}
          distortSpeed={1.0}
          distortAmp={0.14}
        />
      </Float>

      {/* Satellite Floating Clay Spheres */}
      {!isMobile && (
        <>
          {/* Obsidian/Charcoal Clay Pebble */}
          <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.2}>
            <SatellitePebble
              position={[-2.4, 1.4, -0.6]}
              scale={0.55}
              color="#222838"
              orbitSpeed={0.4}
              phase={0}
            />
          </Float>

          {/* Deep Amber Pebble */}
          <Float speed={2.4} rotationIntensity={0.5} floatIntensity={1.0}>
            <SatellitePebble
              position={[2.5, -1.1, 0.4]}
              scale={0.48}
              color="#fa7347"
              orbitSpeed={0.5}
              phase={2.2}
            />
          </Float>

          {/* Slate Teal Telemetry Pebble */}
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.9}>
            <SatellitePebble
              position={[2.0, 1.8, -1.2]}
              scale={0.38}
              color="#2a9d8f"
              orbitSpeed={0.35}
              phase={4.1}
            />
          </Float>

          {/* Small Background Deep Obsidian Pebble */}
          <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
            <SatellitePebble
              position={[-1.9, -1.8, -1.5]}
              scale={0.32}
              color="#171b26"
              orbitSpeed={0.3}
              phase={1.5}
            />
          </Float>
        </>
      )}
    </group>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-44 w-44 animate-pulse rounded-full bg-[#e86034]/15 blur-2xl" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full select-none">
      {/* Background Soft Amber Radial Atmosphere */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e86034]/10 blur-[100px]" />
      
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="h-full w-full"
      >
        <SceneRig isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
