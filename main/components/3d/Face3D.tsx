'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Ring } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedFaceProps {
  mousePosition: { x: number; y: number };
}

function AnimatedFace({ mousePosition }: AnimatedFaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth rotation based on mouse position
      const targetRotationY = mousePosition.x * 0.5;
      const targetRotationX = -mousePosition.y * 0.5;
      
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    }

    // Rotate ring
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer ring */}
      <Ring ref={ringRef} args={[1.8, 1.85, 64]} rotation={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#00BFFF" 
          emissive="#00BFFF" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Ring>

      {/* Main face sphere */}
      <Sphere args={[1, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          color="#000000"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>

      {/* Eyes with glow */}
      <Sphere args={[0.15, 32, 32]} position={[-0.3, 0.2, 0.8]}>
        <meshStandardMaterial 
          color="#00BFFF" 
          emissive="#00BFFF" 
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </Sphere>
      <Sphere args={[0.15, 32, 32]} position={[0.3, 0.2, 0.8]}>
        <meshStandardMaterial 
          color="#00BFFF" 
          emissive="#00BFFF" 
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </Sphere>

      {/* Eye glow spheres */}
      <Sphere args={[0.2, 32, 32]} position={[-0.3, 0.2, 0.8]}>
        <meshStandardMaterial 
          color="#00BFFF" 
          transparent
          opacity={0.3}
          emissive="#00BFFF" 
          emissiveIntensity={0.8}
        />
      </Sphere>
      <Sphere args={[0.2, 32, 32]} position={[0.3, 0.2, 0.8]}>
        <meshStandardMaterial 
          color="#00BFFF" 
          transparent
          opacity={0.3}
          emissive="#00BFFF" 
          emissiveIntensity={0.8}
        />
      </Sphere>

      {/* Mouth - enhanced */}
      <mesh position={[0, -0.2, 0.7]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.3, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000" 
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* Accent lines */}
      <mesh position={[-0.6, 0, 0.6]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.02, 0.3, 0.02]} />
        <meshStandardMaterial color="#8B00FF" emissive="#8B00FF" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.6, 0, 0.6]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.02, 0.3, 0.02]} />
        <meshStandardMaterial color="#8B00FF" emissive="#8B00FF" emissiveIntensity={0.8} />
      </mesh>

      {/* Ambient lights */}
      <pointLight position={[0, 0, 2]} intensity={2} color="#00BFFF" />
      <pointLight position={[-2, 0, 0]} intensity={1} color="#FF0000" />
      <pointLight position={[2, 0, 0]} intensity={1} color="#8B00FF" />
    </group>
  );
}

export default function Face3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { width, height } = currentTarget.getBoundingClientRect();
    
    // Normalize mouse position to -1 to 1 range
    const x = (clientX / width) * 2 - 1;
    const y = (clientY / height) * 2 - 1;
    
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="w-full h-full"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#FFFFFF']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, -5]} intensity={0.7} />
        <spotLight position={[0, 10, 0]} intensity={0.5} />
        
        <AnimatedFace mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
