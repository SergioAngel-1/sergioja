import { MutableRefObject } from 'react';

interface OrientationData {
  beta: number;
  gamma: number;
}

interface OrientationHandlerDeps {
  orientationRef: MutableRefObject<OrientationData>;
  hasValidDataRef: MutableRefObject<boolean>;
  setIsActive: (active: boolean) => void;
  setOrientation: (data: OrientationData) => void;
  onSensorActive?: () => void;
  onSensorLost?: () => void;
}

/**
 * Factory para crear el handler de eventos de orientación
 * Evita duplicación de lógica entre Android e iOS
 */
export function createOrientationHandler({
  orientationRef,
  hasValidDataRef,
  setIsActive,
  setOrientation,
  onSensorActive,
  onSensorLost,
}: OrientationHandlerDeps) {
  return (event: DeviceOrientationEvent) => {
    // Validar que el sensor esté funcionando
    if (event.beta === null || event.gamma === null) {
      if (hasValidDataRef.current) {
        onSensorLost?.();
        setIsActive(false);
      }
      return;
    }

    // Marcar como activo si recibimos datos válidos
    if (!hasValidDataRef.current) {
      hasValidDataRef.current = true;
      setIsActive(true);
      onSensorActive?.();
    }

    const newData = {
      beta: event.beta,
      gamma: event.gamma,
    };

    // Actualizar ref (para acceso síncrono)
    orientationRef.current = newData;
    
    // Actualizar estado (para reactividad en React)
    setOrientation(newData);
  };
}
