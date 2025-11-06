'use client';

import { motion } from 'framer-motion';
import InfoPanel from '@/components/atoms/InfoPanel';
import { GridPosition } from '@/lib/gridSystem';

interface ContactCardProps {
  isOpen: boolean;
  onClose: () => void;
  gridPosition?: GridPosition;
}

export default function ContactCard({ isOpen, onClose, gridPosition }: ContactCardProps) {
  const contacts = [
    {
      label: 'Email',
      value: 'sergiojauregui22@gmail.com',
      href: 'mailto:sergiojauregui22@gmail.com',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'cyber-red'
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/sergioja',
      href: 'https://linkedin.com/in/sergioja',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: 'cyber-blue-cyan'
    },
    {
      label: 'GitHub',
      value: 'github.com/sergioja',
      href: 'https://github.com/sergioja',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      color: 'cyber-purple'
    }
  ];

  return (
    <InfoPanel
      isOpen={isOpen}
      onClose={onClose}
      title="CONTACTO"
      subtitle="Conectemos"
      status="standby"
      gridPosition={gridPosition}
      containerClassName="!bg-gradient-to-br from-white/95 via-cyber-black/5 to-cyber-black/10 border-cyber-black/30"
    >
      <div className="space-y-2">
        {/* Contact methods */}
        {contacts.map((contact, index) => (
          <motion.a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith('http') ? '_blank' : undefined}
            rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-${contact.color}/20 bg-${contact.color}/5 hover:bg-${contact.color}/10 transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            <motion.div 
              className={`flex-shrink-0 p-2 rounded-md bg-${contact.color}/10 text-${contact.color}`}
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {contact.icon}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-orbitron text-xs font-bold text-cyber-black/90 mb-0.5">
                {contact.label}
              </div>
              <div className="text-[10px] text-cyber-black/60 font-mono truncate">
                {contact.value}
              </div>
            </div>

            {/* Arrow */}
            <motion.svg
              className={`w-4 h-4 text-${contact.color} opacity-0 group-hover:opacity-100 transition-opacity`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </motion.a>
        ))}

        {/* Quick response badge */}
        <motion.div
          className="mt-3 px-3 py-2 rounded-lg bg-gradient-to-r from-cyber-black/5 to-cyber-black/10 border border-cyber-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-cyber-blue-cyan"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[10px] text-cyber-black/70 font-mono">Respuesta rápida</span>
            </div>
            <span className="text-[10px] text-cyber-black/50 font-mono">{'< 24h'}</span>
          </div>
        </motion.div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-cyber-black/10">
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="font-orbitron text-sm font-black text-cyber-black">50+</div>
            <div className="text-[8px] text-cyber-black/50 uppercase tracking-wide">Proyectos</div>
          </motion.div>
          <div className="w-px h-8 bg-cyber-black/20" />
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="font-orbitron text-sm font-black text-cyber-black">98%</div>
            <div className="text-[8px] text-cyber-black/50 uppercase tracking-wide">Satisfacción</div>
          </motion.div>
        </div>
      </div>
    </InfoPanel>
  );
}
