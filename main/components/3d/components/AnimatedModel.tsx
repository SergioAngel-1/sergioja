import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, Quaternion, Euler, MathUtils } from 'three';
import { useLogger } from '@/shared/hooks/useLogger';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { useModelAnimation } from '../hooks/useModelAnimation';
import { useRenderScheduler } from '../hooks/useRenderScheduler';
import { ModelLighting } from './ModelLighting';
import { ModelFallback } from './ModelFallback';
import { useModelTarget } from '@/lib/contexts/ModelTargetContext';

interface AnimatedModelProps {
  mousePosition: { x: number; y: number };
  gyroEnabled: boolean;
  lowPerformanceMode: boolean;
  onIntroAnimationEnd?: () => void;
}

const BASE_ROT_X = -0.2;
const BASE_ROT_Y = -0.1;
const MODEL_PATH = '/models/SergioJAModel-optimized.glb';

export function AnimatedModel({
  mousePosition,
  gyroEnabled,
  lowPerformanceMode,
  onIntroAnimationEnd,
}: AnimatedModelProps) {
  const groupRef = useRef<Group>(null);
  const tickRef = useRef(0);
  const log = useLogger('AnimatedModel3D');
  const invalidate = useThree((state) => state.invalidate);

  // Hooks personalizados
  const schedule = useRenderScheduler(invalidate);
  const animationProgress = useModelAnimation({
    lowPerformanceMode,
    onComplete: onIntroAnimationEnd,
    invalidate,
  });
  const { orientation, isMobile, isSupported, isActive } = useDeviceOrientation(gyroEnabled, schedule);
  const { targetPosition, isModalOpen, modalClosedTimestamp } = useModelTarget();

  // Cache quaternions and euler to avoid recreating them every frame
  const targetQuatRef = useRef(new Quaternion());
  const targetEulerRef = useRef(new Euler());
  
  // Smooth interpolation state
  const currentRotRef = useRef({ x: BASE_ROT_X, y: BASE_ROT_Y });
  const velocityRef = useRef({ x: 0, y: 0 });
  const buttonTargetRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Cargar modelo GLTF optimizado
  const { scene } = useGLTF(MODEL_PATH);

  // Trigger schedule on mouse movement
  useEffect(() => {
    schedule(120);
  }, [mousePosition.x, mousePosition.y, schedule]);

  // Handle button target position (mobile only)
  useEffect(() => {
    if (targetPosition && isMobile) {
      buttonTargetRef.current = {
        x: targetPosition.x,
        y: targetPosition.y,
        active: true,
      };
      schedule(200);
      
      // Desactivar después de 2 segundos
      const timeout = setTimeout(() => {
        buttonTargetRef.current.active = false;
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [targetPosition, isMobile, schedule]);

  // Frame animation loop
  useFrame((state, delta) => {
    const now = state.clock.getElapsedTime();
    // Higher FPS for smoother animation: 30fps in low performance, 60fps normal
    const interval = lowPerformanceMode ? 1 / 30 : 1 / 60;
    if (now - tickRef.current < interval) return;
    tickRef.current = now;

    const group = groupRef.current;
    if (!group) return;

    schedule(200);
    group.position.z = 0;

    if (animationProgress < 1) {
      // Intro animation
      const tx = MathUtils.lerp(0, BASE_ROT_X, animationProgress);
      const ty = MathUtils.lerp(0, BASE_ROT_Y, animationProgress);
      targetEulerRef.current.set(tx, ty, 0, 'XYZ');
      targetQuatRef.current.setFromEuler(targetEulerRef.current);
      group.quaternion.slerp(targetQuatRef.current, 0.15);
    } else {
      // Interactive animation with smooth interpolation
      let targetRotY = 0;
      let targetRotX = 0;

      // Prioridad 1: Botón clickeado en mobile
      if (isMobile && buttonTargetRef.current.active) {
        targetRotY = MathUtils.clamp(buttonTargetRef.current.x * 0.5, -0.5, 0.5);
        targetRotX = MathUtils.clamp(buttonTargetRef.current.y * 0.35, -0.35, 0.35);
      }
      // Prioridad 2: Giroscopio en mobile (deshabilitado si modal está abierto o recién cerrado)
      else if (isMobile && !lowPerformanceMode && !isModalOpen) {
        // Esperar 500ms después de cerrar modal para que termine animación de reinserción
        const gyroDelay = 500;
        const canUseGyro = !modalClosedTimestamp || (Date.now() - modalClosedTimestamp > gyroDelay);
        
        if (canUseGyro) {
          const { beta, gamma } = orientation;
          targetRotY = MathUtils.clamp(gamma * 0.00555555, -0.4, 0.4);
          targetRotX = MathUtils.clamp(beta * 0.00166666, -0.25, 0.25);
        }
      }
      // Prioridad 3: Mouse en desktop
      else if (!isMobile) {
        targetRotY = MathUtils.clamp(mousePosition.x * 0.4, -0.4, 0.4);
        targetRotX = MathUtils.clamp(mousePosition.y * 0.25, -0.25, 0.25);
      }

      // Exponential smoothing for ultra-smooth movement
      const smoothFactor = lowPerformanceMode ? 0.08 : 0.12;
      currentRotRef.current.x += (targetRotX - currentRotRef.current.x) * smoothFactor;
      currentRotRef.current.y += (targetRotY - currentRotRef.current.y) * smoothFactor;

      // Velocity-based damping for natural deceleration
      const newVelX = currentRotRef.current.x - (velocityRef.current.x || 0);
      const newVelY = currentRotRef.current.y - (velocityRef.current.y || 0);
      velocityRef.current.x = currentRotRef.current.x;
      velocityRef.current.y = currentRotRef.current.y;

      // Apply smooth rotation with velocity consideration
      const finalRotX = BASE_ROT_X + currentRotRef.current.x;
      const finalRotY = BASE_ROT_Y + currentRotRef.current.y;
      
      targetEulerRef.current.set(finalRotX, finalRotY, 0, 'XYZ');
      targetQuatRef.current.setFromEuler(targetEulerRef.current);

      // Higher damping factor for smoother interpolation
      const dampingFactor = lowPerformanceMode ? 0.06 : 0.1;
      group.quaternion.slerp(targetQuatRef.current, dampingFactor);
    }
  });

  const hasContent = scene.children.length > 0;
  const scale = 3.0 * animationProgress;

  return (
    <group ref={groupRef}>
      {hasContent ? <primitive object={scene} scale={scale} /> : <ModelFallback />}
      <ModelLighting lowPerformanceMode={lowPerformanceMode} />
    </group>
  );
}

// Preload model
useGLTF.preload(MODEL_PATH);
