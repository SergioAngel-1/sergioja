'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { RefObject, useEffect } from 'react';
import MobileNavItem from '../molecules/MobileNavItem';
import NavBackground from '../molecules/NavBackground';

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

  const handleNavigate = (href: string) => {
    if (pathname !== href) {
      window.dispatchEvent(new Event('app:navigation-start'));
    }
  };

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
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="md:hidden fixed left-0 right-0 bg-background-surface/95 backdrop-blur-md border-t border-white/30 z-50 px-4 mobile-nav-safe-area"
      style={{
        bottom: 'calc(var(--bottom-gap, 0px))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
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
