'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLogger } from '@/shared/hooks/useLogger';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import useProfile from '@/lib/hooks/useProfile';
import { useNavbarEffects } from '@/lib/hooks/useNavbarEffects';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default function Navbar() {
  const [time, setTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const log = useLogger('Navbar');
  const { lowPerformanceMode } = usePerformance();
  const { t } = useLanguage();
  const navRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();

  // Custom hook para manejar efectos de navbar
  useNavbarEffects(navRef);

  const navItems = [
    { href: '/', labelKey: 'nav.home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/projects', labelKey: 'nav.projects', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { href: '/about', labelKey: 'nav.about', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { href: '/contact', labelKey: 'nav.contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  // Initialize on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Log navigation changes
  useEffect(() => {
    log.info(`Navigated to ${pathname}`);
  }, [pathname, log]);

  // Listen to modal open/close events
  useEffect(() => {
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    window.addEventListener('devtips-modal-open', handleModalOpen);
    window.addEventListener('devtips-modal-close', handleModalClose);
    window.addEventListener('terminal-modal-open', handleModalOpen);
    window.addEventListener('terminal-modal-close', handleModalClose);
    window.addEventListener('game-modal-open', handleModalOpen);
    window.addEventListener('game-modal-close', handleModalClose);

    return () => {
      window.removeEventListener('devtips-modal-open', handleModalOpen);
      window.removeEventListener('devtips-modal-close', handleModalClose);
      window.removeEventListener('terminal-modal-open', handleModalOpen);
      window.removeEventListener('terminal-modal-close', handleModalClose);
      window.removeEventListener('game-modal-open', handleModalOpen);
      window.removeEventListener('game-modal-close', handleModalClose);
    };
  }, []);

  return (
    <>
      {!isModalOpen && (
        <DesktopNav
          navItems={navItems}
          mounted={mounted}
          lowPerformanceMode={lowPerformanceMode}
          time={time}
          profile={profile}
          t={t}
        />
      )}

      <MobileNav
        navItems={navItems}
        mounted={mounted}
        lowPerformanceMode={lowPerformanceMode}
        navRef={navRef}
        t={t}
      />
    </>
  );
}
