'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import HexButton from '@/components/atoms/HexButton';
import Modal from '@/components/molecules/Modal';
import HexagonGrid from '@/components/atoms/HexagonGrid';
import CenteredHero from '@/components/molecules/CenteredHero';
import NavigationContent from '@/components/organisms/NavigationContent';
import IdentityContent from '@/components/organisms/IdentityContent';
import ProjectsContent from '@/components/organisms/PurposeContent';
import ConnectionContent from '@/components/organisms/ConnectionContent';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { loadRecaptchaEnterprise } from '@/shared/recaptchaHelpers';
import { useLogger } from '@/shared/hooks/useLogger';
import { usePerformance } from '@/lib/contexts/PerformanceContext';

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const heroCenterRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const log = useLogger('Home');
  const { lowPerformanceMode } = usePerformance();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  useEffect(() => {
    if (activeModal === 'connection' && process.env.NODE_ENV === 'production') {
      const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
      if (key) {
        loadRecaptchaEnterprise(key).catch(() => {});
      }
    }
    if (activeModal) {
      log.interaction('open_modal', activeModal);
    } else {
      log.interaction('close_modal');
    }
  }, [activeModal]);

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
      // Expose hero size globally for CTA positioning (use fluidSizing token)
      document.documentElement.style.setProperty('--hero-size', fluidSizing.size.heroContainer);
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

  const closeModal = () => setActiveModal(null);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 cyber-grid opacity-10 z-0" />
      <div className="absolute inset-0 z-0">
        <HexagonGrid />
      </div>
      
      {/* Data streams - disabled in low performance mode */}

      {/* Hex Buttons - Botones esquineros */}
      <HexButton
        position="top-left"
        label={t('nav.navigation')}
        delay={0.2}
        onClick={() => setActiveModal(activeModal === 'navigation' ? null : 'navigation')}
        isActive={activeModal === 'navigation'}
        showMenuLabel={true}
        menuLabel={t('nav.menu')}
        anyModalOpen={activeModal !== null}
        icon={
          <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        }
      />

      {/* Low performance mode indicator */}
      {lowPerformanceMode && (
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 z-30 bg-black/80 backdrop-blur-sm border border-white/30 rounded-b-lg"
          style={{ 
            marginTop: fluidSizing.space.sm,
            padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
            maxWidth: 'calc(100vw - 2rem)'
          }}
        >
          <p 
            className="text-white/70 font-mono text-center"
            style={{ 
              fontSize: fluidSizing.text.xs,
              whiteSpace: isMobile ? 'normal' : 'nowrap'
            }}
          >
            {t('performance.modeActive')}
          </p>
        </div>
      )}

      <HexButton
        position="top-right"
        label={t('nav.identity')}
        delay={0.3}
        onClick={() => setActiveModal(activeModal === 'identity' ? null : 'identity')}
        isActive={activeModal === 'identity'}
        anyModalOpen={activeModal !== null}
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
        anyModalOpen={activeModal !== null}
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
        anyModalOpen={activeModal !== null}
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
          <CenteredHero onModelIntroComplete={() => setActiveModal((prev) => prev ?? 'navigation')} />
        </div>
      </main>

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