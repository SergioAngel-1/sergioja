'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { logger } from '@/lib/logger';

export default function HexagonGrid() {
  const { config, mode } = usePerformance();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Iniciar fuera de pantalla
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [centerLightIntensity, setCenterLightIntensity] = useState(0); // Animación de luz central
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const pendingPositionRef = useRef<{ x: number; y: number } | null>(null);
  const smoothMousePosRef = useRef({ x: -1000, y: -1000 }); // Posición interpolada suave
  
  // En modo bajo rendimiento, deshabilitar efectos
  const lowPerformanceMode = mode === 'low';
  
  // Evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Detect mobile devices
    const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);
    
    logger.debug('HexagonGrid mounted', { lowPerformanceMode, mode, isMobile: mobile }, 'HexagonGrid');
    
    // Set initial dimensions and center mouse
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width, height });
    setMousePos({ x: width / 2, y: height / 2 }); // Centrar mouse
    
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setDimensions({ width: newWidth, height: window.innerHeight });
      setIsMobile(newWidth < 768);
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
  
  // Manejar seguimiento del mouse con RAF throttle e interpolación suave
  useEffect(() => {
    if (!mounted || lowPerformanceMode) return;
    
    let animationFrameId: number | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Store pending position
      pendingPositionRef.current = { x: e.clientX, y: e.clientY };
      
      // Schedule update on next animation frame if not already scheduled
      if (rafIdRef.current === null) {
        const smoothUpdate = () => {
          if (pendingPositionRef.current) {
            // Interpolación suave para eliminar jitter
            const smoothFactor = 0.15; // Factor de suavizado
            const targetX = pendingPositionRef.current.x;
            const targetY = pendingPositionRef.current.y;
            
            smoothMousePosRef.current.x += (targetX - smoothMousePosRef.current.x) * smoothFactor;
            smoothMousePosRef.current.y += (targetY - smoothMousePosRef.current.y) * smoothFactor;
            
            setMousePos({
              x: smoothMousePosRef.current.x,
              y: smoothMousePosRef.current.y
            });
            
            // Continuar interpolando si aún hay diferencia significativa
            const diffX = Math.abs(targetX - smoothMousePosRef.current.x);
            const diffY = Math.abs(targetY - smoothMousePosRef.current.y);
            
            if (diffX > 0.5 || diffY > 0.5) {
              rafIdRef.current = requestAnimationFrame(smoothUpdate);
            } else {
              pendingPositionRef.current = null;
              rafIdRef.current = null;
            }
          }
        };
        
        rafIdRef.current = requestAnimationFrame(smoothUpdate);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [mounted, lowPerformanceMode]);
  
  // Memoize hexagon grid generation to prevent recalculation on every render
  // MUST be before conditional return to comply with Rules of Hooks
  const hexagons = useMemo(() => {
    if (!mounted) return [];
    
    const remPx = 16;
    const minPx = 5.2 * remPx;
    const maxPx = 7.8 * remPx;
    const preferred = dimensions.width * 0.078;
    // Increase hex size on mobile to reduce total count (better performance)
    const hexSize = isMobile 
      ? Math.min(maxPx * 1.5, Math.max(minPx * 1.5, preferred * 1.5))
      : Math.min(maxPx, Math.max(minPx, preferred));
    const hexHeight = (113 / 130) * hexSize;
    const cols = Math.ceil(dimensions.width / hexSize) + 2;
    const rows = Math.ceil(dimensions.height / hexHeight) + 2;
    
    const grid = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexSize + (row % 2 === 1 ? hexSize / 2 : 0);
        const y = row * hexHeight * 0.75;
        grid.push({ x, y, id: `${row}-${col}`, hexSize });
      }
    }
    return grid;
  }, [mounted, dimensions.width, dimensions.height, isMobile]);

  // Memoize visible hexagons with opacity calculations
  // MUST be before conditional return to comply with Rules of Hooks
  const visibleHexagons = useMemo(() => {
    if (!mounted) return [];
    
    const calculateOpacity = (hexX: number, hexY: number) => {
      // En bajo rendimiento, opacidad uniforme baja
      if (lowPerformanceMode) {
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        const distanceSquared = Math.pow(centerX - hexX, 2) + Math.pow(centerY - hexY, 2);
        const centerMaxDistanceSquared = 400 * 400;
        const opacityFromCenter = Math.max(0, 1 - Math.sqrt(distanceSquared / centerMaxDistanceSquared));
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
      
      // Distancia desde el mouse (usando distancia al cuadrado para evitar sqrt)
      const distanceSquaredFromMouse = Math.pow(mousePos.x - hexX, 2) + Math.pow(mousePos.y - hexY, 2);
      const maxDistanceSquared = 250 * 250; // Radio aumentado para efecto más amplio
      const opacityFromMouse = Math.max(0, 1 - distanceSquaredFromMouse / maxDistanceSquared);
      
      // Distancia desde el centro de la pantalla (luz fija)
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const distanceSquaredFromCenter = Math.pow(centerX - hexX, 2) + Math.pow(centerY - hexY, 2);
      const centerMaxDistanceSquared = 400 * 400;
      const opacityFromCenter = Math.max(0, 1 - distanceSquaredFromCenter / centerMaxDistanceSquared);
      
      // Combinar ambas luces (tomar la mayor) con animación de entrada
      const combinedOpacity = Math.max(opacityFromMouse, opacityFromCenter * 0.7 * centerLightIntensity);
      
      // Aplicar fade de bordes para resaltar HexButtons
      return combinedOpacity * 0.8 * edgeFade;
    };
    
    return hexagons
      .map(hex => {
        const s = hex.hexSize / 130;
        const opacity = calculateOpacity(hex.x + 65 * s, hex.y + 65 * s);
        return { ...hex, opacity, s };
      })
      .filter(hex => hex.opacity >= 0.01); // Only render visible hexagons
  }, [mounted, hexagons, mousePos, dimensions, centerLightIntensity, lowPerformanceMode]);
  
  if (!mounted) {
    // Renderizar versión estática durante SSR
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" />
      </div>
    );
  }

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
        {visibleHexagons.map((hex) => (
          <polygon
            key={hex.id}
            points={`${hex.x + 65 * hex.s},${hex.y} ${hex.x + 121.3 * hex.s},${hex.y + 32.5 * hex.s} ${hex.x + 121.3 * hex.s},${hex.y + 97.5 * hex.s} ${hex.x + 65 * hex.s},${hex.y + 130 * hex.s} ${hex.x + 8.7 * hex.s},${hex.y + 97.5 * hex.s} ${hex.x + 8.7 * hex.s},${hex.y + 32.5 * hex.s}`}
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity={hex.opacity * 1.2}
            filter={lowPerformanceMode || isMobile ? undefined : "url(#softGlow)"}
            style={{ transition: lowPerformanceMode ? 'none' : 'opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        ))}
      </svg>
    </div>
  );
}
