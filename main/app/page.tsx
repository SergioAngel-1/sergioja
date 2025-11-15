'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import HexButton from '@/components/atoms/HexButton';
import Modal from '@/components/molecules/Modal';
import DataStream from '@/components/atoms/DataStream';
import HexagonGrid from '@/components/atoms/HexagonGrid';
import CenteredHero from '@/components/molecules/CenteredHero';
import NavigationContent from '@/components/organisms/NavigationContent';
import IdentityContent from '@/components/organisms/IdentityContent';
import ProjectsContent from '@/components/organisms/PurposeContent';
import ConnectionContent from '@/components/organisms/ConnectionContent';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';

// Valores estáticos de partículas para evitar diferencias servidor/cliente
const particles = [
  { width: 2.5, height: 3.2, left: 15, top: 20, x: 5, duration: 7, delay: 1 },
  { width: 1.8, height: 2.1, left: 85, top: 35, x: -3, duration: 8, delay: 2 },
  { width: 3.5, height: 1.5, left: 45, top: 60, x: 7, duration: 6, delay: 0.5 },
  { width: 2.2, height: 2.8, left: 70, top: 15, x: -5, duration: 9, delay: 1.5 },
  { width: 1.5, height: 3.8, left: 25, top: 80, x: 4, duration: 7.5, delay: 3 },
  { width: 3.2, height: 2.5, left: 55, top: 45, x: -6, duration: 6.5, delay: 0.8 },
  { width: 2.8, height: 1.9, left: 90, top: 70, x: 3, duration: 8.5, delay: 2.5 },
  { width: 1.2, height: 2.6, left: 10, top: 50, x: -4, duration: 7.2, delay: 1.2 },
  { width: 3.8, height: 3.5, left: 65, top: 25, x: 6, duration: 5.5, delay: 3.5 },
  { width: 2.1, height: 1.7, left: 35, top: 90, x: -7, duration: 9.5, delay: 0.3 },
  { width: 1.9, height: 3.1, left: 78, top: 55, x: 5.5, duration: 6.8, delay: 2.8 },
  { width: 3.3, height: 2.3, left: 20, top: 40, x: -3.5, duration: 8.2, delay: 1.8 },
  { width: 2.6, height: 2.9, left: 50, top: 75, x: 4.5, duration: 7.8, delay: 3.2 },
  { width: 1.6, height: 1.8, left: 95, top: 30, x: -6.5, duration: 5.8, delay: 0.6 },
  { width: 3.6, height: 3.4, left: 40, top: 65, x: 7.5, duration: 9.2, delay: 2.2 },
  { width: 2.4, height: 2.2, left: 60, top: 10, x: -2.5, duration: 6.2, delay: 1.6 },
  { width: 1.4, height: 3.6, left: 30, top: 85, x: 3.5, duration: 8.8, delay: 3.8 },
  { width: 3.1, height: 1.6, left: 75, top: 48, x: -5.5, duration: 7.5, delay: 0.9 },
  { width: 2.7, height: 2.7, left: 12, top: 22, x: 6.5, duration: 5.2, delay: 2.6 },
  { width: 1.3, height: 3.3, left: 88, top: 95, x: -4.5, duration: 9.8, delay: 1.4 },
];

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const heroCenterRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Track visual viewport center to keep hero perfectly centered on iOS/Android when browser UI shows/hides
  useEffect(() => {
    const updateCenter = () => {
      const vv: any = (window as any).visualViewport;
      const centerY = (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight) / 2;
      if (heroCenterRef.current) {
        heroCenterRef.current.style.setProperty('--vv-center-y', `${centerY}px`);
      }
      // Also expose globally to ensure fixed descendants can read it regardless of stacking contexts
      document.documentElement.style.setProperty('--vv-center-y', `${centerY}px`);
      // Expose hero size globally for CTA positioning
      document.documentElement.style.setProperty('--hero-size', 'clamp(280px, 40vw, 500px)');
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    window.addEventListener('orientationchange', updateCenter);
    (window as any).visualViewport?.addEventListener('resize', updateCenter);
    (window as any).visualViewport?.addEventListener('scroll', updateCenter);
    return () => {
      window.removeEventListener('resize', updateCenter);
      window.removeEventListener('orientationchange', updateCenter);
      (window as any).visualViewport?.removeEventListener('resize', updateCenter);
      (window as any).visualViewport?.removeEventListener('scroll', updateCenter);
    };
  }, []);

  const handlePortfolioClick = () => {
    window.location.href = 'http://localhost:3000';
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 cyber-grid opacity-10 z-0" />
      <div className="absolute inset-0 z-0">
        <HexagonGrid />
      </div>
      
      {/* Data streams */}
      <div className="absolute inset-0 z-0">
        <DataStream position="left" />
        <DataStream position="right" />
      </div>

      {/* Hex Buttons - Botones esquineros */}
      <HexButton
        position="top-left"
        label={t('nav.navigation')}
        delay={0.2}
        onClick={() => setActiveModal(activeModal === 'navigation' ? null : 'navigation')}
        isActive={activeModal === 'navigation'}
        icon={
          <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        }
      />

      <HexButton
        position="top-right"
        label={t('nav.identity')}
        delay={0.3}
        onClick={() => setActiveModal(activeModal === 'identity' ? null : 'identity')}
        isActive={activeModal === 'identity'}
        icon={
          <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <HexButton
        position="bottom-left"
        label={t('nav.purpose')}
        delay={0.4}
        onClick={() => setActiveModal(activeModal === 'projects' ? null : 'projects')}
        isActive={activeModal === 'projects'}
        icon={
          <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" strokeWidth={2} />
            <circle cx="12" cy="12" r="5" strokeWidth={2} />
            <circle cx="12" cy="12" r="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M2 12h2m16 0h2" />
          </svg>
        }
      />

      <HexButton
        position="bottom-right"
        label={t('nav.connection')}
        delay={0.5}
        onClick={() => setActiveModal(activeModal === 'connection' ? null : 'connection')}
        isActive={activeModal === 'connection'}
        icon={
          <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        }
      />

      {/* Modales */}
      <Modal
        isOpen={activeModal === 'navigation'}
        onClose={closeModal}
        title={t('nav.navigation')}
        position="top-left"
        icon={
          <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        }
      >
        <NavigationContent onNavigate={(modal) => setActiveModal(modal)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'identity'}
        onClose={closeModal}
        title={t('nav.identity')}
        position="top-right"
        icon={
          <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      >
        <IdentityContent />
      </Modal>

      <Modal
        isOpen={activeModal === 'projects'}
        onClose={closeModal}
        title={t('nav.purpose')}
        position="bottom-left"
        icon={
          <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" strokeWidth={2} />
            <circle cx="12" cy="12" r="5" strokeWidth={2} />
            <circle cx="12" cy="12" r="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M2 12h2m16 0h2" />
          </svg>
        }
      >
        <ProjectsContent />
      </Modal>

      <Modal
        isOpen={activeModal === 'connection'}
        onClose={closeModal}
        title={t('nav.connection')}
        position="bottom-right"
        icon={
          <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        }
      >
        <ConnectionContent />
      </Modal>

      {/* Main content - centered across full page */}
      <main className="relative z-20 h-full">
        <div
          ref={heroCenterRef}
          className="fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ top: 'var(--vv-center-y, 50%)' }}
        >
          <CenteredHero />
        </div>
      </main>

      {/* Floating particles - white dots */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: `clamp(${particle.width * 0.8}px, ${particle.width * 0.15}vw, ${particle.width}px)`,
            height: `clamp(${particle.height * 0.8}px, ${particle.height * 0.15}vw, ${particle.height}px)`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            backgroundColor: '#FFFFFF',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.x, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Scanline effect - CRT style */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
          backgroundSize: '100% 4px',
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Vignette effect - darker edges */}
      <div className="absolute inset-0 pointer-events-none z-30" 
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)'
        }}
      />
    </div>
  );
}