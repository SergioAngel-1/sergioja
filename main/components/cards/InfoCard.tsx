'use client';

import { motion } from 'framer-motion';
import InfoPanel from '@/components/atoms/InfoPanel';
import { GridPosition } from '@/lib/gridSystem';

interface InfoCardProps {
  isOpen: boolean;
  onClose: () => void;
  gridPosition?: GridPosition;
}

export default function InfoCard({ isOpen, onClose, gridPosition }: InfoCardProps) {
  return (
    <InfoPanel
      isOpen={isOpen}
      onClose={onClose}
      title="SERGIO JA"
      subtitle="Centro de Marca Personal"
      status="active"
      gridPosition={gridPosition}
      containerClassName="!bg-gradient-to-br from-cyber-blue-cyan/10 via-white/95 to-white/90 border-cyber-blue-cyan/30"
    >
      <div className="space-y-2">
        {/* Profile image placeholder */}
        <div className="flex justify-center mb-3">
          <motion.div 
            className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-blue-cyan to-cyber-purple flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="font-orbitron text-2xl font-black text-white">SJ</span>
          </motion.div>
        </div>

        {/* Info rows */}
        <div className="space-y-1.5">
          <motion.div 
            className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-cyber-blue-cyan/5 transition-colors"
            whileHover={{ x: 2 }}
          >
            <span className="text-cyber-black/50 text-xs flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Role
            </span>
            <span className="text-cyber-black/80 text-xs font-medium">Full Stack Developer</span>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-cyber-blue-cyan/5 transition-colors"
            whileHover={{ x: 2 }}
          >
            <span className="text-cyber-black/50 text-xs flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status
            </span>
            <span className="text-cyber-blue-cyan text-xs font-medium flex items-center gap-1">
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-cyber-blue-cyan"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Available
            </span>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-cyber-blue-cyan/5 transition-colors"
            whileHover={{ x: 2 }}
          >
            <span className="text-cyber-black/50 text-xs flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </span>
            <span className="text-cyber-black/80 text-xs font-medium">Remote</span>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-cyber-blue-cyan/5 transition-colors"
            whileHover={{ x: 2 }}
          >
            <span className="text-cyber-black/50 text-xs flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Experience
            </span>
            <span className="text-cyber-black/80 text-xs font-medium">5+ years</span>
          </motion.div>
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-1 pt-2 border-t border-cyber-blue-cyan/10">
          {['React', 'Node.js', 'TypeScript'].map((tech, i) => (
            <motion.span
              key={tech}
              className="px-2 py-0.5 rounded-full bg-cyber-blue-cyan/10 text-cyber-blue-cyan text-[9px] font-mono font-medium"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 191, 255, 0.2)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </InfoPanel>
  );
}
