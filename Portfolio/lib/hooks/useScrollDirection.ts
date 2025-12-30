import { useState, useEffect, useRef, useCallback } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  accumulateDistance?: boolean;
  resetDistanceThreshold?: number;
}

interface ScrollState {
  direction: ScrollDirection;
  isAtBottom: boolean;
  scrollDistance: number;
}

/**
 * Hook optimizado para detectar la dirección del scroll y si está al final de la página
 * Optimizado para iOS Safari - Sin race conditions
 */
export function useScrollDirection({
  threshold = 50,
  accumulateDistance = false,
  resetDistanceThreshold = 10,
}: UseScrollDirectionOptions = {}): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    direction: null,
    isAtBottom: false,
    scrollDistance: 0,
  });

  // Usar refs para evitar recrear el effect
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const lastDirectionRef = useRef<ScrollDirection>(null);
  const lastIsAtBottomRef = useRef(false);
  const accumulatedDistanceRef = useRef(0);

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Detectar si está al final de la página (con margen de 50px)
    const isAtBottom = scrollY + windowHeight >= documentHeight - 50;
    const delta = scrollY - lastScrollYRef.current;
    const absDelta = Math.abs(delta);

    // Determinar dirección antes del threshold check
    const direction: ScrollDirection = delta > 0 ? 'down' : delta < 0 ? 'up' : lastDirectionRef.current;

    // Acumular distancia si está habilitado (optimizado para iOS)
    if (accumulateDistance) {
      if (direction === 'down') {
        // Acumular distancia en scroll down
        accumulatedDistanceRef.current += absDelta;
      } else if (direction === 'up' && absDelta > resetDistanceThreshold) {
        // Solo resetear si el scroll up es significativo (evita elastic scrolling de iOS)
        accumulatedDistanceRef.current = Math.max(0, accumulatedDistanceRef.current - absDelta);
      }
    }

    // Solo actualizar si el scroll superó el threshold
    if (absDelta < threshold) {
      // Actualizar solo isAtBottom o scrollDistance si cambiaron
      const needsUpdate = 
        isAtBottom !== lastIsAtBottomRef.current ||
        (accumulateDistance && accumulatedDistanceRef.current !== scrollState.scrollDistance);
      
      if (needsUpdate) {
        lastIsAtBottomRef.current = isAtBottom;
        setScrollState(prev => ({ 
          ...prev, 
          isAtBottom,
          scrollDistance: accumulatedDistanceRef.current 
        }));
      }
      tickingRef.current = false;
      return;
    }
    
    // Actualizar si cambió la dirección, isAtBottom o scrollDistance
    const needsUpdate = 
      direction !== lastDirectionRef.current || 
      isAtBottom !== lastIsAtBottomRef.current ||
      (accumulateDistance && accumulatedDistanceRef.current !== scrollState.scrollDistance);

    if (needsUpdate) {
      lastDirectionRef.current = direction;
      lastIsAtBottomRef.current = isAtBottom;
      setScrollState({ 
        direction, 
        isAtBottom,
        scrollDistance: accumulatedDistanceRef.current 
      });
    }

    lastScrollYRef.current = scrollY > 0 ? scrollY : 0;
    tickingRef.current = false;
  }, [threshold, accumulateDistance, resetDistanceThreshold, scrollState.scrollDistance]);

  useEffect(() => {
    // Inicializar lastScrollY
    lastScrollYRef.current = window.pageYOffset;

    const onScroll = () => {
      // Usar solo requestAnimationFrame - Optimizado para iOS
      if (!tickingRef.current) {
        tickingRef.current = true;
        window.requestAnimationFrame(updateScrollDirection);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [updateScrollDirection]); // Solo depende de updateScrollDirection que es estable

  // Método para resetear la distancia acumulada (usado al cambiar de página)
  useEffect(() => {
    // Resetear distancia cuando cambia la página (pathname cambia)
    accumulatedDistanceRef.current = 0;
  }, []); // Solo en mount

  return scrollState;
}
