import { MutableRefObject } from 'react';
import { createOrientationHandler } from './createOrientationHandler';

interface IOSGyroPermissionParams {
  orientationRef: MutableRefObject<{ beta: number; gamma: number }>;
  hasValidDataRef: MutableRefObject<boolean>;
  listenerRef: MutableRefObject<((event: DeviceOrientationEvent) => void) | null>;
  setIsActive: (active: boolean) => void;
  setNeedsPermission: (needs: boolean) => void;
  onSensorActive?: () => void;
  onSensorLost?: () => void;
  onPermissionGranted?: () => void;
  onPermissionError?: (error: any) => void;
}

/**
 * Solicitar permiso de giroscopio en iOS
 * Adjunta listener solo después de obtener permiso
 */
export async function requestIOSGyroPermission({
  orientationRef,
  hasValidDataRef,
  listenerRef,
  setIsActive,
  setNeedsPermission,
  onSensorActive,
  onSensorLost,
  onPermissionGranted,
  onPermissionError,
}: IOSGyroPermissionParams): Promise<boolean> {
  if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
    return false;
  }

  try {
    const permissionState = await (DeviceOrientationEvent as any).requestPermission();
    
    if (permissionState === 'granted') {
      setNeedsPermission(false);
      onPermissionGranted?.();
      
      // iOS: Adjuntar listener DESPUÉS de obtener permiso
      const handleOrientation = createOrientationHandler({
        orientationRef,
        hasValidDataRef,
        setIsActive,
        onSensorActive,
        onSensorLost,
      });
      
      // Guardar referencia para cleanup ANTES de addEventListener
      listenerRef.current = handleOrientation;
      
      window.addEventListener('deviceorientation', listenerRef.current, {
        passive: true,
      } as any);
      
      return true;
    }
  } catch (error) {
    onPermissionError?.(error);
  }
  
  return false;
}

/**
 * Verificar si iOS necesita permiso
 */
export function iosNeedsPermission(): boolean {
  return typeof (DeviceOrientationEvent as any).requestPermission === 'function';
}

/**
 * Cleanup del listener de iOS (mismo que Android)
 */
export function cleanupIOSGyro(
  listenerRef: MutableRefObject<((event: DeviceOrientationEvent) => void) | null>
): void {
  if (listenerRef.current) {
    window.removeEventListener('deviceorientation', listenerRef.current);
    listenerRef.current = null;
  }
}
