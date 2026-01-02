'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  delay = 200,
  maxWidth = '300px',
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = rect.left + rect.width / 2 + scrollX;
          y = rect.top + scrollY;
          break;
        case 'bottom':
          x = rect.left + rect.width / 2 + scrollX;
          y = rect.bottom + scrollY;
          break;
        case 'left':
          x = rect.left + scrollX;
          y = rect.top + rect.height / 2 + scrollY;
          break;
        case 'right':
          x = rect.right + scrollX;
          y = rect.top + rect.height / 2 + scrollY;
          break;
      }

      setCoords({ x, y });
    }
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return {
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          transform: 'translate(-50%, calc(-100% - 8px))',
        };
      case 'bottom':
        return {
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          transform: 'translate(-50%, 8px)',
        };
      case 'left':
        return {
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          transform: 'translate(calc(-100% - 8px), -50%)',
        };
      case 'right':
        return {
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          transform: 'translate(8px, -50%)',
        };
      default:
        return {};
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex ${className}`}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] pointer-events-none"
            style={{
              ...getPositionStyles(),
              maxWidth,
            }}
          >
            <div
              className="bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl"
              style={{
                padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
              }}
            >
              <div
                className="text-white text-xs font-mono whitespace-normal break-words"
                style={{ fontSize: fluidSizing.text.xs }}
              >
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
