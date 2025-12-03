'use client';

import { useState, useEffect } from 'react';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { logger } from '@/lib/logger';

export default function HexagonGrid() {
  const { config, mode } = usePerformance();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Iniciar fuera de pantalla
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [centerLightIntensity, setCenterLightIntensity] = useState(0); // Animación de luz central
  const [mounted, setMounted] = useState(false);
  
  // En modo bajo rendimiento, deshabilitar efectos
  const lowPerformanceMode = mode === 'low';
  
  // Evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    logger.debug('HexagonGrid mounted', { lowPerformanceMode, mode }, 'HexagonGrid');
    
    // Set initial dimensions and center mouse
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width, height });
    setMousePos({ x: width / 2, y: height / 2 }); // Centrar mouse
    
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted]);
  
  // Manejar animación de luz central
  useEffect(() => {
    if (!mounted) return;
    
    if (lowPerformanceMode) {
      setCenterLightIntensity(1); // Luz fija sin animación
      return;
    }
    
    let intensity = 0;
    const interval = setInterval(() => {
      intensity += 0.02;
      if (intensity >= 1) {
        intensity = 1;
        clearInterval(interval);
      }
      setCenterLightIntensity(intensity);
    }, 30);
    
    return () => clearInterval(interval);
  }, [mounted, lowPerformanceMode]);
  
  // Manejar seguimiento del mouse
  useEffect(() => {
    if (!mounted || lowPerformanceMode) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mounted, lowPerformanceMode]);
  
  if (!mounted) {
    // Renderizar versión estática durante SSR
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" />
      </div>
    );
  }

  // Generar grid de hexágonos
  const remPx = 16;
  const minPx = 5.2 * remPx;
  const maxPx = 7.8 * remPx;
  const preferred = dimensions.width * 0.078;
  const hexSize = Math.min(maxPx, Math.max(minPx, preferred));
  const hexHeight = (113 / 130) * hexSize;
  const cols = Math.ceil(dimensions.width / hexSize) + 2;
  const rows = Math.ceil(dimensions.height / hexHeight) + 2;
  
  const hexagons = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize + (row % 2 === 1 ? hexSize / 2 : 0);
      const y = row * hexHeight * 0.75;
      hexagons.push({ x, y, id: `${row}-${col}` });
    }
  }

  const calculateOpacity = (hexX: number, hexY: number) => {
    // En bajo rendimiento, opacidad uniforme baja
    if (lowPerformanceMode) {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const distanceFromCenter = Math.sqrt(
        Math.pow(centerX - hexX, 2) + Math.pow(centerY - hexY, 2)
      );
      const centerMaxDistance = 400;
      const opacityFromCenter = Math.max(0, 1 - distanceFromCenter / centerMaxDistance);
      return opacityFromCenter * 0.3; // Opacidad reducida y fija
    }
    
    // Calcular distancia a los bordes para reducir opacidad cerca de los HexButtons
    const distanceToLeft = hexX;
    const distanceToRight = dimensions.width - hexX;
    const distanceToTop = hexY;
    const distanceToBottom = dimensions.height - hexY;
    
    // Encontrar la distancia mínima a cualquier borde
    const minEdgeDistance = Math.min(
      distanceToLeft,
      distanceToRight,
      distanceToTop,
      distanceToBottom
    );
    
    // Radio de influencia de los bordes (más grande = efecto más suave)
    const edgeInfluenceRadius = 400;
    const edgeFade = Math.min(1, minEdgeDistance / edgeInfluenceRadius);
    
    // Distancia desde el mouse
    const distanceFromMouse = Math.sqrt(
      Math.pow(mousePos.x - hexX, 2) + Math.pow(mousePos.y - hexY, 2)
    );
    const maxDistance = 200;
    const opacityFromMouse = Math.max(0, 1 - distanceFromMouse / maxDistance);
    
    // Distancia desde el centro de la pantalla (luz fija)
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const distanceFromCenter = Math.sqrt(
      Math.pow(centerX - hexX, 2) + Math.pow(centerY - hexY, 2)
    );
    const centerMaxDistance = 400; // Radio de luz central más grande
    const opacityFromCenter = Math.max(0, 1 - distanceFromCenter / centerMaxDistance);
    
    // Combinar ambas luces (tomar la mayor) con animación de entrada
    const combinedOpacity = Math.max(opacityFromMouse, opacityFromCenter * 0.7 * centerLightIntensity);
    
    // Aplicar fade de bordes para resaltar HexButtons
    return combinedOpacity * 0.8 * edgeFade;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="softGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {hexagons.map((hex) => {
          const s = hexSize / 130;
          const opacity = calculateOpacity(hex.x + 65 * s, hex.y + 65 * s);
          if (opacity < 0.01) return null; // No renderizar hexágonos invisibles
          return (
            <polygon
              key={hex.id}
              points={`${hex.x + 65 * s},${hex.y} ${hex.x + 121.3 * s},${hex.y + 32.5 * s} ${hex.x + 121.3 * s},${hex.y + 97.5 * s} ${hex.x + 65 * s},${hex.y + 130 * s} ${hex.x + 8.7 * s},${hex.y + 97.5 * s} ${hex.x + 8.7 * s},${hex.y + 32.5 * s}`}
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity={opacity * 1.2}
              filter={lowPerformanceMode ? undefined : "url(#softGlow)"}
              style={{ transition: lowPerformanceMode ? 'none' : 'opacity 0.2s ease-out' }}
            />
          );
        })}
      </svg>
    </div>
  );
}
