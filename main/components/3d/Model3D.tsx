'use client';

import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import Loader from '@/components/atoms/Loader';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useLogger } from '@/shared/hooks/useLogger';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { AnimatedModel } from './components/AnimatedModel';
import { ModelBackground } from './components/ModelBackground';
import { GyroControls } from './components/GyroControls';

interface Model3DProps {
  mousePositionRef: MutableRefObject<{ x: number; y: number }>;
  onAnimationComplete?: () => void;
}

const isInIframe = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

export default function Model3D({ mousePositionRef, onAnimationComplete }: Model3DProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showGyroButton, setShowGyroButton] = useState(false);
  const [showGyroHint, setShowGyroHint] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [inIframe, setInIframe] = useState(false);
  const gyroRequestPermissionRef = useRef<(() => Promise<boolean>) | null>(null);
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const log = useLogger('Model3D');
  const { lowPerformanceMode, mode } = usePerformance();

  useEffect(() => {
    setInIframe(isInIframe());
  }, []);

  // Mount and loading timer are separated from condition-dependent logic so the
  // 1500ms timer only fires once — previously lowPerformanceMode/isMobile in deps
  // could reset the timer causing a 3s load on slow devices
  useEffect(() => {
    setMounted(true);
    log.info('model_mount');
  }, [log]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      log.info('model_ready');
    }, 1500);
    return () => clearTimeout(timer);
  }, [log]);

  // Gyro setup runs after loading completes and reacts to condition changes
  useEffect(() => {
    if (isLoading || lowPerformanceMode || !isMobile) return;

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      log.info('gyro_button_shown_ios');
      setShowGyroButton(true);
    } else {
      log.info('gyro_hint_shown_android');
      setShowGyroHint(true);
      setGyroEnabled(true);
      const hintTimer = setTimeout(() => setShowGyroHint(false), 5000);
      return () => clearTimeout(hintTimer);
    }
  }, [isLoading, lowPerformanceMode, isMobile, log]);

  useEffect(() => {
    if (lowPerformanceMode && gyroEnabled) {
      setGyroEnabled(false);
      setShowGyroButton(false);
      setShowGyroHint(false);
      log.info('gyro_disabled_low_performance');
    }
  }, [lowPerformanceMode, gyroEnabled, log]);

  const handleGyroPermission = async () => {
    log.interaction('gyro_enable_click');
    if (gyroRequestPermissionRef.current) {
      const granted = await gyroRequestPermissionRef.current();
      if (granted) {
        setShowGyroButton(false);
        setGyroEnabled(true);
        log.info('gyro_permission_granted');
      }
    }
  };

  const disableBackdropBlur = inIframe || lowPerformanceMode;

  return (
    <div
      className="relative w-full h-full"
      style={{ isolation: 'isolate', borderRadius: '50%', overflow: 'hidden' }}
    >
      <ModelBackground disableBackdropBlur={disableBackdropBlur} />

      {!mounted || isLoading ? (
        <>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader size="md" message={t('loader.loadingModel')} />
          </div>
          <GyroControls
            showButton={showGyroButton}
            gyroEnabled={gyroEnabled}
            lowPerformanceMode={lowPerformanceMode}
            onEnableGyro={handleGyroPermission}
            enableLabel={t('gyro.enable')}
            movePhoneLabel={t('gyro.movePhone')}
          />
        </>
      ) : (
        <>
          <div className="absolute inset-0 z-10">
            <Canvas
              camera={{ position: [0, 0, 4], fov: 50 }}
              dpr={lowPerformanceMode ? 1 : [1, 1.25]}
              shadows={false}
              gl={{
                antialias: !lowPerformanceMode,
                alpha: true,
                preserveDrawingBuffer: false,
                powerPreference: lowPerformanceMode ? 'low-power' : 'high-performance',
                stencil: false,
                depth: true,
              }}
              frameloop="always"
              flat
              style={{ background: 'transparent' }}
              onCreated={({ gl }) => {
                gl.toneMapping = ACESFilmicToneMapping;
                gl.outputColorSpace = SRGBColorSpace;
                gl.toneMappingExposure = 1.3;
              }}
            >
              <AnimatedModel
                mousePosition={mousePositionRef}
                gyroEnabled={gyroEnabled}
                lowPerformanceMode={lowPerformanceMode}
                onIntroAnimationEnd={onAnimationComplete}
                onGyroRequestPermissionReady={(requestFn) => {
                  gyroRequestPermissionRef.current = requestFn;
                }}
              />
              {!lowPerformanceMode && <AdaptiveDpr />}
            </Canvas>
          </div>

          <GyroControls
            showButton={showGyroButton}
            gyroEnabled={gyroEnabled}
            lowPerformanceMode={lowPerformanceMode}
            onEnableGyro={handleGyroPermission}
            enableLabel={t('gyro.enable')}
            movePhoneLabel={t('gyro.movePhone')}
          />
        </>
      )}
    </div>
  );
}
