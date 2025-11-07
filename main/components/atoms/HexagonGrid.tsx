'use client';

import { useState, useEffect } from 'react';

export default function HexagonGrid() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Iniciar fuera de pantalla
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  
  useEffect(() => {
    // Set initial dimensions and center mouse
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width, height });
    setMousePos({ x: width / 2, y: height / 2 }); // Centrar mouse
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Generar grid de hexágonos
  const hexSize = 100;
  const hexHeight = 87;
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
    
    // Combinar ambas luces (tomar la mayor)
    const combinedOpacity = Math.max(opacityFromMouse, opacityFromCenter * 0.7);
    return combinedOpacity * 0.8;
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
          const opacity = calculateOpacity(hex.x + 50, hex.y + 50);
          if (opacity < 0.01) return null; // No renderizar hexágonos invisibles
          return (
            <polygon
              key={hex.id}
              points={`${hex.x + 50},${hex.y} ${hex.x + 93.3},${hex.y + 25} ${hex.x + 93.3},${hex.y + 75} ${hex.x + 50},${hex.y + 100} ${hex.x + 6.7},${hex.y + 75} ${hex.x + 6.7},${hex.y + 25}`}
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity={opacity}
              filter="url(#softGlow)"
              style={{ transition: 'opacity 0.2s ease-out' }}
            />
          );
        })}
      </svg>
    </div>
  );
}
