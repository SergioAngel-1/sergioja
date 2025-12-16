'use client';

import { motion } from 'framer-motion';
import { trackOutboundLink } from '@/lib/analytics';

interface SocialLinkProps {
  href: string;
  icon: string;
  label: string;
  index: number;
}

export default function SocialLink({ href, icon, label, index }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative size-button-sm rounded-lg bg-background-surface border border-white/20 flex items-center justify-center text-text-muted hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 group overflow-hidden backdrop-blur-sm"
      aria-label={label}
      onClick={() => trackOutboundLink(href, label)}
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
        <path d={icon} />
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
  );
}
