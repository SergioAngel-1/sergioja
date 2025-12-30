'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import HexButtonBase from '@/components/atoms/HexButton';
import Modal from '@/components/molecules/Modal';
import HexagonGridBase from '@/components/atoms/HexagonGrid';

// Memoizar componentes pesados para prevenir re-renders innecesarios
const HexButton = memo(HexButtonBase);
const HexagonGrid = memo(HexagonGridBase);
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
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';
import { api } from '@/lib/api-client';
import type { Profile } from '@/lib/types';
import type { AvailabilityStatus } from '@/components/organisms/IdentityContent';

export default function Home() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const heroCenterRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const log = useLogger('Home');
  const { lowPerformanceMode } = usePerformance();
  const [isMobile, setIsMobile] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mounted, setMounted] = useState(false);

  const isInIframe = () => {
    if (typeof window === 'undefined') return false;
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  };
  
  // Track scroll depth and time on page
  usePageAnalytics();

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Sincronizar estado del modal con la ruta actual
  useEffect(() => {
    const path = window.location.pathname;
    const section = path.substring(1); // Remover el '/'
    
    if (section && ['navigation', 'identity', 'purpose', 'connection'].includes(section)) {
      setActiveModal(section);
    } else if (path === '/') {
      setActiveModal(null);
    }
  }, []);

  // Manejar navegación del navegador (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const section = path.substring(1);
      
      if (section && ['navigation', 'identity', 'purpose', 'connection'].includes(section)) {
        setActiveModal(section);
      } else {
        setActiveModal(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile(abortController.signal);
        if (response.success) {
          setProfile((response.data as Profile) || null);
        } else {
          // Don't log aborted requests
          if (response.error?.code !== 'ABORTED') {
            log.warn('Failed to load profile data', response.error);
          }
        }
      } catch (error) {
        // Don't log aborted requests
        if (error instanceof Error && error.name !== 'AbortError') {
          log.error('Error fetching profile', error);
        }
      }
    };
    
    fetchProfile();
    
    return () => {
      abortController.abort();
    };
  }, [log]);

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

  // Set hero size once (constant value)
  useEffect(() => {
    document.documentElement.style.setProperty('--hero-size', fluidSizing.size.heroContainer);
  }, []);

  // Track viewport center to keep hero centered (use window.innerHeight to avoid keyboard jump on iOS)
  useEffect(() => {
    const updateCenter = () => {
      // Use window.innerHeight instead of visualViewport to prevent hero jumping when keyboard appears
      const centerY = window.innerHeight / 2;
      if (heroCenterRef.current) {
        heroCenterRef.current.style.setProperty('--vv-center-y', `${centerY}px`);
      }
      document.documentElement.style.setProperty('--vv-center-y', `${centerY}px`);
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    window.addEventListener('orientationchange', updateCenter);
    return () => {
      window.removeEventListener('resize', updateCenter);
      window.removeEventListener('orientationchange', updateCenter);
    };
  }, []);

  const availabilityStatus: AvailabilityStatus =
    profile?.availability === 'busy' || profile?.availability === 'unavailable'
      ? profile.availability
      : 'available';

  const statusLabel = useMemo(() => {
    const fallback = 'Online';
    const map: Record<AvailabilityStatus, string> = {
      available: t('identity.statusAvailableTag') || fallback,
      busy: t('identity.statusBusyTag') || fallback,
      unavailable: t('identity.statusUnavailableTag') || fallback,
    };
    return map[availabilityStatus] || fallback;
  }, [availabilityStatus, t]);

  // Función para abrir modal y actualizar URL
  const openModal = (modalName: string | null) => {
    setActiveModal(modalName);
    
    if (modalName) {
      // Navegar a la ruta del modal (shallow routing)
      router.push(`/${modalName}`, { scroll: false });
      log.interaction('modal_opened', modalName);
    } else {
      // Volver a la raíz al cerrar
      router.push('/', { scroll: false });
    }
  };

  const closeModal = () => openModal(null);

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
        label={mounted ? t('nav.navigation') : ''}
        delay={0.2}
        onClick={() => openModal(activeModal === 'navigation' ? null : 'navigation')}
        isActive={activeModal === 'navigation'}
        showMenuLabel={mounted}
        menuLabel={mounted ? t('nav.menu') : ''}
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
        label={mounted ? t('nav.identity') : ''}
        delay={0.3}
        onClick={() => openModal(activeModal === 'identity' ? null : 'identity')}
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
        label={mounted ? t('nav.purpose') : ''}
        delay={0.4}
        onClick={() => openModal(activeModal === 'purpose' ? null : 'purpose')}
        isActive={activeModal === 'purpose'}
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
        label={mounted ? t('nav.connection') : ''}
        delay={0.5}
        onClick={() => openModal(activeModal === 'connection' ? null : 'connection')}
        isActive={activeModal === 'connection'}
        anyModalOpen={activeModal !== null}
        icon={
          <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        }
      />

      {/* Modales - Lazy loaded: only render when opened */}
      {activeModal === 'navigation' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={t('nav.navigation')}
          position="top-left"
          statusLabel={statusLabel}
          icon={
            <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          }
        >
          <NavigationContent onNavigate={(modal) => openModal(modal)} />
        </Modal>
      )}

      {activeModal === 'identity' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={t('nav.identity')}
          position="top-right"
          statusLabel={statusLabel}
          icon={
            <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        >
          <IdentityContent profile={profile} availabilityStatus={availabilityStatus} />
        </Modal>
      )}

      {activeModal === 'purpose' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={t('nav.purpose')}
          position="bottom-left"
          statusLabel={statusLabel}
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
      )}

      {activeModal === 'connection' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={t('nav.connection')}
          position="bottom-right"
          statusLabel={statusLabel}
          icon={
            <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          }
        >
          <ConnectionContent profile={profile} />
        </Modal>
      )}

      {/* Main content - centered across full page */}
      <main className="relative z-20 h-full">
        <div
          ref={heroCenterRef}
          className="fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ top: 'var(--vv-center-y, 50%)' }}
        >
          <CenteredHero onModelIntroComplete={() => {}} />
        </div>
      </main>

      {/* Scanline effect - CRT style */}
      <div
        className="absolute inset-0 pointer-events-none z-30 animate-scanline"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
          backgroundSize: '100% 4px',
        }}
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