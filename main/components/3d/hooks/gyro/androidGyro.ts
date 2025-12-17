import { MutableRefObject } from 'react';
import { createOrientationHandler } from './createOrientationHandler';

interface AndroidGyroSetupParams {
  orientationRef: MutableRefObject<{ beta: number; gamma: number }>;
  hasValidDataRef: MutableRefObject<boolean>;
  listenerRef: MutableRefObject<((event: DeviceOrientationEvent) => void) | null>;
  setIsActive: (active: boolean) => void;
  onSensorActive?: () => void;
  onSensorLost?: () => void;
}

/**
 * Configuración de giroscopio para Android
 * No requiere permisos, se adjunta listener inmediatamente
 */
export function setupAndroidGyro({
  orientationRef,
  hasValidDataRef,
  listenerRef,
  setIsActive,
  onSensorActive,
  onSensorLost,
}: AndroidGyroSetupParams): void {
  const handleOrientation = createOrientationHandler({
    orientationRef,
    hasValidDataRef,
    setIsActive,
    onSensorActive,
    onSensorLost,
  });

  // Asignar ref ANTES de addEventListener para asegurar cleanup
  listenerRef.current = handleOrientation;
  
  window.addEventListener('deviceorientation', listenerRef.current, {
    passive: true,
  } as any);
}

/**
 * Cleanup del listener de Android
 */
export function cleanupAndroidGyro(
  listenerRef: MutableRefObject<((event: DeviceOrientationEvent) => void) | null>
): void {
  if (listenerRef.current) {
    window.removeEventListener('deviceorientation', listenerRef.current);
    listenerRef.current = null;
  }
}
