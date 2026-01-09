'use client';

import { motion } from 'framer-motion';

interface TermsCardProps {
  title: string;
  content: string;
  icon: string;
  index: number;
}

export default function TermsCard({ title, content, icon, index }: TermsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
      className="bg-background-surface/50 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden hover:border-white/50 transition-all duration-300"
    >
      {/* Header */}
      <div className="bg-white/5 border-b border-white/20 px-6 py-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <h2 className="font-orbitron text-xl md:text-2xl font-bold text-white">
          {title}
        </h2>
      </div>
      
      {/* Body */}
      <div className="p-6 md:p-8">
        <p className="text-text-secondary font-rajdhani text-base md:text-lg leading-relaxed">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
