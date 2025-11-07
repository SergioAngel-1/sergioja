'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Loader from '@/components/atoms/Loader';

interface Model3DProps {
  mousePosition: { x: number; y: number };
}

function AnimatedModel({ mousePosition }: Model3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Cargar modelo GLTF de Blender
  const { scene } = useGLTF('/models/SergioJAModel.glb');
  
  // Clonar la escena para evitar problemas de reutilización
  const clonedScene = scene.clone();

  // Animación de entrada
  useEffect(() => {
    let startTime = Date.now();
    const duration = 1500; // 1.5 segundos
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      if (animationProgress < 1) {
        // Durante la animación de entrada, rotar suavemente
        groupRef.current.rotation.y = animationProgress * Math.PI * 2;
      } else {
        // Después de la animación, seguir el mouse
        const targetRotationY = mousePosition.x * 0.5;
        const targetRotationX = mousePosition.y * 0.3;
        
        groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      }
    }
  });

  // Verificar si el modelo tiene contenido
  const hasContent = scene.children.length > 0;

  // Calcular escala para la animación de entrada (desde el centro)
  const scale = 5.5 * animationProgress;

  return (
    <group ref={groupRef}>
      {hasContent ? (
        <primitive object={clonedScene} scale={scale} />
      ) : (
        // Fallback: Esfera temporal si el modelo está vacío
        <>
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
              color="#000000"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <mesh position={[-0.3, 0.2, 0.9]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              emissive="#FFFFFF" 
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[0.3, 0.2, 0.9]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              emissive="#FFFFFF" 
              emissiveIntensity={2}
            />
          </mesh>
        </>
      )}
      
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Simular tiempo de carga mínimo para mostrar el loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <Loader size="md" message="CARGANDO MODELO" />
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
useGLTF.preload('/models/SergioJAModel.glb');
