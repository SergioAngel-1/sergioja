/**
 * Fondo visual del contenedor del modelo 3D
 * Incluye blur, patrón de puntos y efectos visuales
 */
export function ModelBackground() {
  return (
    <>
      {/* Fondo transparente con blur */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          willChange: 'backdrop-filter',
          transform: 'translateZ(0)',
          isolation: 'isolate',
        }}
      />

      {/* Patrón de puntos sutiles */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
    </>
  );
}
