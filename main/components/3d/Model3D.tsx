'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import Loader from '@/components/atoms/Loader';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useLogger } from '@/shared/hooks/useLogger';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { AnimatedModel } from './components/AnimatedModel';
import { ModelBackground } from './components/ModelBackground';
import { GyroControls } from './components/GyroControls';

interface Model3DProps {
  mousePosition: { x: number; y: number };
  onAnimationComplete?: () => void;
}

export default function Model3D({ mousePosition, onAnimationComplete }: Model3DProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showGyroButton, setShowGyroButton] = useState(false);
  const [showGyroHint, setShowGyroHint] = useState(false);
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
      // Mostrar controles de giroscopio si NO está en bajo rendimiento
      if (!lowPerformanceMode) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
          if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            // iOS: Mostrar botón para solicitar permiso
            log.info('gyro_button_shown_ios');
            setShowGyroButton(true);
          } else {
            // Android: Mostrar hint informativo (giroscopio ya activo)
            log.info('gyro_hint_shown_android');
            setShowGyroHint(true);
            setGyroEnabled(true); // Activar inmediatamente en Android
            // Ocultar hint después de 5 segundos
            setTimeout(() => setShowGyroHint(false), 5000);
          }
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
      <ModelBackground />

      {/* Contenido: Loader o Canvas */}
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
          {showGyroHint && (
            <div
              className="fixed left-1/2 -translate-x-1/2 z-10 pointer-events-none font-mono text-fluid-xs text-white/80 bg-black/60 border border-white/30 rounded-full backdrop-blur-sm whitespace-nowrap px-4 py-2 animate-fade-in"
              style={{
                bottom: 'calc(2rem + env(safe-area-inset-bottom))',
              }}
            >
              {t('gyro.movePhone')}
            </div>
          )}
        </>
      ) : (
        <>
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
                depth: true,
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
              <AnimatedModel
                mousePosition={mousePosition}
                gyroEnabled={gyroEnabled}
                lowPerformanceMode={lowPerformanceMode}
                onIntroAnimationEnd={onAnimationComplete}
              />
              <AdaptiveDpr />
              <Preload all />
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
          {showGyroHint && (
            <div
              className="fixed left-1/2 -translate-x-1/2 z-10 pointer-events-none font-mono text-fluid-xs text-white/80 bg-black/60 border border-white/30 rounded-full backdrop-blur-sm whitespace-nowrap px-4 py-2 animate-fade-in"
              style={{
                bottom: 'calc(2rem + env(safe-area-inset-bottom))',
              }}
            >
              {t('gyro.movePhone')}
            </div>
          )}
        </>
      )}
    </div>
  );
}
