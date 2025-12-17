interface ModelLightingProps {
  lowPerformanceMode?: boolean;
}

export function ModelLighting({ lowPerformanceMode = false }: ModelLightingProps) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <hemisphereLight args={['#ffffff', '#222222', 0.8]} />
      <directionalLight position={[0, 1, 2]} intensity={1.0} castShadow={false} />
    </>
  );
}
