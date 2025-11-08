'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export interface GameControl {
  icon: ReactNode;
  label: string;
  color: 'cyan' | 'purple' | 'red';
}

export interface ScoreDisplay {
  label: string;
  value: number | string;
  color?: string;
}

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPause?: () => void;
  onReset?: () => void;
  title: string;
  isPaused?: boolean;
  isGameOver?: boolean;
  children: ReactNode;
  controls?: GameControl[];
  scores?: ScoreDisplay[];
  controlsStacked?: boolean;
}

export default function GameModal({ 
  isOpen, 
  onClose, 
  onPause,
  onReset,
  title, 
  isPaused = false,
  isGameOver = false,
  children,
  controls = [],
  scores = [],
  controlsStacked = false
}: GameModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/90 backdrop-blur-sm p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background-surface border-2 border-white/50 rounded-lg shadow-2xl w-full sm:w-auto max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-white/30 bg-background-elevated">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-full bg-cyber-red cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={onClose}
                    title="Close"
                  />
                  <div className="w-3 h-3 rounded-full bg-white" />
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
                <span className="font-mono text-xs sm:text-sm text-text-muted truncate">~/games/{title}</span>
              </div>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-cyber-red transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              {/* Game controls and scores */}
              {(onPause || onReset || scores.length > 0) && (
                <div className="flex items-center gap-3 w-full">
                  <div className={controlsStacked ? 'flex items-start justify-start flex-col gap-2' : 'flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2'}>
                    {onPause && (
                      <button
                        onClick={onPause}
                        className="p-2 sm:p-3 rounded border border-text-secondary/50 text-text-secondary hover:bg-text-secondary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isGameOver}
                        title={isPaused ? t('snake.resume') : t('snake.pause')}
                      >
                        {isPaused ? (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                    )}
                    {onReset && (
                      <button
                        onClick={onReset}
                        className="p-2 sm:p-3 rounded border border-white/50 text-white hover:bg-white/10 transition-all duration-300"
                        title={t('snake.reset')}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Scores */}
                  {scores.length > 0 && (
                    <div className="grid grid-cols-2 lg:flex lg:items-center gap-1.5 sm:gap-2 ml-auto">
                      {scores.map((score, index) => (
                        <div key={index} className="flex items-center gap-1.5 sm:gap-2 bg-background-dark/50 rounded px-2 sm:px-2.5 py-1 sm:py-1.5 border border-white/10">
                          <span className="text-[10px] sm:text-xs text-text-muted font-mono uppercase">{score.label}</span>
                          <span className={`text-sm sm:text-lg font-bold font-orbitron ${score.color || 'text-cyber-blue-cyan'}`}>
                            {score.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Game content and controls side by side */}
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-6 items-start">
                {/* Game content */}
                <div className="w-full lg:flex-1">
                  {children}
                </div>

                {/* Controls guide - vertical */}
                {controls.length > 0 && (
                  <div className="w-full lg:w-48 flex-shrink-0 bg-background-elevated border border-white/20 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-orbitron text-[10px] sm:text-xs font-bold text-white">{t('snake.controlsTitle')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-2">
                      {controls.map((control, index) => (
                        <div 
                          key={index}
                          className={`flex items-start gap-2 bg-background-dark/50 rounded p-2 border ${
                            control.color === 'cyan' ? 'border-white/10' :
                            control.color === 'purple' ? 'border-text-secondary/10' :
                            'border-cyber-red/10'
                          }`}
                        >
                          <div className={`flex-shrink-0 mt-0.5 ${
                            control.color === 'cyan' ? 'text-white' :
                            control.color === 'purple' ? 'text-text-secondary' :
                            'text-cyber-red'
                          }`}>
                            {control.icon}
                          </div>
                          <span className="text-[10px] sm:text-xs text-text-secondary leading-relaxed">{control.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
