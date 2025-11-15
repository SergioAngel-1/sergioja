'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Loader from '@/components/atoms/Loader';
import { fluidSizing } from '@/lib/fluidSizing';

interface Model3DProps {
  mousePosition: { x: number; y: number };
}

interface AnimatedModelProps {
  mousePosition: { x: number; y: number };
  gyroEnabled: boolean;
}

function AnimatedModel({ mousePosition, gyroEnabled }: AnimatedModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [deviceOrientation, setDeviceOrientation] = useState({ beta: 0, gamma: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  
  // Cargar modelo GLTF de Blender
  const { scene } = useGLTF('/models/SergioJAModel.glb');
  
  // Clonar la escena para evitar problemas de reutilización
  const clonedScene = scene.clone();

  // Detectar si es mobile y configurar giroscopio
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      return mobile;
    };

    const mobile = checkMobile();

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        beta: event.beta || 0,   // Inclinación adelante-atrás (-180 a 180)
        gamma: event.gamma || 0  // Inclinación izquierda-derecha (-90 a 90)
      });
    };

    if (mobile && typeof DeviceOrientationEvent !== 'undefined') {
      // Solicitar permiso en iOS 13+
      const permissionNeeded = typeof (DeviceOrientationEvent as any).requestPermission === 'function';
      setNeedsPermission(permissionNeeded);
      if (permissionNeeded) {
        // En iOS, solo adjuntar listener cuando el padre indique que el permiso fue otorgado
        if (gyroEnabled) {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } else {
        // Android o iOS antiguo - activar directamente
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gyroEnabled]);

  // Función para solicitar permisos de giroscopio (iOS)
  const requestGyroPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setNeedsPermission(false);
          window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
            setDeviceOrientation({
              beta: event.beta || 0,
              gamma: event.gamma || 0
            });
          });
        }
      } catch (error) {
        console.error('Error requesting gyroscope permission:', error);
      }
    }
  };

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
        // Después de la animación
        let targetRotationY, targetRotationX;

        if (isMobile) {
          // Mobile: usar giroscopio
          // gamma: -90 (izquierda) a 90 (derecha)
          // beta: -180 (atrás) a 180 (adelante)
          targetRotationY = (deviceOrientation.gamma / 90) * 0.5;  // Normalizar a -0.5 a 0.5
          targetRotationX = (deviceOrientation.beta / 180) * 0.3;  // Normalizar a -0.3 a 0.3
        } else {
          // Desktop: usar mouse
          targetRotationY = mousePosition.x * 0.5;
          targetRotationX = mousePosition.y * 0.3;
        }
        
        groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      }
    }
  });

  // Verificar si el modelo tiene contenido
  const hasContent = scene.children.length > 0;

  // Calcular escala para la animación de entrada (desde el centro)
  const scale = 3.5 * animationProgress;

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
  const [showGyroButton, setShowGyroButton] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simular tiempo de carga mínimo para mostrar el loader
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Verificar si necesita permisos de giroscopio
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setShowGyroButton(true);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleGyroPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setShowGyroButton(false);
          setGyroEnabled(true);
        }
      } catch (error) {
        console.error('Error requesting gyroscope permission:', error);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Fondo con gradiente radial - siempre visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100" />
      
      {/* Patrón de puntos sutiles - siempre visible */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Glow central - siempre visible */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)'
        }}
      />

      {/* Contenido: Loader o Canvas */}
      {!mounted || isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader size="md" message="CARGANDO MODELO" />
        </div>
      ) : (
        <>
          {/* Canvas 3D con fondo transparente */}
          <div className="absolute inset-0 z-10">
            <Canvas
              camera={{ position: [0, 0, 4], fov: 50 }}
              gl={{ 
                antialias: true, 
                alpha: true,
                preserveDrawingBuffer: true
              }}
              style={{ background: 'transparent' }}
            >
              <AnimatedModel mousePosition={mousePosition} gyroEnabled={gyroEnabled} />
            </Canvas>
          </div>

          {/* Botón para activar giroscopio en iOS */}
          {showGyroButton && (
            <button
              onClick={handleGyroPermission}
              className="absolute left-1/2 -translate-x-1/2 bg-black text-white rounded-lg border-2 border-white shadow-lg hover:bg-white hover:text-black transition-colors duration-200 font-bold z-20 text-fluid-sm"
              style={{ bottom: fluidSizing.space.md, padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
            >
              ACTIVAR GIROSCOPIO
            </button>
          )}
        </>
      )}
    </div>
  );
}

// Precargar el modelo para mejor rendimiento
useGLTF.preload('/models/SergioJAModel.glb');
