'use client';

import { useState, type ReactNode } from 'react';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: string;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  maxWidth = '300px',
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  if (!content) return <>{children}</>;

  return (
    <div 
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div
          className={`absolute z-[9999] pointer-events-none ${getPositionClasses()}`}
          style={{ maxWidth }}
        >
          <div
            className="bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl whitespace-nowrap"
            style={{
              padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
            }}
          >
            <div
              className="text-white text-xs font-mono"
              style={{ fontSize: fluidSizing.text.xs }}
            >
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
