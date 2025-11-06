'use client';

import { motion } from 'framer-motion';
import ManagementPanel from '@/components/atoms/ManagementPanel';

interface FloatingMenuProps {
  onPortfolioClick?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function FloatingMenu({ onPortfolioClick, isOpen = false, onToggle }: FloatingMenuProps) {

  const menuItems = [
    { 
      label: 'Portfolio', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      onClick: onPortfolioClick,
      color: 'blue'
    },
    { 
      label: 'GitHub', 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      href: 'https://github.com',
      color: 'purple'
    },
    { 
      label: 'LinkedIn', 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      href: 'https://linkedin.com',
      color: 'red'
    },
    { 
      label: 'Email', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      href: 'mailto:sergiojauregui22@gmail.com',
      color: 'black'
    }
  ];

  const colorClasses = {
    blue: {
      border: 'border-cyber-blue-cyan',
      text: 'text-cyber-blue-cyan',
      bg: 'bg-cyber-blue-cyan',
      glow: 'shadow-glow-blue'
    },
    purple: {
      border: 'border-cyber-purple',
      text: 'text-cyber-purple',
      bg: 'bg-cyber-purple',
      glow: 'shadow-glow-purple'
    },
    red: {
      border: 'border-cyber-red',
      text: 'text-cyber-red',
      bg: 'bg-cyber-red',
      glow: 'shadow-glow-red'
    },
    black: {
      border: 'border-cyber-black',
      text: 'text-cyber-black',
      bg: 'bg-cyber-black',
      glow: 'shadow-glow-black'
    }
  };

  return (
    <ManagementPanel
      isOpen={isOpen}
      onClose={onToggle || (() => {})}
      title="Navegación"
      position="left"
    >
      {/* Menu Items */}
      <div className="space-y-1">
                {menuItems.map((item, index) => {
                  const colors = colorClasses[item.color as keyof typeof colorClasses];
                  
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.onClick ? (
                        <button
                          onClick={() => {
                            item.onClick?.();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-cyber-black/5 transition-all duration-200 group"
                        >
                          <div className="text-cyber-black/70 group-hover:text-cyber-black transition-all group-hover:scale-110">
                            {item.icon}
                          </div>
                          <span className="font-mono text-xs text-cyber-black/80 group-hover:text-cyber-black transition-colors">
                            {item.label}
                          </span>
                          
                          {/* Arrow indicator */}
                          <svg
                            className="w-3 h-3 ml-auto text-cyber-black/50 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-cyber-black/5 transition-all duration-200 group"
                        >
                          <div className="text-cyber-black/70 group-hover:text-cyber-black transition-all group-hover:scale-110">
                            {item.icon}
                          </div>
                          <span className="font-mono text-xs text-cyber-black/80 group-hover:text-cyber-black transition-colors">
                            {item.label}
                          </span>
                          
                          {/* External link icon */}
                          <svg
                            className="w-3 h-3 ml-auto text-cyber-black/50 opacity-0 group-hover:opacity-100 transition-all"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-cyber-black/5">
        <div className="flex items-center justify-center gap-1.5">
          <span className="font-mono text-[10px] text-cyber-black/40">SergioJA</span>
          <div className="w-0.5 h-0.5 rounded-full bg-cyber-black/30" />
          <span className="font-mono text-[10px] text-cyber-black/40">2025</span>
        </div>
      </div>
    </ManagementPanel>
  );
}
