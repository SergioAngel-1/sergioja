import { useEffect, RefObject } from 'react';

/**
 * Detecta si el navegador es iOS Safari
 */
const isIOSSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const webkit = /WebKit/.test(ua);
  return iOS && webkit && !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
};

/**
 * Custom hook para manejar efectos de navbar (resize handlers con debounce)
 */
export function useNavbarEffects(navRef: RefObject<HTMLDivElement>) {
  // Measure mobile nav height (excluding safe-area padding) and expose as CSS var
  useEffect(() => {
    const updateHeightVar = () => {
      if (!navRef.current) return;
      const cs = getComputedStyle(navRef.current);
      const pb = parseFloat(cs.paddingBottom || '0') || 0;
      const h = Math.max(0, navRef.current.offsetHeight - pb);
      const currentHeight = document.documentElement.style.getPropertyValue('--mobile-nav-height');
      const newHeight = `${h}px`;
      
      if (currentHeight !== newHeight) {
        document.documentElement.style.setProperty('--mobile-nav-height', newHeight);
      }
    };
    
    updateHeightVar();
    
    const debouncedUpdate = (() => {
      let timeoutId: NodeJS.Timeout;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateHeightVar, 150);
      };
    })();
    
    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);
    
    // iOS Safari: Listen to scroll events to detect address bar hide/show
    if (isIOSSafari()) {
      window.addEventListener('scroll', debouncedUpdate, { passive: true });
    }
    
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
      if (isIOSSafari()) {
        window.removeEventListener('scroll', debouncedUpdate);
      }
    };
  }, [navRef]);

  // iOS Safari: adjust bottom gap when browser UI is visible using VisualViewport
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Solo aplicar en iOS Safari
    if (!isIOSSafari()) return;
    
    const vv: any = (window as any).visualViewport;
    if (!vv) return;

    const updateGap = () => {
      try {
        // Calcular gap considerando la barra de direcciones de Safari
        const gap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        const newGap = `${gap}px`;
        
        // Establecer --bottom-gap globalmente para que NextPageButton y otros componentes puedan usarlo
        const currentGlobalGap = document.documentElement.style.getPropertyValue('--bottom-gap');
        
        // Solo actualizar si cambió significativamente (> 1px para evitar jitter)
        if (Math.abs(parseFloat(currentGlobalGap || '0') - gap) > 1) {
          document.documentElement.style.setProperty('--bottom-gap', newGap);
          
          // También establecer en el navbar para compatibilidad
          if (navRef.current) {
            navRef.current.style.setProperty('--bottom-gap', newGap);
            
            // Forzar reflow para iOS Safari
            void navRef.current.offsetHeight;
          }
        }
      } catch (error) {
        // Silently fail - no crítico
      }
    };

    // Ejecutar inmediatamente
    updateGap();
    
    // Debounce optimizado para scroll (más rápido para mejor UX)
    const debouncedScroll = (() => {
      let timeoutId: NodeJS.Timeout;
      let rafId: number;
      return () => {
        clearTimeout(timeoutId);
        cancelAnimationFrame(rafId);
        
        // Usar requestAnimationFrame para mejor performance
        rafId = requestAnimationFrame(() => {
          timeoutId = setTimeout(updateGap, 50); // Reducido de 100ms a 50ms
        });
      };
    })();
    
    // Debounce para resize (menos frecuente)
    const debouncedResize = (() => {
      let timeoutId: NodeJS.Timeout;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateGap, 150);
      };
    })();
    
    vv.addEventListener('resize', debouncedResize);
    vv.addEventListener('scroll', debouncedScroll);
    window.addEventListener('orientationchange', debouncedResize);
    
    return () => {
      vv.removeEventListener('resize', debouncedResize);
      vv.removeEventListener('scroll', debouncedScroll);
      window.removeEventListener('orientationchange', debouncedResize);
    };
  }, [navRef]);
}
