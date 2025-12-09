'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

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
          padding: fluidSizing.space.sm
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
              width: fluidSizing.size.iconLg,
              height: fluidSizing.size.iconLg
            }}>
              <Icon name={icon} size={18} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-text-primary font-medium group-hover:text-admin-primary transition-colors duration-300 truncate" style={{ fontSize: fluidSizing.text.sm, lineHeight: '1.4' }}>
              {title}
            </h3>
            {description && (
              <p className="text-text-muted line-clamp-1 hidden md:block" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
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
