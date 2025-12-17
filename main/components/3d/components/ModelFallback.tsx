/**
 * Fallback visual cuando el modelo 3D no se puede cargar
 * Muestra una esfera estilizada con ojos
 */
export function ModelFallback() {
  return (
    <>
      {/* Cabeza */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Ojo izquierdo */}
      <mesh position={[-0.3, 0.2, 0.9]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>

      {/* Ojo derecho */}
      <mesh position={[0.3, 0.2, 0.9]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>
    </>
  );
}
