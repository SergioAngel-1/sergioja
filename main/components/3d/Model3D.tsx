'use client';

import { useState, useEffect, useRef } from 'react';
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
  mousePosition: { x: number; y: number };
  onAnimationComplete?: () => void;
}

// Detectar si estamos en un iframe
const isInIframe = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true; // Cross-origin iframe
  }
};

export default function Model3D({ mousePosition, onAnimationComplete }: Model3DProps) {
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
  
  // Detectar iframe al montar
  useEffect(() => {
    setInIframe(isInIframe());
  }, []);

  // Desactivar gyro si se activa low performance mode
  useEffect(() => {
    if (lowPerformanceMode && gyroEnabled) {
      setGyroEnabled(false);
      setShowGyroButton(false);
      setShowGyroHint(false);
      log.info('gyro_disabled_low_performance');
    }
  }, [lowPerformanceMode, gyroEnabled, log]);

  useEffect(() => {
    setMounted(true);
    log.info('model_mount');
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      log.info('model_ready');
      // Mostrar controles de giroscopio si NO está en bajo rendimiento
      if (!lowPerformanceMode && isMobile) {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          // iOS: Mostrar botón para solicitar permiso (NO activar gyroEnabled aún)
          log.info('gyro_button_shown_ios');
          setShowGyroButton(true);
          // NO setear gyroEnabled aquí - se activará después del permiso
        } else {
          // Android: Mostrar hint informativo y activar giroscopio
          log.info('gyro_hint_shown_android');
          setShowGyroHint(true);
          setGyroEnabled(true); // Activar inmediatamente en Android
          // Ocultar hint después de 5 segundos
          setTimeout(() => setShowGyroHint(false), 5000);
        }
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [lowPerformanceMode, log, isMobile]);

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

  // Desactivar backdrop-filter en iframe o low performance para evitar bugs de renderizado
  const disableBackdropBlur = inIframe || lowPerformanceMode;

  return (
    <div 
      className="relative w-full h-full"
      style={{
        isolation: 'isolate',
        borderRadius: '50%',
        overflow: 'hidden',
      }}
    >
      <ModelBackground disableBackdropBlur={disableBackdropBlur} />

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
                mousePosition={mousePosition}
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
