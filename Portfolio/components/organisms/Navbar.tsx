'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import NavLink from '../molecules/NavLink';
import { useLogger } from '@/shared/hooks/useLogger';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { trackOutboundLink } from '@/lib/analytics';

export default function Navbar() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const log = useLogger('Navbar');
  const controls = useAnimation();
  const { lowPerformanceMode } = usePerformance();
  const { t } = useLanguage();
  const navRef = useRef<HTMLDivElement>(null);

  // Generate particle positions once to avoid hydration mismatch
  const particles = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      duration: 8 + i * 2,
      delay: i * 1.5,
    })),
    []
  );

  const navItems = [
    { href: '/', labelKey: 'nav.home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/projects', labelKey: 'nav.projects', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { href: '/about', labelKey: 'nav.about', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { href: '/contact', labelKey: 'nav.contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  // Initialize on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Measure mobile nav height (excluding safe-area padding) and expose as CSS var
  useEffect(() => {
    const updateHeightVar = () => {
      if (!navRef.current) return;
      const cs = getComputedStyle(navRef.current);
      const pb = parseFloat(cs.paddingBottom || '0') || 0; // includes safe-area
      const h = Math.max(0, navRef.current.offsetHeight - pb);
      document.documentElement.style.setProperty('--mobile-nav-height', `${h}px`);
    };
    updateHeightVar();
    window.addEventListener('resize', updateHeightVar);
    window.addEventListener('orientationchange', updateHeightVar);
    return () => {
      window.removeEventListener('resize', updateHeightVar);
      window.removeEventListener('orientationchange', updateHeightVar);
    };
  }, []);

  // Log navigation changes
  useEffect(() => {
    log.info(`Navigated to ${pathname}`);
  }, [pathname]);

  // iOS Safari: adjust bottom gap when browser UI is visible using VisualViewport
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const vv: any = (window as any).visualViewport;
    if (!vv) return;

    const updateGap = () => {
      try {
        const gap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        if (navRef.current) {
          navRef.current.style.setProperty('--bottom-gap', `${gap}px`);
        }
      } catch {}
    };

    updateGap();
    vv.addEventListener('resize', updateGap);
    vv.addEventListener('scroll', updateGap);
    window.addEventListener('orientationchange', updateGap);
    return () => {
      vv.removeEventListener('resize', updateGap);
      vv.removeEventListener('scroll', updateGap);
      window.removeEventListener('orientationchange', updateGap);
    };
  }, []);

  return (
    <>
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-screen bg-background-surface/90 backdrop-blur-md border-r border-white/30 z-50 md:flex flex-col items-center overflow-hidden hidden"
      style={{
        width: 'var(--nav-width)',
        padding: `${fluidSizing.space.md} 0`
      }}
    >
      {/* Animated background gradient */}
      {mounted && (
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={lowPerformanceMode ? {} : {
            background: [
              'linear-gradient(180deg, rgba(0,191,255,0.1) 0%, rgba(255,0,0,0.1) 100%)',
              'linear-gradient(180deg, rgba(255,0,0,0.1) 0%, rgba(139,0,255,0.1) 100%)',
              'linear-gradient(180deg, rgba(139,0,255,0.1) 0%, rgba(0,191,255,0.1) 100%)',
            ],
          }}
          transition={lowPerformanceMode ? {} : { duration: 10, repeat: Infinity }}
        />
      )}

      {/* Vertical line decorations */}
      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-30" />
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-30" />

      {/* Floating particles - desde separador hasta indicador rojo */}
      {mounted && !lowPerformanceMode && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-cyber-red rounded-full z-0"
          style={{ left: '50%', top: '75%' }}
          animate={{
            y: [0, '-60vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
      {/* Logo/Brand */}
      <motion.div
        className="relative z-10"
        style={{ marginBottom: fluidSizing.space.xl }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <a
          href="https://sergioja.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="relative">
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-white blur-md"
              animate={lowPerformanceMode ? {} : {
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={lowPerformanceMode ? {} : { duration: 2, repeat: Infinity }}
            />
            
            {/* Main logo */}
            <div 
              className="relative bg-gradient-to-br from-black to-gray-900 rounded-lg flex items-center justify-center border border-white/50 size-button-md"
            >
              <span 
                className="font-orbitron font-bold text-white text-fluid-sm"
              >
                SJ
              </span>
              
              {/* Corner accents */}
              <div 
                className="absolute border-t-2 border-l-2 border-white" 
                style={{
                  top: `calc(-1 * ${fluidSizing.space.xs})`,
                  left: `calc(-1 * ${fluidSizing.space.xs})`,
                  width: fluidSizing.space.sm,
                  height: fluidSizing.space.sm
                }}
              />
              <div 
                className="absolute border-b-2 border-r-2 border-white" 
                style={{
                  bottom: `calc(-1 * ${fluidSizing.space.xs})`,
                  right: `calc(-1 * ${fluidSizing.space.xs})`,
                  width: fluidSizing.space.sm,
                  height: fluidSizing.space.sm
                }}
              />
            </div>
          </div>
        </a>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="flex flex-col items-center relative z-10 mb-fluid-xl gap-fluid-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative">
          <div 
            className="bg-cyber-red rounded-full" 
            style={{
              width: fluidSizing.space.sm,
              height: fluidSizing.space.sm
            }}
          />
          <motion.div
            className="absolute inset-0 bg-cyber-red rounded-full"
            animate={lowPerformanceMode ? {} : { scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={lowPerformanceMode ? {} : { duration: 2, repeat: Infinity }}
          />
        </div>
        <div 
          className="w-px bg-gradient-to-b from-cyber-red to-transparent" 
          style={{ height: fluidSizing.space.xl }}
        />
      </motion.div>

      {/* Navigation Links */}
      <div 
        className="flex-1 flex flex-col relative z-10"
        style={{ gap: 'var(--nav-gap)' }}
      >
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="relative group"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute top-1/2 -translate-y-1/2 bg-white rounded-r-full"
                  style={{
                    left: `calc(-1 * ${fluidSizing.space.xl})`,
                    width: fluidSizing.space.xs,
                    height: fluidSizing.space.xl
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon */}
              <Link
                href={item.href}
                className="block relative z-10"
                onClick={() => {
                  if (pathname !== item.href) {
                    window.dispatchEvent(new Event('app:navigation-start'));
                  }
                }}
              >
                <motion.div
                  className={`size-button-md rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                    isActive
                      ? 'bg-white/20 border border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                      : 'bg-background-surface border border-white/20 hover:border-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className={`size-icon-md transition-colors ${
                      isActive ? 'text-white' : 'text-text-muted group-hover:text-white'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                </motion.div>

                {/* Tooltip */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                  style={{ left: `calc(${fluidSizing.nav.width} + ${fluidSizing.space.sm})` }}
                  initial={false}
                >
                  <div 
                    className="bg-background-surface border border-white/30 rounded whitespace-nowrap p-fluid-sm"
                  >
                    <span 
                      className="font-orbitron text-white text-fluid-xs"
                    >
                      {t(item.labelKey)}
                    </span>
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 bg-background-surface border-l border-b border-white/30 transform rotate-45" 
                      style={{
                        width: fluidSizing.space.sm,
                        height: fluidSizing.space.sm
                      }}
                    />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Divider */}
      <div 
        className="h-px bg-gradient-to-r from-transparent via-cyber-red to-transparent relative z-10" 
        style={{
          width: fluidSizing.space.xl,
          margin: `${fluidSizing.space.lg} 0`
        }}
      />

      {/* Time display - Hidden on small screens */}
      <motion.div
        className="relative z-10 group cursor-default hidden 2xl:block mb-fluid-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
      >
        <div 
          className="text-center rounded-lg bg-background-elevated/0 group-hover:bg-background-elevated/50 transition-all duration-300 p-fluid-sm"
        >
          <div 
            className="font-mono text-white group-hover:text-cyber-blue-cyan transition-colors text-fluid-xs mb-fluid-xs"
          >
            {time ? time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </div>
          <div 
            className="font-mono text-text-muted group-hover:text-white transition-colors text-fluid-xs"
          >
            {time ? time.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : '--- --'}
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <div 
        className="flex flex-col relative z-10 gap-fluid-sm"
      >
      {[
        { href: 'https://github.com', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', label: 'GitHub' },
        { href: 'https://linkedin.com', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', label: 'LinkedIn' },
        { href: 'https://twitter.com', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', label: 'Twitter' },
      ].map((social, index) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative size-button-sm rounded-lg bg-background-surface border border-white/20 flex items-center justify-center text-text-muted hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 group overflow-hidden backdrop-blur-sm"
          aria-label={social.label}
          onClick={() => trackOutboundLink(social.href, social.label)}
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + index * 0.1 }}
        >
          <svg 
            className="relative z-10 transition-transform group-hover:scale-110 size-icon-sm" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d={social.icon} />
          </svg>
          <motion.div
            className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 blur-sm transition-opacity"
          />
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)'
            }}
          />
        </motion.a>
      ))}
      </div>
    </motion.nav>

    {/* Mobile Navigation - Bottom Bar */}
    <motion.nav
      ref={navRef}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="md:hidden fixed left-0 right-0 bg-background-surface/95 backdrop-blur-md border-t border-white/30 z-50 px-4 py-3 safe-area-bottom"
      style={{
        bottom: 0,
      }}
    >
      {/* Animated background gradient */}
      {mounted && (
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={lowPerformanceMode ? {} : {
            background: [
              'linear-gradient(90deg, rgba(0,191,255,0.1) 0%, rgba(255,0,0,0.1) 100%)',
              'linear-gradient(90deg, rgba(255,0,0,0.1) 0%, rgba(139,0,255,0.1) 100%)',
              'linear-gradient(90deg, rgba(139,0,255,0.1) 0%, rgba(0,191,255,0.1) 100%)',
            ],
          }}
          transition={lowPerformanceMode ? {} : { duration: 10, repeat: Infinity }}
        />
      )}

      {/* Navigation Items */}
      <div className="flex items-center justify-around relative z-10">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <div
              key={item.href}
              className="relative flex-1 flex justify-center"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeMobileNav"
                  className="absolute -top-3 left-0 right-0 mx-auto w-12 h-1 bg-white rounded-b-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-1 py-1 px-3"
                  onClick={() => {
                    if (pathname !== item.href) {
                      window.dispatchEvent(new Event('app:navigation-start'));
                    }
                  }}
                >
                  <motion.div
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-text-muted'
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                  </motion.div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? 'text-white font-bold' : 'text-text-muted'
                    }`}
                  >
                    {t(item.labelKey)}
                  </span>
                </Link>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
    </motion.nav>
    </>
  );
}
