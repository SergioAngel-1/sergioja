'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { RefObject, useEffect, useState, useMemo, useRef } from 'react';
import MobileNavItem from '../molecules/MobileNavItem';
import NavBackground from '../molecules/NavBackground';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';

interface NavItem {
  href: string;
  labelKey: string;
  icon: string;
}

interface MobileNavProps {
  navItems: NavItem[];
  mounted: boolean;
  lowPerformanceMode: boolean;
  navRef: RefObject<HTMLDivElement>;
  t: (key: string) => string;
}

export default function MobileNav({
  navItems,
  mounted,
  lowPerformanceMode,
  navRef,
  t
}: MobileNavProps) {
  const pathname = usePathname();
  const { direction: scrollDirection, isAtBottom } = useScrollDirection({ threshold: 50, debounce: 50 });
  const controls = useAnimationControls();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);
  const lastScrollYRef = useRef(0);
  const accumulatedDistanceRef = useRef(0);

  const handleNavigate = (href: string) => {
    if (pathname !== href) {
      window.dispatchEvent(new Event('app:navigation-start'));
    }
  };

  // Mostrar navbar al cambiar de página
  useEffect(() => {
    // Reset scroll distance al cambiar de página
    accumulatedDistanceRef.current = 0;
    setScrollDistance(0);
    
    controls.start({
      y: 0,
      opacity: 1,
      transition: lowPerformanceMode ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' }
    });
  }, [pathname, controls, lowPerformanceMode]);

  // Listen for terminal modal and DevTips modal state changes
  useEffect(() => {
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => {
      setIsModalOpen(false);
      // iOS fix: Force navbar to show immediately when modal closes
      controls.start({
        y: 0,
        opacity: 1,
        transition: lowPerformanceMode ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' }
      });
    };

    window.addEventListener('terminal-modal-open', handleModalOpen);
    window.addEventListener('terminal-modal-close', handleModalClose);
    window.addEventListener('devtips-modal-open', handleModalOpen);
    window.addEventListener('devtips-modal-close', handleModalClose);
    window.addEventListener('game-modal-open', handleModalOpen);
    window.addEventListener('game-modal-close', handleModalClose);

    return () => {
      window.removeEventListener('terminal-modal-open', handleModalOpen);
      window.removeEventListener('terminal-modal-close', handleModalClose);
      window.removeEventListener('devtips-modal-open', handleModalOpen);
      window.removeEventListener('devtips-modal-close', handleModalClose);
      window.removeEventListener('game-modal-open', handleModalOpen);
      window.removeEventListener('game-modal-close', handleModalClose);
    };
  }, [controls, lowPerformanceMode]);

  // Track scroll distance for delayed hide
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (scrollDirection === 'down') {
        // Acumular distancia solo en scroll down
        accumulatedDistanceRef.current += Math.abs(delta);
      } else {
        // Reset en scroll up o null
        accumulatedDistanceRef.current = 0;
      }

      setScrollDistance(accumulatedDistanceRef.current);
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDirection]);

  // Memoizar cálculo de hasScroll para evitar recalcular en cada render
  const hasScroll = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.scrollHeight > window.innerHeight;
  }, [pathname]); // Recalcular solo cuando cambia la página

  // Auto-hide navbar on scroll down, show on scroll up, always show at bottom
  useEffect(() => {
    // Transición basada en performance mode
    const transition = lowPerformanceMode 
      ? { duration: 0 } 
      : { duration: 0.3, ease: 'easeInOut' };

    // Ocultar navbar si el modal está abierto
    if (isModalOpen) {
      controls.start({ y: 100, opacity: 0, transition });
      return;
    }
    
    // Solo aplicar auto-hide si hay scroll disponible
    if (!hasScroll) {
      controls.start({ y: 0, opacity: 1, transition });
      return;
    }

    // Siempre mostrar navbar si está al final de la página
    if (isAtBottom) {
      controls.start({ y: 0, opacity: 1, transition });
      return;
    }

    // Solo ocultar después de scrollear 50px hacia abajo
    if (scrollDirection === 'down' && scrollDistance > 50) {
      controls.start({ y: 100, opacity: 0, transition });
    } else if (scrollDirection === 'up') {
      controls.start({ y: 0, opacity: 1, transition });
    }
  }, [scrollDirection, scrollDistance, isAtBottom, isModalOpen, controls, hasScroll, lowPerformanceMode]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: 0, opacity: 1 }}
      animate={controls}
      transition={lowPerformanceMode ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' }}
      className="md:hidden fixed left-0 right-0 bg-background-surface/95 backdrop-blur-md border-t border-white/30 z-50 mobile-nav-safe-area"
      style={{
        bottom: 'var(--bottom-gap, 0px)',
        paddingBottom: '0.75rem',
        paddingTop: '0.75rem',
      }}
    >
      <NavBackground 
        mounted={mounted} 
        lowPerformanceMode={lowPerformanceMode} 
        orientation="horizontal"
      />

      {/* Navigation Items */}
      <div className="flex items-center justify-around relative z-10">
        {navItems.map((item, index) => (
          <MobileNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={pathname === item.href}
            index={index}
            onNavigate={() => handleNavigate(item.href)}
          />
        ))}
      </div>
    </motion.nav>
  );
}
