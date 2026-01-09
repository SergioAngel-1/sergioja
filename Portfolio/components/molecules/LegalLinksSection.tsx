'use client';

import { motion } from 'framer-motion';
import LegalLinkCard from '@/components/molecules/LegalLinkCard';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
    >
      <p className="text-text-muted font-mono uppercase tracking-wider text-fluid-xs mb-3">
        {title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: fluidSizing.space.xs }}>
        {links.map((link, index) => (
          <LegalLinkCard
            key={link.key}
            icon={link.icon}
            label={link.label}
            path={link.path}
            index={index}
            onLinkClick={onLinkClick}
          />
        ))}
      </div>
    </motion.div>
  );
}
