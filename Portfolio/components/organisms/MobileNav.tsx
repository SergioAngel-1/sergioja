'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { RefObject, useEffect, useState, useMemo, useCallback } from 'react';
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
  const { direction: scrollDirection, isAtBottom, scrollDistance } = useScrollDirection({ 
    threshold: 50,
    accumulateDistance: true,
    resetDistanceThreshold: 10 // Evita resets por elastic scrolling de iOS
  });
  const controls = useAnimationControls();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoizar transición para evitar recrearla en cada render
  const transition = useMemo(() => 
    lowPerformanceMode ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' as const },
    [lowPerformanceMode]
  );

  const handleNavigate = useCallback((href: string) => {
    if (pathname !== href) {
      window.dispatchEvent(new Event('app:navigation-start'));
    }
  }, [pathname]);

  // Mostrar navbar al cambiar de página
  useEffect(() => {
    controls.start({ y: 0, opacity: 1, transition });
  }, [pathname, controls, transition]);

  // Listen for terminal modal and DevTips modal state changes
  useEffect(() => {
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => {
      setIsModalOpen(false);
      // iOS fix: Force navbar to show immediately when modal closes
      controls.start({ y: 0, opacity: 1, transition });
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
  }, [controls, transition]);

  // Auto-hide navbar on scroll down, show on scroll up, always show at bottom
  useEffect(() => {
    // Ocultar navbar si el modal está abierto
    if (isModalOpen) {
      controls.start({ y: 100, opacity: 0, transition });
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
    } else if (scrollDirection === 'up' || scrollDirection === null) {
      controls.start({ y: 0, opacity: 1, transition });
    }
  }, [scrollDirection, scrollDistance, isAtBottom, isModalOpen, controls, transition]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: 0, opacity: 1 }}
      animate={controls}
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
