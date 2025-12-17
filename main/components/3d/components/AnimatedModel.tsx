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
  const { orientation, isMobile } = useDeviceOrientation(gyroEnabled, schedule);

  // Cache quaternions and euler to avoid recreating them every frame
  const targetQuatRef = useRef(new Quaternion());
  const targetEulerRef = useRef(new Euler());

  // Cargar modelo GLTF optimizado
  const { scene } = useGLTF(MODEL_PATH);

  // Trigger schedule on mouse movement
  useEffect(() => {
    schedule(120);
  }, [mousePosition.x, mousePosition.y, schedule]);

  // Frame animation loop
  useFrame((state) => {
    const now = state.clock.getElapsedTime();
    const interval = lowPerformanceMode ? 1 / 20 : 1 / 30;
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
      group.quaternion.slerp(targetQuatRef.current, 0.12);
    } else {
      // Interactive animation
      let inputRotY = 0,
        inputRotX = 0;

      if (isMobile && !lowPerformanceMode) {
        const { beta, gamma } = orientation;
        inputRotY = gamma * 0.00555555;
        inputRotX = beta * 0.00166666;
      } else if (!isMobile) {
        inputRotY = mousePosition.x * 0.5;
        inputRotX = mousePosition.y * 0.3;
      }

      if (inputRotY !== 0 || inputRotX !== 0 || animationProgress === 1) {
        targetEulerRef.current.set(BASE_ROT_X + inputRotX, BASE_ROT_Y + inputRotY, 0, 'XYZ');
        targetQuatRef.current.setFromEuler(targetEulerRef.current);

        const dampingFactor = lowPerformanceMode ? 0.02 : 0.03;
        group.quaternion.slerp(targetQuatRef.current, dampingFactor);
      }
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
