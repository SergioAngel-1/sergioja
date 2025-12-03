'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, AdaptiveDpr, Preload } from '@react-three/drei';
import * as THREE from 'three';
import Loader from '@/components/atoms/Loader';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useLogger } from '@/shared/hooks/useLogger';
import { usePerformance } from '@/lib/contexts/PerformanceContext';

interface Model3DProps {
  mousePosition: { x: number; y: number };
  onAnimationComplete?: () => void;
}

interface AnimatedModelProps {
  mousePosition: { x: number; y: number };
  gyroEnabled: boolean;
  lowPerformanceMode: boolean;
  onIntroAnimationEnd?: () => void;
}

function AnimatedModel({ mousePosition, gyroEnabled, lowPerformanceMode, onIntroAnimationEnd }: AnimatedModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const deviceOrientationRef = useRef<{ beta: number; gamma: number }>({ beta: 0, gamma: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const log = useLogger('AnimatedModel3D');
  const calledRef = useRef(false);
  const tickRef = useRef(0);
  const smoothUntilRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastInvalidateRef = useRef(0);
  const invalidate = useThree((state) => state.invalidate);
  const schedule = useMemo(() => {
    return (ms: number) => {
      const now = performance.now();
      if (now + ms > smoothUntilRef.current) smoothUntilRef.current = now + ms;
      if (rafRef.current == null) {
        const pump = () => {
          const t = performance.now();
          if (t < smoothUntilRef.current) {
            // Throttle renders to ~30fps
            if (t - lastInvalidateRef.current >= 33) {
              lastInvalidateRef.current = t;
              invalidate();
            }
            rafRef.current = requestAnimationFrame(pump);
          } else {
            rafRef.current = null;
          }
        };
        rafRef.current = requestAnimationFrame(pump);
      }
    };
  }, [invalidate]);
  // Pose base (esquina arriba-izquierda)
  const BASE_ROT_X = -0.2; // mirada ligeramente hacia arriba
  const BASE_ROT_Y = -0.1; // giro hacia la izquierda (aún menos sesgo)
  
  // Cargar modelo GLTF de Blender
  const { scene } = useGLTF('/models/SergioJAModel.glb');
  
  // Clonar la escena para evitar problemas de reutilización
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Detectar si es mobile y configurar giroscopio
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      return mobile;
    };

    const mobile = checkMobile();

    const handleOrientation = (event: DeviceOrientationEvent) => {
      deviceOrientationRef.current = {
        beta: event.beta || 0,   // Inclinación adelante-atrás (-180 a 180)
        gamma: event.gamma || 0  // Inclinación izquierda-derecha (-90 a 90)
      };
      schedule(150);
    };

    if (mobile && typeof DeviceOrientationEvent !== 'undefined') {
      // Solicitar permiso en iOS 13+
      const permissionNeeded = typeof (DeviceOrientationEvent as any).requestPermission === 'function';
      setNeedsPermission(permissionNeeded);
      if (permissionNeeded) {
        // En iOS, solo adjuntar listener cuando el padre indique que el permiso fue otorgado
        if (gyroEnabled) {
          window.addEventListener('deviceorientation', handleOrientation, { passive: true } as any);
        }
      } else {
        // Android o iOS antiguo - activar directamente
        window.addEventListener('deviceorientation', handleOrientation, { passive: true } as any);
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
          log.info('gyro_permission_granted');
          // El listener se adjunta desde el efecto cuando gyroEnabled es true en el padre
        }
      } catch (error) {
        log.error('gyro_permission_error', error as any);
      }
    }
  };

  // Animación de entrada - deshabilitada en bajo rendimiento
  useEffect(() => {
    if (lowPerformanceMode) {
      // En bajo rendimiento, aparecer instantáneamente
      setAnimationProgress(1);
      return;
    }
    
    let startTime = Date.now();
    const duration = 800;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);
      invalidate();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [lowPerformanceMode]);

  useEffect(() => {
    if (animationProgress >= 1 && !calledRef.current) {
      calledRef.current = true;
      onIntroAnimationEnd?.();
    }
  }, [animationProgress, onIntroAnimationEnd]);

  useEffect(() => {
    schedule(120);
  }, [mousePosition.x, mousePosition.y, schedule]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);


  useFrame((state) => {
    const now = state.clock.getElapsedTime();
    const interval = 1 / 30;
    if (now - tickRef.current < interval) return;
    tickRef.current = now;
    if (groupRef.current) {
      // Mantener z estable
      groupRef.current.position.z = 0;
      if (animationProgress < 1) {
        // Durante la intro: interpolar de 0 a la pose base (arriba-izquierda)
        const tx = THREE.MathUtils.lerp(0, BASE_ROT_X, animationProgress);
        const ty = THREE.MathUtils.lerp(0, BASE_ROT_Y, animationProgress);
        const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(tx, ty, 0, 'XYZ'));
        groupRef.current.quaternion.slerp(targetQuat, 0.12);
      } else if (!lowPerformanceMode) {
        // Después de la animación - solo si NO es bajo rendimiento
        let inputRotY, inputRotX;

        if (isMobile) {
          // Mobile: usar giroscopio
          // gamma: -90 (izquierda) a 90 (derecha)
          // beta: -180 (atrás) a 180 (adelante)
          const { beta, gamma } = deviceOrientationRef.current;
          inputRotY = (gamma / 90) * 0.5;  // -0.5..0.5
          inputRotX = (beta / 180) * 0.3;  // -0.3..0.3
        } else {
          // Desktop: usar mouse
          inputRotY = mousePosition.x * 0.5;
          inputRotX = mousePosition.y * 0.3;
        }
        // Mantener la pose base como neutra después de la intro
        const targetRotationY = BASE_ROT_Y + inputRotY;
        const targetRotationX = BASE_ROT_X + inputRotX;
        const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetRotationX, targetRotationY, 0, 'XYZ'));
        groupRef.current.quaternion.slerp(targetQuat, 0.1);
      } else {
        // Bajo rendimiento: fijar pose base estática
        groupRef.current.rotation.x = BASE_ROT_X;
        groupRef.current.rotation.y = BASE_ROT_Y;
        groupRef.current.rotation.z = 0;
      }
      // En bajo rendimiento, el modelo queda estático después de la animación inicial
    }
  });

  // Verificar si el modelo tiene contenido
  const hasContent = scene.children.length > 0;

  // Calcular escala para la animación de entrada (desde el centro)
  const scale = 3.0 * animationProgress;

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
      <ambientLight intensity={1.4} />
      <hemisphereLight args={["#ffffff", "#222222", 0.9]} />
      <directionalLight position={[0, 1, 2]} intensity={1.1} />
      {!lowPerformanceMode && (
        <pointLight position={[0, 1.2, 2.2]} intensity={2.2} color="#FFFFFF" />
      )}
    </group>
  );
}

