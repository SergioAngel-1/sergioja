'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface PageRoute {
  path: string;
  labelKey: string;
  next?: string;
}

const routes: PageRoute[] = [
  { path: '/', labelKey: 'nextpage.home', next: '/work' },
  { path: '/work', labelKey: 'nextpage.work', next: '/about' },
  { path: '/about', labelKey: 'nextpage.about', next: '/contact' },
  { path: '/contact', labelKey: 'nextpage.contact', next: '/' },
];

export default function NextPageButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const currentRoute = routes.find((route) => route.path === pathname);
  const nextRoute = routes.find((route) => route.path === currentRoute?.next);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      
      // Show button when user is near bottom (80% scrolled)
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      setIsVisible(scrollPercentage > 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (nextRoute) {
      router.push(nextRoute.path);
    }
  };

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
          className="group fixed bottom-8 right-8 z-[60] hidden md:flex items-center gap-3"
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
            <div className="bg-background-surface/90 backdrop-blur-md border border-white/30 rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
              <span className="font-mono text-xs text-text-secondary">
                {t('nextpage.next')}: <span className="font-orbitron font-semibold text-white">{t(nextRoute.labelKey)}</span>
              </span>
            </div>
          </motion.div>

          {/* Circular button */}
          <div className="relative w-12 h-12 rounded-full bg-background-surface/80 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/10 shadow-lg">
            {/* Pulsing background */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Arrow icon - changes based on if it's going back to home */}
            {pathname === '/contact' ? (
              // Home icon for Contact page
              <svg
                className="w-5 h-5 text-white relative z-10"
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
                className="w-5 h-5 text-white relative z-10"
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
