import { useRef, useEffect, MutableRefObject } from 'react';
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
  mousePosition: MutableRefObject<{ x: number; y: number }>;
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

  const schedule = useRenderScheduler(invalidate);
  const animationProgressRef = useModelAnimation({
    lowPerformanceMode,
    onComplete: onIntroAnimationEnd,
    invalidate,
  });
  const { orientation, isMobile, isActive, requestPermission } = useDeviceOrientation(gyroEnabled, schedule);

  useEffect(() => {
    if (onGyroRequestPermissionReady && requestPermission) {
      onGyroRequestPermissionReady(requestPermission);
    }
  }, [requestPermission, onGyroRequestPermissionReady]);

  const { targetPosition, isModalOpen, modalClosedTimestamp } = useModelTarget();

  // Cache quaternions and euler to avoid recreating them every frame
  const targetQuatRef = useRef(new Quaternion());
  const targetEulerRef = useRef(new Euler());

  const buttonTargetRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const canUseGyroRef = useRef(true);

  const { scene } = useGLTF(MODEL_PATH);

  // Initialize group scale to 0 so the intro animation starts from nothing
  useEffect(() => {
    if (groupRef.current) groupRef.current.scale.setScalar(0);
  }, []);

  // Cleanup: Dispose of Three.js resources to prevent memory leaks
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose();
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

  useEffect(() => {
    if (targetPosition && isMobile) {
      buttonTargetRef.current = { x: targetPosition.x, y: targetPosition.y, active: true };
      schedule(200);

      const timeout = setTimeout(() => {
        buttonTargetRef.current.active = false;
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [targetPosition, isMobile, schedule]);

  useEffect(() => {
    if (modalClosedTimestamp) {
      buttonTargetRef.current.active = false;
      canUseGyroRef.current = false;
      const timeout = setTimeout(() => {
        canUseGyroRef.current = true;
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [modalClosedTimestamp]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const now = state.clock.getElapsedTime();
    const interval = lowPerformanceMode ? 1 / 30 : 1 / 60;
    if (now - tickRef.current < interval) return;
    tickRef.current = now;

    const progress = animationProgressRef.current;

    // Apply scale from animation progress (avoids React re-renders for scale)
    group.scale.setScalar(3.0 * progress);
    group.position.z = 0;

    if (progress < 1) {
      // Intro animation
      const tx = MathUtils.lerp(0, BASE_ROT_X, progress);
      const ty = MathUtils.lerp(0, BASE_ROT_Y, progress);
      targetEulerRef.current.set(tx, ty, 0, 'XYZ');
      targetQuatRef.current.setFromEuler(targetEulerRef.current);
      group.quaternion.slerp(targetQuatRef.current, 0.15);
      return;
    }

    let targetRotY = 0;
    let targetRotX = 0;

    if (isMobile && buttonTargetRef.current.active) {
      targetRotY = MathUtils.clamp(buttonTargetRef.current.x * 0.5, -0.5, 0.5);
      targetRotX = MathUtils.clamp(buttonTargetRef.current.y * 0.35, -0.35, 0.35);
    } else if (isMobile && !lowPerformanceMode && !isModalOpen && canUseGyroRef.current) {
      const { beta, gamma } = orientation;
      targetRotY = MathUtils.clamp(gamma * 0.00555555, -0.4, 0.4);
      targetRotX = MathUtils.clamp(beta * 0.00166666, -0.25, 0.25);
    } else if (!isMobile) {
      // Read mouse position from ref — no React re-render needed
      targetRotY = MathUtils.clamp(mousePosition.current.x * 0.4, -0.4, 0.4);
      targetRotX = MathUtils.clamp(mousePosition.current.y * 0.25, -0.25, 0.25);
    }

    targetEulerRef.current.set(BASE_ROT_X + targetRotX, BASE_ROT_Y + targetRotY, 0, 'XYZ');
    targetQuatRef.current.setFromEuler(targetEulerRef.current);

    const dampingFactor = lowPerformanceMode ? 0.08 : 0.15;
    group.quaternion.slerp(targetQuatRef.current, dampingFactor);
  });

  const hasContent = scene.children.length > 0;

  return (
    <group ref={groupRef}>
      {hasContent ? <primitive object={scene} /> : <ModelFallback />}
      <ModelLighting lowPerformanceMode={lowPerformanceMode} />
    </group>
  );
}

// Preload model
useGLTF.preload(MODEL_PATH);
