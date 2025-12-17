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
  onGyroRequestPermissionReady?: (requestFn: () => Promise<boolean>) => void;
}

const BASE_ROT_X = -0.2;
const BASE_ROT_Y = -0.1;
const MODEL_PATH = '/models/SergioJAModel-optimized.glb';

export function AnimatedModel({
  mousePosition,
  gyroEnabled,
  lowPerformanceMode,
  onIntroAnimationEnd,
  onGyroRequestPermissionReady,
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
  const { orientation, isMobile, isSupported, isActive, requestPermission } = useDeviceOrientation(gyroEnabled, schedule);
  
  // Exponer requestPermission a Model3D
  useEffect(() => {
    if (onGyroRequestPermissionReady && requestPermission) {
      onGyroRequestPermissionReady(requestPermission);
    }
  }, [requestPermission, onGyroRequestPermissionReady]);
  const { targetPosition, isModalOpen, modalClosedTimestamp } = useModelTarget();

  // Cache quaternions and euler to avoid recreating them every frame
  const targetQuatRef = useRef(new Quaternion());
  const targetEulerRef = useRef(new Euler());
  
  // Smooth interpolation state
  const currentRotRef = useRef({ x: BASE_ROT_X, y: BASE_ROT_Y });
  const velocityRef = useRef({ x: 0, y: 0 });
  const buttonTargetRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const canUseGyroRef = useRef(true); // Cache para evitar Date.now() en cada frame

  // Cargar modelo GLTF optimizado
  const { scene } = useGLTF(MODEL_PATH);

  // Cleanup: Dispose of Three.js resources to prevent memory leaks
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((child: any) => {
          // Dispose geometries
          if (child.geometry) {
            child.geometry.dispose();
          }
          
          // Dispose materials
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material: any) => {
                if (material.map) material.map.dispose();
                if (material.lightMap) material.lightMap.dispose();
                if (material.bumpMap) material.bumpMap.dispose();
                if (material.normalMap) material.normalMap.dispose();
                if (material.specularMap) material.specularMap.dispose();
                if (material.envMap) material.envMap.dispose();
                material.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              if (child.material.lightMap) child.material.lightMap.dispose();
              if (child.material.bumpMap) child.material.bumpMap.dispose();
              if (child.material.normalMap) child.material.normalMap.dispose();
              if (child.material.specularMap) child.material.specularMap.dispose();
              if (child.material.envMap) child.material.envMap.dispose();
              child.material.dispose();
            }
          }
        });
        
        log.debug('Three.js resources disposed', { modelPath: MODEL_PATH });
      }
    };
  }, [scene, log]);

  // Mouse movement triggers re-render automatically via frameloop='always'

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

  // Handle gyro delay after modal closes (optimized with ref)
  useEffect(() => {
    if (modalClosedTimestamp) {
      canUseGyroRef.current = false;
      const timeout = setTimeout(() => {
        canUseGyroRef.current = true;
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [modalClosedTimestamp]);

  // Frame animation loop
  useFrame((state, delta) => {
    const now = state.clock.getElapsedTime();
    // Throttle to target FPS: 30fps in low performance, 60fps normal
    const interval = lowPerformanceMode ? 1 / 30 : 1 / 60;
    if (now - tickRef.current < interval) return;
    tickRef.current = now;

    const group = groupRef.current;
    if (!group) return;

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
      else if (isMobile && !lowPerformanceMode && !isModalOpen && canUseGyroRef.current) {
        const { beta, gamma } = orientation;
        targetRotY = MathUtils.clamp(gamma * 0.00555555, -0.4, 0.4);
        targetRotX = MathUtils.clamp(beta * 0.00166666, -0.25, 0.25);
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

      // Apply smooth rotation
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
