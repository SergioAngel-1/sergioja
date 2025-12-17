import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  debounce?: number;
}

interface ScrollState {
  direction: ScrollDirection;
  isAtBottom: boolean;
}

/**
 * Hook para detectar la dirección del scroll y si está al final de la página
 * Útil para ocultar/mostrar navbar en mobile
 */
export function useScrollDirection({
  threshold = 50,
  debounce = 50,
}: UseScrollDirectionOptions = {}): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    direction: null,
    isAtBottom: false,
  });

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    let timeoutId: NodeJS.Timeout;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Detectar si está al final de la página (con margen de 50px)
      const isAtBottom = scrollY + windowHeight >= documentHeight - 50;

      // Solo actualizar si el scroll superó el threshold
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        // Actualizar solo isAtBottom si cambió
        if (isAtBottom !== scrollState.isAtBottom) {
          setScrollState(prev => ({ ...prev, isAtBottom }));
        }
        ticking = false;
        return;
      }

      // Determinar dirección
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      // Actualizar si cambió la dirección o isAtBottom
      if (direction !== scrollState.direction || isAtBottom !== scrollState.isAtBottom) {
        setScrollState({ direction, isAtBottom });
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      // Debounce con timeout
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!ticking) {
          window.requestAnimationFrame(updateScrollDirection);
          ticking = true;
        }
      }, debounce);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, [scrollState.direction, scrollState.isAtBottom, threshold, debounce]);

  return scrollState;
}
