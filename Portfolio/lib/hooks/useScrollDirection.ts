import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  debounce?: number;
}

/**
 * Hook para detectar la dirección del scroll
 * Útil para ocultar/mostrar navbar en mobile
 */
export function useScrollDirection({
  threshold = 10,
  debounce = 50,
}: UseScrollDirectionOptions = {}): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    let timeoutId: NodeJS.Timeout;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;

      // Solo actualizar si el scroll superó el threshold
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      // Determinar dirección
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      // Solo actualizar si cambió la dirección
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
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
  }, [scrollDirection, threshold, debounce]);

  return scrollDirection;
}