export default function Model3D({ mousePosition, onAnimationComplete }: Model3DProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showGyroButton, setShowGyroButton] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const { t } = useLanguage();
  const log = useLogger('Model3D');
  const { lowPerformanceMode, mode } = usePerformance();

  useEffect(() => {
    setMounted(true);
    log.info('model_mount');
    const timer = setTimeout(() => {
      setIsLoading(false);
      log.info('model_ready');
      // Solo mostrar botón de giroscopio si NO está en bajo rendimiento
      if (!lowPerformanceMode) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          log.info('gyro_button_shown');
          setShowGyroButton(true);
        }
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [lowPerformanceMode]);

  const handleGyroPermission = async () => {
    log.interaction('gyro_enable_click');
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setShowGyroButton(false);
          setGyroEnabled(true);
          log.info('gyro_permission_granted');
        }
      } catch (error) {
        log.error('gyro_permission_error', error as any);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Fondo transparente con blur para ver hexágonos */}
      <div 
        className="absolute inset-0" 
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
      />
      
      {/* Patrón de puntos sutiles - siempre visible */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Contenido: Loader o Canvas */}
      {!mounted || isLoading ? (
        <>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader size="md" message={t('loader.loadingModel')} />
          </div>
          {gyroEnabled && !lowPerformanceMode ? (
            <div
              className="fixed left-1/2 -translate-x-1/2 z-10 pointer-events-none font-mono text-fluid-xs text-white/80 bg-black/40 border border-white/20 rounded-full backdrop-blur-sm whitespace-nowrap"
              style={{
                bottom: `calc(${fluidSizing.space.xl} + env(safe-area-inset-bottom))`,
                padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
              }}
            >
              {t('gyro.movePhone')}
            </div>
          ) : (
            showGyroButton && (
              <button
                onClick={handleGyroPermission}
                className="fixed left-1/2 -translate-x-1/2 bg-black text-white rounded-lg border-2 border-white shadow-lg hover:bg-white hover:text-black transition-colors duration-200 font-bold z-10 text-fluid-sm whitespace-nowrap"
                style={{
                  bottom: `calc(${fluidSizing.space.xl} + env(safe-area-inset-bottom))`,
                  padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
                }}
              >
                {t('gyro.enable')}
              </button>
            )
          )}
        </>
      ) : (
        <>
          {/* Canvas 3D con fondo transparente */}
          <div className="absolute inset-0 z-10">
            <Canvas
              key={mode}
              camera={{ position: [0, 0, 4], fov: 50 }}
              dpr={lowPerformanceMode ? 1 : [1, 1.25]}
              gl={{ 
                antialias: !lowPerformanceMode, 
                alpha: true,
                preserveDrawingBuffer: false,
                powerPreference: lowPerformanceMode ? 'low-power' : 'high-performance'
              }}
              frameloop={'demand'}
              style={{ background: 'transparent' }}
              onCreated={({ gl }) => { 
                gl.toneMapping = THREE.ACESFilmicToneMapping; 
                gl.outputColorSpace = THREE.SRGBColorSpace; 
                gl.toneMappingExposure = 1.4; 
              }}
            >
              <AnimatedModel mousePosition={mousePosition} gyroEnabled={gyroEnabled} lowPerformanceMode={lowPerformanceMode} onIntroAnimationEnd={onAnimationComplete} />
              <AdaptiveDpr />
              <Preload all />
            </Canvas>
          </div>

          {/* CTA o disclaimer en estado listo */}
          {gyroEnabled && !lowPerformanceMode ? (
            <div
              className="fixed left-1/2 -translate-x-1/2 z-10 pointer-events-none font-mono text-fluid-xs text-white/80 bg-black/40 border border-white/20 rounded-full backdrop-blur-sm whitespace-nowrap"
              style={{
                bottom: `calc(${fluidSizing.space.xl} + env(safe-area-inset-bottom))`,
                padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
              }}
            >
              {t('gyro.movePhone')}
            </div>
          ) : (
            showGyroButton && (
              <button
                onClick={handleGyroPermission}
                className="fixed left-1/2 -translate-x-1/2 bg-black text-white rounded-lg border-2 border-white shadow-lg hover:bg-white hover:text-black transition-colors duration-200 font-bold z-10 text-fluid-sm whitespace-nowrap"
                style={{
                  bottom: `calc(${fluidSizing.space.xl} + env(safe-area-inset-bottom))`,
                  padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
                }}
              >
                {t('gyro.enable')}
              </button>
            )
          )}
        </>
      )}
    </div>
  );
}

// Precargar el modelo para mejor rendimiento
useGLTF.preload('/models/SergioJAModel.glb');
