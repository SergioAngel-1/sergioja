'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface LegalLink {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface LegalLinksSectionProps {
  title: string;
  links: LegalLink[];
  onLinkClick?: (key: string) => void;
}

export default function LegalLinksSection({ title, links, onLinkClick }: LegalLinksSectionProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="border-t border-white/10"
      style={{ paddingTop: fluidSizing.space.md }}
    >
      <p className="text-text-muted font-mono uppercase tracking-wider text-fluid-xs mb-3">
        {title}
      </p>
      
      {/* All links in one row - both desktop and mobile */}
      <div className="flex items-center justify-start flex-wrap" style={{ gap: fluidSizing.space.sm }}>
        {links.map((link, index) => (
          <div key={link.key} className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
            <button
              onClick={() => {
                onLinkClick?.(link.key);
                if (link.path !== '#') {
                  window.dispatchEvent(new Event('app:navigation-start'));
                  router.push(link.path);
                }
              }}
              className="group flex items-center text-text-muted hover:text-white transition-colors duration-200"
              style={{ gap: fluidSizing.space.xs }}
            >
              <span className="text-text-muted/50 group-hover:text-white/70 transition-colors">
                {link.icon}
              </span>
              <span className="font-rajdhani font-medium text-fluid-sm">
                {link.label}
              </span>
            </button>
            {index < links.length - 1 && (
              <span className="text-white/20">•</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
