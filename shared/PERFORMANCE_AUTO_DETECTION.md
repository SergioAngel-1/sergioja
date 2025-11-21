# Sistema de Detección Automática de Rendimiento

## Descripción General

El sistema detecta automáticamente las capacidades del dispositivo en la **primera visita** y aplica el modo de rendimiento más apropiado (bajo o alto). En visitas posteriores, se respeta la preferencia guardada del usuario.

## Métricas de Detección

### 1. **CPU Cores** (`navigator.hardwareConcurrency`)
- Detecta el número de núcleos lógicos del procesador
- **Criterio**: ≤ 4 cores en mobile → Bajo rendimiento

### 2. **Memoria del Dispositivo** (`navigator.deviceMemory`)
- Solo disponible en Chrome/Edge
- **Criterio**: ≤ 4 GB → Bajo rendimiento

### 3. **GPU/WebGL**
- Intenta crear contexto WebGL
- **Criterio**: Sin GPU → Bajo rendimiento

### 4. **Tipo de Dispositivo**
- Detecta si es mobile mediante User Agent
- Se combina con otras métricas para determinar si es gama baja

### 5. **Preferencia del Sistema** (`prefers-reduced-motion`)
- Respeta la configuración de accesibilidad del usuario
- **Criterio**: Reducción de movimiento activada → Bajo rendimiento

## Lógica de Decisión

```typescript
const isLowEnd = (
  (isMobile && cpuCores > 0 && cpuCores <= 4) ||  // Mobile con pocos cores
  (deviceMemory !== undefined && deviceMemory <= 4) ||  // Poca RAM
  !hasGPU ||  // Sin aceleración GPU
  prefersReducedMotion  // Preferencia de accesibilidad
);

const mode = isLowEnd ? 'low' : 'high';
```

## Flujo de Inicialización

1. **Primera visita**:
   - No hay preferencia en localStorage
   - Se ejecuta `detectDeviceCapabilities()`
   - Se aplica modo recomendado automáticamente
   - Se guarda en localStorage para futuras visitas

2. **Visitas posteriores**:
   - Se carga preferencia de localStorage
   - Se respeta la elección del usuario
   - El usuario puede cambiar manualmente en cualquier momento

3. **Cambio manual**:
   - El usuario puede cambiar el modo desde la UI
   - La nueva preferencia se guarda
   - Prevalece sobre la detección automática

## Optimizaciones por Modo

### Modo Bajo Rendimiento
- ❌ Sin animaciones de entrada del modelo 3D
- ❌ Sin interacción mouse/giroscopio con modelo 3D
- ❌ Sin partículas flotantes
- ❌ Sin DataStream (letras chinas)
- ⚡ Animaciones de modal simplificadas (solo fade)
- ⚡ Sin botón de giroscopio en iOS
- 📊 Indicador visual de modo activo

### Modo Alto Rendimiento
- ✅ Todas las animaciones activas
- ✅ Interacción completa con modelo 3D
- ✅ Efectos visuales completos
- ✅ Transiciones suaves

## Ejemplo de Log

```
[Performance] No saved preference, detecting device capabilities
[Performance] Device capabilities detected {
  isMobile: true,
  isLowEnd: true,
  prefersReducedMotion: false,
  hasGPU: true,
  cpuCores: 4,
  deviceMemory: 4
}
[Performance] Recommending low performance mode
[Performance] PerformanceManager initialized { mode: 'low' }
```

## API de Uso

### Detectar capacidades manualmente
```typescript
import { PerformanceManager } from '@/shared/performanceSystem';

const capabilities = PerformanceManager.detectDeviceCapabilities();
console.log(capabilities);
// {
//   isMobile: boolean,
//   isLowEnd: boolean,
//   prefersReducedMotion: boolean,
//   hasGPU: boolean,
//   cpuCores: number,
//   deviceMemory: number | undefined
// }
```

### Obtener modo recomendado
```typescript
const recommendedMode = PerformanceManager.recommendMode();
// 'low' | 'high'
```

### En componentes React
```typescript
import { usePerformance } from '@/lib/contexts/PerformanceContext';

function MyComponent() {
  const { lowPerformanceMode, mode, setMode } = usePerformance();
  
  // El modo ya está aplicado automáticamente en la primera visita
  return (
    <div>
      {lowPerformanceMode ? 'Bajo rendimiento' : 'Alto rendimiento'}
    </div>
  );
}
```

## Consideraciones

- La detección es **no invasiva**: no requiere permisos especiales
- Es **progresiva**: funciona incluso si algunas APIs no están disponibles
- Es **respetuosa**: guarda la preferencia del usuario
- Es **transparente**: muestra indicador visual cuando está en bajo rendimiento
- Es **reversible**: el usuario puede cambiar el modo en cualquier momento
