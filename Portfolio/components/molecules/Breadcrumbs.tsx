'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname, t);

  if (!mounted) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2 mb-4 md:mb-6"
      aria-label="Breadcrumb"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-background-surface/30 backdrop-blur-sm border border-white/20 rounded-sm">
        <span className="font-mono text-xs text-white">{'<'}</span>
        
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="font-mono text-xs text-text-muted hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-mono text-xs text-white font-semibold">
                {item.label}
              </span>
            )}
            
            {index < breadcrumbItems.length - 1 && (
              <span className="font-mono text-xs text-text-muted">/</span>
            )}
          </div>
        ))}
        
        <span className="font-mono text-xs text-white">{'/>'}</span>
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
    };
    
    breadcrumbs.push({
      label: map[path] || path.toUpperCase(),
      href: isLast ? undefined : currentPath
    });
  });

  return breadcrumbs;
}
