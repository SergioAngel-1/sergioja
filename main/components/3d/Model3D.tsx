'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Model3DProps {
  modelPath?: string;
  mousePosition: { x: number; y: number };
}

function AnimatedModel({ modelPath = '/models/avatar.gltf', mousePosition }: Model3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load GLTF model
  const { scene } = useGLTF(modelPath);

  useFrame(() => {
    if (groupRef.current) {
      // Smooth rotation based on mouse position
      const targetRotationY = mousePosition.x * 0.5;
      const targetRotationX = -mousePosition.y * 0.5;
      
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1} />
      
      {/* Lights */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, -5, -5]} intensity={0.7} />
      <pointLight position={[0, 0, 2]} intensity={2} color="#00BFFF" />
      <pointLight position={[-2, 0, 0]} intensity={1} color="#FF0000" />
      <pointLight position={[2, 0, 0]} intensity={1} color="#8B00FF" />
    </group>
  );
}

// Fallback component when no model is loaded
function FallbackSphere({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const targetRotationY = mousePosition.x * 0.5;
      const targetRotationX = -mousePosition.y * 0.5;
      
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#000000"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Simple eyes */}
      <mesh position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color="#00BFFF" 
          emissive="#00BFFF" 
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color="#00BFFF" 
          emissive="#00BFFF" 
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Lights */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[0, 0, 2]} intensity={2} color="#00BFFF" />
    </group>
  );
}

export default function Model3D({ 
  modelPath, 
  mousePosition 
}: { 
  modelPath?: string; 
  mousePosition: { x: number; y: number } 
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <color attach="background" args={['#FFFFFF']} />
      
      {modelPath ? (
        <AnimatedModel modelPath={modelPath} mousePosition={mousePosition} />
      ) : (
        <FallbackSphere mousePosition={mousePosition} />
      )}
    </Canvas>
  );
}

// Preload the model
useGLTF.preload('/models/avatar.gltf');
