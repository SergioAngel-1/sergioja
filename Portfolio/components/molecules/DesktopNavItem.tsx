'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface DesktopNavItemProps {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
  index: number;
  onNavigate: () => void;
}

export default function DesktopNavItem({ 
  href, 
  icon, 
  label, 
  isActive, 
  index,
  onNavigate 
}: DesktopNavItemProps) {
  return (
    <motion.div
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
        href={href}
        className="block relative z-10"
        onClick={onNavigate}
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
              d={icon}
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
              {label}
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
}
