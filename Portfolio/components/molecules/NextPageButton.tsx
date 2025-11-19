'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface PageRoute {
  path: string;
  labelKey: string;
  next?: string;
}

const routes: PageRoute[] = [
  { path: '/', labelKey: 'nextpage.home', next: '/projects' },
  { path: '/projects', labelKey: 'nextpage.projects', next: '/about' },
  { path: '/about', labelKey: 'nextpage.about', next: '/contact' },
  { path: '/contact', labelKey: 'nextpage.contact', next: '/' },
];

export default function NextPageButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  // Detectar si estamos en una página de proyecto individual
  const isProjectDetailPage = pathname?.startsWith('/projects/') && pathname !== '/projects';
  
  // Si estamos en detalle de proyecto, configurar ruta de retorno
  const projectBackRoute = isProjectDetailPage ? {
    path: '/projects',
    labelKey: 'nextpage.projects',
    isBack: true
  } : null;

  const currentRoute = routes.find((route) => route.path === pathname);
  const nextRoute = projectBackRoute || routes.find((route) => route.path === currentRoute?.next);

  useEffect(() => {
    // Iniciar desactivado
    setIsVisible(false);

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      
      // Calcular si hay contenido scrolleable
      const hasScroll = scrollHeight > clientHeight;
      
      if (!hasScroll) {
        // Si no hay scroll, NO mostrar el botón automáticamente
        setIsVisible(true);
      } else {
        // Si hay scroll, solo mostrar cuando esté cerca del final (90% scrolled)
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
        const isNearBottom = scrollPercentage >= 0.9;
        
        // Ocultar si vuelve arriba (menos del 85%)
        const isBackToTop = scrollPercentage < 0.85;
        
        if (isNearBottom) {
          setIsVisible(true);
        } else if (isBackToTop) {
          setIsVisible(false);
        }
      }
    };

    // Esperar un momento antes de verificar el estado inicial
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // También verificar en resize

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [pathname]); // Re-evaluar cuando cambie la ruta

  const handleClick = () => {
    if (nextRoute) {
      window.dispatchEvent(new Event('app:navigation-start'));
      router.push(nextRoute.path);
    }
  };

  const isBackButton = projectBackRoute !== null;

  // Don't show if there's no next page
  if (!nextRoute) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="group fixed z-40 flex items-center md:bottom-8 lg:bottom-12"
          style={{ 
            bottom: `calc(var(--mobile-nav-height, 4rem) + ${fluidSizing.space.lg} + env(safe-area-inset-bottom))`, 
            right: fluidSizing.space.lg, 
            gap: fluidSizing.space.md 
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Tooltip on hover - moved before button for better layout */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={
              isHovered
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: 10 }
            }
            transition={{ duration: 0.2 }}
            className="pointer-events-none"
          >
            <div className="bg-background-surface/90 backdrop-blur-md border border-white/30 rounded-lg whitespace-nowrap shadow-lg" style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}>
              <span className="font-mono text-text-secondary text-fluid-xs">
                {isBackButton ? (
                  <>
                    <span className="font-orbitron font-semibold text-white">{t('common.back')}</span> {t('nextpage.next')}: <span className="font-orbitron font-semibold text-white">{t(nextRoute.labelKey)}</span>
                  </>
                ) : (
                  <>
                    {t('nextpage.next')}: <span className="font-orbitron font-semibold text-white">{t(nextRoute.labelKey)}</span>
                  </>
                )}
              </span>
            </div>
          </motion.div>

          {/* Circular button */}
          <div className="relative rounded-full bg-background-surface/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 shadow-lg" style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}>
            {/* Pulsing background */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Arrow icon - changes based on context */}
            {isBackButton ? (
              // Back arrow for project detail pages
              <motion.svg
                className="size-icon-md text-white relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={isHovered ? { x: [0, -2, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </motion.svg>
            ) : pathname === '/contact' ? (
              // Home icon for Contact page
              <svg
                className="size-icon-md text-white relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            ) : (
              // Arrow icon for other pages
              <motion.svg
                className="size-icon-md text-white relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={isHovered ? { x: [0, 2, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            )}

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.4)',
              }}
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
