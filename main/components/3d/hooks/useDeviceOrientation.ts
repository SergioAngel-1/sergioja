import { useEffect, useRef, useState } from 'react';
import { useLogger } from '@/shared/hooks/useLogger';

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
  const [isMobile, setIsMobile] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const orientationRef = useRef<DeviceOrientationData>({ beta: 0, gamma: 0 });
  const hasValidDataRef = useRef(false);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);
      return mobile;
    };

    const mobile = checkMobile();

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
      // Remover throttling - el giroscopio ya está limitado a ~60Hz
      // y useFrame en AnimatedModel maneja el timing
    };

    if (mobile && typeof DeviceOrientationEvent !== 'undefined') {
      setIsSupported(true);
      
      const permissionNeeded =
        typeof (DeviceOrientationEvent as any).requestPermission === 'function';
      setNeedsPermission(permissionNeeded);

      if (permissionNeeded) {
        // iOS: NO adjuntar listener aquí - se adjuntará en requestPermission()
        // después de obtener el permiso del usuario
      } else {
        // Android: Adjuntar listener inmediatamente
        window.addEventListener('deviceorientation', handleOrientation, {
          passive: true,
        } as any);
      }
    } else {
      setIsSupported(false);
      log.warn('gyro_not_supported');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [enabled, onSchedule]);

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
