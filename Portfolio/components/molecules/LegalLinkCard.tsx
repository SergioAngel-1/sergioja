'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface LegalLinkCardProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  index: number;
  keyName: string;
  onLinkClick?: (key: string) => void;
}

export default function LegalLinkCard({ icon, label, path, index, keyName, onLinkClick }: LegalLinkCardProps) {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => {
        onLinkClick?.(keyName);
        if (path !== '#') {
          window.dispatchEvent(new Event('app:navigation-start'));
          router.push(path);
        }
      }}
      className="relative group bg-background-elevated/30 backdrop-blur-sm border border-white/10 rounded-lg hover:border-white/30 transition-all duration-300 text-left overflow-hidden"
      style={{ padding: fluidSizing.space.sm }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 + index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
        <div className="text-text-muted group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <span className="font-rajdhani font-medium text-text-secondary group-hover:text-white transition-colors text-fluid-sm">
          {label}
        </span>
      </div>
      
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 rounded-lg transition-opacity pointer-events-none" />
    </motion.button>
  );
}
