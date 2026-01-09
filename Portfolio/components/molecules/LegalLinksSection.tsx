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
      style={{ marginTop: fluidSizing.space['2xl'], paddingTop: fluidSizing.space.lg }}
    >
      {/* Header simple */}
      <p className="text-white/50 font-mono uppercase tracking-wider text-fluid-xs" style={{ marginBottom: fluidSizing.space.md }}>
        {title}
      </p>
      
      {/* Links grid - 2 columnas en mobile, 4 en desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: fluidSizing.space.sm }}>
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => {
              onLinkClick?.(link.key);
              if (link.path !== '#') {
                window.dispatchEvent(new Event('app:navigation-start'));
                router.push(link.path);
              }
            }}
            className="group flex flex-col items-center justify-center border border-white/10 rounded-sm hover:border-white/30 hover:bg-white/5 transition-all duration-200"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.xs}`, minHeight: '3.5rem' }}
          >
            {/* Icon */}
            <span className="text-white/40 group-hover:text-white/70 transition-colors duration-200 mb-1">
              {link.icon}
            </span>
            
            {/* Label */}
            <span className="font-mono text-white/60 group-hover:text-white transition-colors duration-200 text-center text-fluid-xs">
              {link.label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
