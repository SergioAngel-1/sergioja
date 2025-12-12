'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
import { clamp, fluidSizing } from '@/lib/fluidSizing';

interface QuickActionCardProps {
  title: string;
  description?: string;
  icon: string;
  href: string;
  delay?: number;
}

export default function QuickActionCard({ 
  title, 
  description,
  icon, 
  href,
  delay = 0
}: QuickActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link
        href={href}
        className="
          group relative block
          bg-admin-dark-surface 
          border border-admin-primary/20
          rounded-lg
          transition-all duration-300
          hover:border-admin-primary/50
          hover:bg-admin-dark-elevated
          hover:shadow-md hover:shadow-black/20
        "
        style={{
          padding: `${fluidSizing.space.md} ${fluidSizing.space.md}`
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex items-center" style={{ gap: fluidSizing.space.sm }}>
          <div className="flex-shrink-0">
            <div className="
              rounded-lg
              flex items-center justify-center
              bg-admin-primary/10
              border border-admin-primary/30
              text-admin-primary
              transition-all duration-300
              group-hover:bg-admin-primary/20
              group-hover:border-admin-primary/50
              group-hover:scale-110
              group-hover:rotate-6
            "
            style={{
              width: clamp('2.5rem', '5vw', '3rem'),
              height: clamp('2.5rem', '5vw', '3rem')
            }}>
              <Icon name={icon} size={22} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-text-primary font-medium group-hover:text-admin-primary transition-colors duration-300" style={{ fontSize: fluidSizing.text.base, lineHeight: '1.4' }}>
              {title}
            </h3>
            {description && (
              <p className="text-text-muted line-clamp-2" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs, lineHeight: '1.5' }}>
                {description}
              </p>
            )}
          </div>
          
          {/* Arrow indicator */}
          <div className="flex-shrink-0 flex items-center text-text-muted group-hover:text-admin-primary transition-all duration-300 group-hover:translate-x-1">
            <Icon name="chevronRight" size={16} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
