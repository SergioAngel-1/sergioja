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
      
      // Verificar que el elemento sea visible antes de medir (evita race condition con animaciones)
      const isVisible = navRef.current.offsetHeight > 0;
      if (!isVisible) return;
      
      const cs = getComputedStyle(navRef.current);
      const pb = parseFloat(cs.paddingBottom || '0') || 0;
      const h = Math.max(0, navRef.current.offsetHeight - pb);
      const currentHeight = document.documentElement.style.getPropertyValue('--mobile-nav-height');
      const newHeight = `${h}px`;
      
      // Solo actualizar si cambió significativamente (> 2px para evitar jitter)
      const currentH = parseFloat(currentHeight) || 0;
      if (Math.abs(currentH - h) > 2) {
        document.documentElement.style.setProperty('--mobile-nav-height', newHeight);
      }
    };
    
    // Delay inicial para asegurar que Framer Motion haya renderizado
    const initialTimeout = setTimeout(updateHeightVar, 100);
    
    const debouncedUpdate = (() => {
      let timeoutId: NodeJS.Timeout;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateHeightVar, 200);
      };
    })();
    
    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);
    
    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
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
        
        // Aumentar threshold a 3px para evitar loops y jitter en iOS Safari
        if (Math.abs(parseFloat(currentGlobalGap || '0') - gap) > 3) {
          document.documentElement.style.setProperty('--bottom-gap', newGap);
          
          // También establecer en el navbar para compatibilidad
          if (navRef.current) {
            navRef.current.style.setProperty('--bottom-gap', newGap);
          }
        }
      } catch (error) {
        // Silently fail - no crítico
      }
    };

    // Ejecutar inmediatamente
    updateGap();
    
    // Debounce optimizado para scroll con threshold más alto para evitar loops
    const debouncedScroll = (() => {
      let timeoutId: NodeJS.Timeout;
      let rafId: number;
      return () => {
        clearTimeout(timeoutId);
        cancelAnimationFrame(rafId);
        
        // Usar requestAnimationFrame para mejor performance
        rafId = requestAnimationFrame(() => {
          timeoutId = setTimeout(updateGap, 100); // Aumentado a 100ms para evitar loops
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
