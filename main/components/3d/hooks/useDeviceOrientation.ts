import { useEffect, useRef, useState } from 'react';
import { useLogger } from '@/shared/hooks/useLogger';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { 
  setupAndroidGyro, 
  cleanupAndroidGyro,
  requestIOSGyroPermission,
  iosNeedsPermission,
  cleanupIOSGyro
} from './gyro';

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
    if (isMobile && typeof DeviceOrientationEvent !== 'undefined') {
      setIsSupported(true);
      
      const permissionNeeded = iosNeedsPermission();
      setNeedsPermission(permissionNeeded);

      if (!permissionNeeded && enabled) {
        // Android: Adjuntar listener inmediatamente solo si está habilitado
        setupAndroidGyro({
          orientationRef,
          hasValidDataRef,
          listenerRef,
          setIsActive,
          onSensorActive: () => log.info('gyro_sensor_active'),
          onSensorLost: () => log.warn('gyro_sensor_lost'),
        });
      }
    } else {
      setIsSupported(false);
      log.warn('gyro_not_supported');
    }

    return () => {
      // Cleanup: remover listener si existe (Android o iOS después de permiso)
      cleanupAndroidGyro(listenerRef);
    };
  }, [enabled, onSchedule, log, isMobile]);

  const requestPermission = async (): Promise<boolean> => {
    return requestIOSGyroPermission({
      orientationRef,
      hasValidDataRef,
      listenerRef,
      setIsActive,
      setNeedsPermission,
      onSensorActive: () => log.info('gyro_sensor_active'),
      onSensorLost: () => log.warn('gyro_sensor_lost'),
      onPermissionGranted: () => log.info('gyro_permission_granted'),
      onPermissionError: (error) => log.error('gyro_permission_error', error),
    });
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
