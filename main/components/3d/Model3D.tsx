'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Model3DProps {
  mousePosition: { x: number; y: number };
}

function AnimatedModel({ mousePosition }: Model3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Cargar modelo GLTF de Blender
  const { scene } = useGLTF('/models/SergioJAModel.gltf');
  
  // Clonar la escena para evitar problemas de reutilización
  const clonedScene = scene.clone();

  useFrame(() => {
    if (groupRef.current) {
      // Rotación suave basada en la posición del mouse
      const targetRotationY = mousePosition.x * 0.5;
      const targetRotationX = -mousePosition.y * 0.3;
      
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={1.5} />
      
      {/* Iluminación optimizada para modelo monocromático */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <pointLight position={[0, 2, 2]} intensity={1.5} color="#FFFFFF" />
    </group>
  );
}

export default function Model3D({ mousePosition }: Model3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-cyber-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {/* Fondo blanco del círculo */}
      <color attach="background" args={['#FFFFFF']} />
      
      <AnimatedModel mousePosition={mousePosition} />
    </Canvas>
  );
}

// Precargar el modelo para mejor rendimiento
useGLTF.preload('/models/SergioJAModel.gltf');
