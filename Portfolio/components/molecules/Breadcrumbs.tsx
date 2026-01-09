'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  maxLength?: number;
  maxLengthMobile?: number;
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export default function Breadcrumbs({ items, maxLength = 25, maxLengthMobile = 15 }: BreadcrumbsProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigate = (href: string) => {
    if (pathname !== href) {
      window.dispatchEvent(new Event('app:navigation-start'));
    }
  };

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname, t);
  
  // En mobile, mostrar solo los últimos 2 niveles (anterior y actual)
  const mobileBreadcrumbs = breadcrumbItems.length > 2 
    ? breadcrumbItems.slice(-2) 
    : breadcrumbItems;

  if (!mounted) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center"
      style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.lg }}
      aria-label="Breadcrumb"
    >
      {/* Mobile: Solo 2 niveles */}
      <div className="flex sm:hidden items-center bg-background-surface/30 backdrop-blur-sm border border-white/20 rounded-sm breadcrumb-equal-mobile" style={{ gap: fluidSizing.space.sm, padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}>
        <span className="font-mono text-white text-fluid-xs">{'<'}</span>
        
        {mobileBreadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
            {item.href ? (
              <Link
                href={item.href}
                className="font-mono text-text-muted hover:text-white transition-colors text-fluid-xs"
                title={item.label}
                onClick={() => handleNavigate(item.href!)}
              >
                {truncateText(item.label, maxLengthMobile)}
              </Link>
            ) : (
              <span className="font-mono text-white font-semibold text-fluid-xs" title={item.label}>
                {truncateText(item.label, maxLengthMobile)}
              </span>
            )}
            
            {index < mobileBreadcrumbs.length - 1 && (
              <span className="font-mono text-text-muted text-fluid-xs">/</span>
            )}
          </div>
        ))}
        
        <span className="font-mono text-white text-fluid-xs">{'/>'}</span>
      </div>

      {/* Desktop: Todos los niveles */}
      <div className="hidden sm:flex items-center bg-background-surface/30 backdrop-blur-sm border border-white/20 rounded-sm" style={{ gap: fluidSizing.space.sm, padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}>
        <span className="font-mono text-white text-fluid-xs">{'<'}</span>
        
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
            {item.href ? (
              <Link
                href={item.href}
                className="font-mono text-text-muted hover:text-white transition-colors text-fluid-xs"
                title={item.label}
                onClick={() => handleNavigate(item.href!)}
              >
                {truncateText(item.label, maxLength)}
              </Link>
            ) : (
              <span className="font-mono text-white font-semibold text-fluid-xs" title={item.label}>
                {truncateText(item.label, maxLength)}
              </span>
            )}
            
            {index < breadcrumbItems.length - 1 && (
              <span className="font-mono text-text-muted text-fluid-xs">/</span>
            )}
          </div>
        ))}
        
        <span className="font-mono text-white text-fluid-xs">{'/>'}</span>
      </div>
    </motion.nav>
  );
}

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string, t: (key: string) => string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('nav.home'), href: '/' }
  ];

  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    const isLast = index === paths.length - 1;
    const map: Record<string, string> = {
      work: t('nav.work'),
      about: t('nav.about'),
      contact: t('nav.contact'),
      projects: t('nav.projects'),
      faq: 'FAQ',
      terms: 'Términos',
    };
    
    breadcrumbs.push({
      label: map[path] || path.toUpperCase(),
      href: isLast ? undefined : currentPath
    });
  });

  return breadcrumbs;
}
