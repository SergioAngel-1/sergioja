'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function FAQItem({ question, answer, index, isOpen = false, onToggle }: FAQItemProps) {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  const isExpanded = onToggle ? isOpen : internalOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group"
    >
      <button
        onClick={handleToggle}
        className="w-full text-left bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 overflow-hidden"
        aria-expanded={isExpanded}
      >
        <div className="p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4">
          {/* Icon indicator */}
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-shrink-0 mt-1"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </motion.div>

          {/* Question */}
          <div className="flex-1 min-w-0">
            <h3 className="font-orbitron font-bold text-white text-sm sm:text-base md:text-lg leading-tight pr-2">
              {question}
            </h3>
          </div>

          {/* Number badge */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 border border-white/20 text-white/60 font-mono text-xs">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Answer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-0">
                <div className="pl-8 sm:pl-10 border-l-2 border-white/20">
                  <p className="text-text-secondary font-rajdhani text-sm sm:text-base leading-relaxed">
                    {answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
