'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { RefObject, useEffect, useState } from 'react';
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
  const { direction: scrollDirection, isAtBottom } = useScrollDirection({ threshold: 10, debounce: 50 });
  const controls = useAnimationControls();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNavigate = (href: string) => {
    if (pathname !== href) {
      window.dispatchEvent(new Event('app:navigation-start'));
    }
  };

  // Mostrar navbar al cambiar de página
  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    });
  }, [pathname, controls]);

  // Listen for terminal modal state changes
  useEffect(() => {
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => {
      setIsModalOpen(false);
      // iOS fix: Force navbar to show immediately when modal closes
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: 'easeInOut' }
      });
    };

    window.addEventListener('terminal-modal-open', handleModalOpen);
    window.addEventListener('terminal-modal-close', handleModalClose);

    return () => {
      window.removeEventListener('terminal-modal-open', handleModalOpen);
      window.removeEventListener('terminal-modal-close', handleModalClose);
    };
  }, [controls]);

  // Auto-hide navbar on scroll down, show on scroll up, always show at bottom
  useEffect(() => {
    // Ocultar navbar si el modal está abierto
    if (isModalOpen) {
      controls.start({
        y: 100,
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeInOut' }
      });
      return;
    }

    // Verificar si la página tiene scroll disponible
    const hasScroll = document.documentElement.scrollHeight > window.innerHeight;
    
    // Solo aplicar auto-hide si hay scroll disponible
    if (!hasScroll) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: 'easeInOut' }
      });
      return;
    }

    // Siempre mostrar navbar si está al final de la página
    if (isAtBottom) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: 'easeInOut' }
      });
      return;
    }

    if (scrollDirection === 'down') {
      controls.start({
        y: 100,
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeInOut' }
      });
    } else if (scrollDirection === 'up') {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: 'easeInOut' }
      });
    }
  }, [scrollDirection, isAtBottom, isModalOpen, controls]);

  // iOS Safari: Force layout recalculation on orientation change
  useEffect(() => {
    const handleOrientationChange = () => {
      // Force reflow to fix iOS Safari layout issues
      if (navRef.current) {
        navRef.current.style.display = 'none';
        navRef.current.offsetHeight; // Trigger reflow
        navRef.current.style.display = '';
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [navRef]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: 0, opacity: 1 }}
      animate={controls}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
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
