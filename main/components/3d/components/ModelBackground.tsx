/**
 * Fondo visual del contenedor del modelo 3D
 * Incluye blur, patrón de puntos y efectos visuales
 * 
 * IMPORTANTE: Todos los elementos deben tener clipping circular
 * para evitar desbordamiento de blur en contextos de iframe
 */

interface ModelBackgroundProps {
  /** Desactivar efectos costosos (iframe, low performance) */
  disableBackdropBlur?: boolean;
}

export function ModelBackground({ disableBackdropBlur = false }: ModelBackgroundProps) {
  return (
    <>
      {/* Fondo transparente con blur - Circular para evitar desbordamiento */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: disableBackdropBlur ? 'none' : 'blur(8px)',
          WebkitBackdropFilter: disableBackdropBlur ? 'none' : 'blur(8px)',
          backgroundColor: disableBackdropBlur ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
          clipPath: 'circle(50% at 50% 50%)',
          WebkitClipPath: 'circle(50% at 50% 50%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Patrón de puntos sutiles - También circular */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          borderRadius: '50%',
          clipPath: 'circle(50% at 50% 50%)',
          WebkitClipPath: 'circle(50% at 50% 50%)',
        }}
      />
    </>
  );
}
