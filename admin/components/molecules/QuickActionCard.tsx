'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';

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
          rounded-lg p-5
          transition-all duration-300
          hover:border-admin-primary/50
          hover:bg-admin-dark-elevated
          hover:shadow-md hover:shadow-black/20
        "
      >
        {/* Content */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="
              w-11 h-11 rounded-lg
              flex items-center justify-center
              bg-admin-primary/10
              border border-admin-primary/30
              text-admin-primary
              transition-all duration-300
              group-hover:bg-admin-primary/20
              group-hover:border-admin-primary/50
              group-hover:scale-110
              group-hover:rotate-6
            ">
              <Icon name={icon} size={22} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-text-primary font-medium mb-1 group-hover:text-admin-primary transition-colors duration-300">
              {title}
            </h3>
            {description && (
              <p className="text-text-muted text-sm line-clamp-2">
                {description}
              </p>
            )}
          </div>
          
          {/* Arrow indicator */}
          <div className="flex-shrink-0 flex items-center text-text-muted group-hover:text-admin-primary transition-all duration-300 group-hover:translate-x-1">
            <Icon name="chevronRight" size={20} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
