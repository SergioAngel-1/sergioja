'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, AdaptiveDpr, Preload } from '@react-three/drei';
import { Group, Quaternion, Euler, MathUtils, ACESFilmicToneMapping, SRGBColorSpace } from 'three';
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
  const groupRef = useRef<Group>(null);
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
  
  // Cache quaternions and euler to avoid recreating them every frame
  const targetQuatRef = useRef(new Quaternion());
  const targetEulerRef = useRef(new Euler());
  const tempQuatRef = useRef(new Quaternion());
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
            // Cleanup RAF when animation completes
            if (rafRef.current != null) {
              cancelAnimationFrame(rafRef.current);
            }
            rafRef.current = null;
          }
        };
        rafRef.current = requestAnimationFrame(pump);
      }
    };
  }, [invalidate]);

  // Cleanup RAF on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Clear smooth animation timer
      smoothUntilRef.current = 0;
    };
  }, []);
  // Pose base (esquina arriba-izquierda)
  const BASE_ROT_X = -0.2; // mirada ligeramente hacia arriba
  const BASE_ROT_Y = -0.1; // giro hacia la izquierda (aún menos sesgo)
  
  // Cargar modelo GLTF optimizado con Draco compression (-86.6% tamaño: 3.98MB → 0.53MB)
  const { scene } = useGLTF('/models/SergioJAModel-optimized.glb');

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


  useFrame((state) => {
    const now = state.clock.getElapsedTime();
    // Adaptive FPS: 20fps in low performance, 30fps normal
    const interval = lowPerformanceMode ? 1 / 20 : 1 / 30;
    if (now - tickRef.current < interval) return;
    tickRef.current = now;
    
    const group = groupRef.current;
    if (!group) return;
    
    // Keep rendering while model is interpolating (for smooth deceleration)
    schedule(200);
    
    // Mantener z estable (solo una vez)
    group.position.z = 0;
    
    if (animationProgress < 1) {
      // Durante la intro: interpolar de 0 a la pose base
      const tx = MathUtils.lerp(0, BASE_ROT_X, animationProgress);
      const ty = MathUtils.lerp(0, BASE_ROT_Y, animationProgress);
      targetEulerRef.current.set(tx, ty, 0, 'XYZ');
      targetQuatRef.current.setFromEuler(targetEulerRef.current);
      group.quaternion.slerp(targetQuatRef.current, 0.12);
    } else {
      // Después de la animación: calcular input de mouse/gyro
      let inputRotY = 0, inputRotX = 0;

      if (isMobile && !lowPerformanceMode) {
        // Mobile: usar giroscopio solo si NO es bajo rendimiento
        const { beta, gamma } = deviceOrientationRef.current;
        inputRotY = gamma * 0.00555555;  // Pre-calculado: (1/90) * 0.5
        inputRotX = beta * 0.00166666;   // Pre-calculado: (1/180) * 0.3
      } else if (!isMobile) {
        // Desktop: siempre seguir mouse
        inputRotY = mousePosition.x * 0.5;
        inputRotX = mousePosition.y * 0.3;
      }

      // Solo calcular si hay input (evitar cálculos innecesarios)
      if (inputRotY !== 0 || inputRotX !== 0 || animationProgress === 1) {
        targetEulerRef.current.set(
          BASE_ROT_X + inputRotX,
          BASE_ROT_Y + inputRotY,
          0,
          'XYZ'
        );
        targetQuatRef.current.setFromEuler(targetEulerRef.current);
        
        // Smooth damping optimizado
        const dampingFactor = lowPerformanceMode ? 0.02 : 0.03;
        group.quaternion.slerp(targetQuatRef.current, dampingFactor);
      }
    }
  });

  // Verificar si el modelo tiene contenido
  const hasContent = scene.children.length > 0;

  // Calcular escala para la animación de entrada (desde el centro)
  const scale = 3.0 * animationProgress;

  return (
    <group ref={groupRef}>
      {hasContent ? (
        <primitive object={scene} scale={scale} />
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
      <ambientLight intensity={1.2} />
      <hemisphereLight args={["#ffffff", "#222222", 0.8]} />
      <directionalLight position={[0, 1, 2]} intensity={1.0} castShadow={false} />
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
              shadows={false}
              gl={{ 
                antialias: !lowPerformanceMode, 
                alpha: true,
                preserveDrawingBuffer: false,
                powerPreference: lowPerformanceMode ? 'low-power' : 'high-performance',
                stencil: false,
                depth: true
              }}
              frameloop={'demand'}
              flat
              style={{ background: 'transparent' }}
              onCreated={({ gl, scene }) => { 
                gl.toneMapping = ACESFilmicToneMapping; 
                gl.outputColorSpace = SRGBColorSpace; 
                gl.toneMappingExposure = 1.3;
                scene.matrixAutoUpdate = false;
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

// Precargar el modelo optimizado para mejor rendimiento
useGLTF.preload('/models/SergioJAModel-optimized.glb');
