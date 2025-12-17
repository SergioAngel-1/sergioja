import { useEffect, useRef, useState } from 'react';
import { useLogger } from '@/shared/hooks/useLogger';
import { useIsMobile } from '@/shared/hooks/useIsMobile';

interface DeviceOrientationData {
  beta: number;
  gamma: number;
}

interface UseDeviceOrientationReturn {
  orientation: DeviceOrientationData;
  isMobile: boolean;
  needsPermission: boolean;
  isSupported: boolean;
  isActive: boolean;
  requestPermission: () => Promise<boolean>;
}

export function useDeviceOrientation(
  enabled: boolean,
  onSchedule?: (ms: number) => void
): UseDeviceOrientationReturn {
  const log = useLogger('useDeviceOrientation');
  const isMobile = useIsMobile();
  const [needsPermission, setNeedsPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const orientationRef = useRef<DeviceOrientationData>({ beta: 0, gamma: 0 });
  const hasValidDataRef = useRef(false);
  const listenerRef = useRef<((event: DeviceOrientationEvent) => void) | null>(null);

  // Configurar listener de orientación
  useEffect(() => {

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Validar que el sensor esté funcionando
      if (event.beta === null || event.gamma === null) {
        if (hasValidDataRef.current) {
          log.warn('gyro_sensor_lost');
          setIsActive(false);
        }
        return;
      }

      // Marcar como activo si recibimos datos válidos
      if (!hasValidDataRef.current) {
        hasValidDataRef.current = true;
        setIsActive(true);
        log.info('gyro_sensor_active');
      }

      orientationRef.current = {
        beta: event.beta,
        gamma: event.gamma,
      };
    };

    if (isMobile && typeof DeviceOrientationEvent !== 'undefined') {
      setIsSupported(true);
      
      const permissionNeeded =
        typeof (DeviceOrientationEvent as any).requestPermission === 'function';
      setNeedsPermission(permissionNeeded);

      if (!permissionNeeded) {
        // Android: Adjuntar listener inmediatamente
        listenerRef.current = handleOrientation;
        window.addEventListener('deviceorientation', handleOrientation, {
          passive: true,
        } as any);
      }
    } else {
      setIsSupported(false);
      log.warn('gyro_not_supported');
    }

    return () => {
      // Cleanup: remover listener si existe (Android o iOS después de permiso)
      if (listenerRef.current) {
        window.removeEventListener('deviceorientation', listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, [enabled, onSchedule, log]);

  const requestPermission = async (): Promise<boolean> => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setNeedsPermission(false);
          log.info('gyro_permission_granted');
          
          // iOS: Adjuntar listener DESPUÉS de obtener permiso
          const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.beta === null || event.gamma === null) {
              if (hasValidDataRef.current) {
                log.warn('gyro_sensor_lost');
                setIsActive(false);
              }
              return;
            }

            if (!hasValidDataRef.current) {
              hasValidDataRef.current = true;
              setIsActive(true);
              log.info('gyro_sensor_active');
            }

            orientationRef.current = {
              beta: event.beta,
              gamma: event.gamma,
            };
          };
          
          // Guardar referencia para cleanup
          listenerRef.current = handleOrientation;
          
          window.addEventListener('deviceorientation', handleOrientation, {
            passive: true,
          } as any);
          
          return true;
        }
      } catch (error) {
        log.error('gyro_permission_error', error as any);
      }
    }
    return false;
  };

  return {
    orientation: orientationRef.current,
    isMobile,
    needsPermission,
    isSupported,
    isActive,
    requestPermission,
  };
}
