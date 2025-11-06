'use client';

import { motion } from 'framer-motion';
import InfoPanel from '@/components/atoms/InfoPanel';
import { GridPosition } from '@/lib/gridSystem';

interface ServicesCardProps {
  isOpen: boolean;
  onClose: () => void;
  gridPosition?: GridPosition;
}

export default function ServicesCard({ isOpen, onClose, gridPosition }: ServicesCardProps) {
  const services = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Desarrollo Web',
      stack: 'React, Next.js, Node.js',
      color: 'cyber-purple'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: 'UI/UX Design',
      stack: 'Figma, Design Systems',
      color: 'cyber-blue-cyan'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Consultoría Tech',
      stack: 'Arquitectura, Optimización',
      color: 'cyber-red'
    }
  ];

  return (
    <InfoPanel
      isOpen={isOpen}
      onClose={onClose}
      title="SERVICIOS"
      subtitle="Soluciones Digitales"
      status="active"
      gridPosition={gridPosition}
      containerClassName="!bg-gradient-to-br from-cyber-purple/10 via-white/95 to-cyber-blue-cyan/5 border-cyber-purple/30"
    >
      <div className="space-y-2">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            className={`group relative px-3 py-2.5 rounded-lg border border-${service.color}/20 bg-${service.color}/5 hover:bg-${service.color}/10 transition-all duration-300 overflow-hidden`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
          >
            {/* Animated background */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r from-${service.color}/0 via-${service.color}/10 to-${service.color}/0`}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />

            <div className="relative flex items-start gap-3">
              {/* Icon */}
              <motion.div 
                className={`flex-shrink-0 p-2 rounded-md bg-${service.color}/10 text-${service.color}`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {service.icon}
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-orbitron text-xs font-bold text-cyber-black/90 mb-0.5">
                  {service.title}
                </h3>
                <p className="text-[10px] text-cyber-black/60 font-mono">
                  {service.stack}
                </p>
              </div>

              {/* Arrow indicator */}
              <motion.svg
                className={`w-4 h-4 text-${service.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </div>

            {/* Corner accent */}
            <div className={`absolute top-0 right-0 w-8 h-8 border-t border-r border-${service.color}/30 rounded-tr-lg`} />
          </motion.div>
        ))}

        {/* CTA Button */}
        <motion.button
          className="w-full mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-blue-cyan text-white font-orbitron text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(139, 0, 255, 0.5)' }}
          whileTap={{ scale: 0.98 }}
        >
          Ver Más Servicios
        </motion.button>
      </div>
    </InfoPanel>
  );
}
