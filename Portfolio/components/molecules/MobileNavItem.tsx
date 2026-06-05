'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface TabBarItemProps {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
  onNavigate: () => void;
}

export default function TabBarItem({ href, icon, label, isActive, onNavigate }: TabBarItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="relative flex flex-col items-center gap-1 px-4 py-1.5 flex-1"
    >
      <div className="relative flex items-center justify-center overflow-visible">
        {isActive && (
          <motion.div
            layoutId="tab-indicator"
            className="absolute -top-[14px] w-8 h-0.5 rounded-full bg-white/80"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            isActive ? 'text-white' : 'text-text-muted/60'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={isActive ? 2.5 : 1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <span
        className={`text-[10px] font-medium tracking-widest transition-colors duration-200 leading-none ${
          isActive ? 'text-white/90' : 'text-text-muted/50'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
