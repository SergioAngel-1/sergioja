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
  requestPermission: () => Promise<boolean>;
}

export function useDeviceOrientation(
  enabled: boolean,
  onSchedule?: (ms: number) => void
): UseDeviceOrientationReturn {
  const log = useLogger('useDeviceOrientation');
  const [isMobile, setIsMobile] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const orientationRef = useRef<DeviceOrientationData>({ beta: 0, gamma: 0 });

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
      orientationRef.current = {
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      };
      onSchedule?.(150);
    };

    if (mobile && typeof DeviceOrientationEvent !== 'undefined') {
      const permissionNeeded =
        typeof (DeviceOrientationEvent as any).requestPermission === 'function';
      setNeedsPermission(permissionNeeded);

      if (permissionNeeded) {
        if (enabled) {
          window.addEventListener('deviceorientation', handleOrientation, {
            passive: true,
          } as any);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation, {
          passive: true,
        } as any);
      }
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
    requestPermission,
  };
}
