'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface MobileNavItemProps {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
  index: number;
  onNavigate: () => void;
}

export default function MobileNavItem({ 
  href, 
  icon, 
  label, 
  isActive, 
  index,
  onNavigate 
}: MobileNavItemProps) {
  return (
    <div className="relative flex-1 flex justify-center">
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeMobileNav"
          className="absolute -top-3 left-0 right-0 mx-auto w-12 h-1 bg-white rounded-b-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link
          href={href}
          className="flex flex-col items-center gap-1 py-1 px-3"
          onClick={onNavigate}
        >
          <motion.div
            className={`transition-colors duration-300 ${
              isActive ? 'text-white' : 'text-text-muted'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6"
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
          <span
            className={`text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 ${
              isActive ? 'text-white font-bold' : 'text-text-muted'
            }`}
          >
            {label}
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
