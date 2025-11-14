'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

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
            <div className="flex items-center justify-between border-b border-white/30 bg-background-elevated" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
              <div className="flex items-center" style={{ gap: fluidSizing.space.md }}>
                <div className="flex" style={{ gap: fluidSizing.space.xs }}>
                  <div 
                    className="rounded-full bg-cyber-red cursor-pointer hover:opacity-80 transition-opacity" 
                    style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }}
                    onClick={onClose}
                    title={t('common.close')}
                  />
                  <div className="rounded-full bg-white" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
                  <div className="rounded-full bg-white" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
                </div>
                <span className="font-mono text-text-muted truncate text-fluid-sm">~/games/{title}</span>
              </div>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-cyber-red transition-colors"
                aria-label={t('common.close')}
              >
                <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: fluidSizing.space.lg, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
              {/* Game controls and scores */}
              {(onPause || onReset || scores.length > 0) && (
                <div className="flex items-center w-full" style={{ gap: fluidSizing.space.md }}>
                  <div className={controlsStacked ? 'flex items-start justify-start flex-col' : 'flex items-center justify-center lg:justify-start'} style={{ gap: fluidSizing.space.sm }}>
                    {onPause && (
                      <button
                        onClick={onPause}
                        className="rounded border border-text-secondary/50 text-text-secondary hover:bg-text-secondary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ padding: fluidSizing.space.sm }}
                        disabled={isGameOver}
                        title={isPaused ? t('snake.resume') : t('snake.pause')}
                      >
                        {isPaused ? (
                          <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                    )}
                    {onReset && (
                      <button
                        onClick={onReset}
                        className="rounded border border-white/50 text-white hover:bg-white/10 transition-all duration-300"
                        style={{ padding: fluidSizing.space.sm }}
                        title={t('snake.reset')}
                      >
                        <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Scores */}
                  {scores.length > 0 && (
                    <div className="grid grid-cols-2 lg:flex lg:items-center ml-auto" style={{ gap: fluidSizing.space.sm }}>
                      {scores.map((score, index) => (
                        <div key={index} className="flex items-center bg-background-dark/50 rounded border border-white/10" style={{ gap: fluidSizing.space.sm, padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}` }}>
                          <span className="text-text-muted font-mono uppercase text-fluid-xs">{score.label}</span>
                          <span className={`font-bold font-orbitron text-fluid-lg ${score.color || 'text-cyber-blue-cyan'}`}>
                            {score.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Game content and controls side by side */}
              <div className="flex flex-col lg:flex-row items-start" style={{ gap: fluidSizing.space.lg }}>
                {/* Game content */}
                <div className="w-full lg:flex-1">
                  {children}
                </div>

                {/* Controls guide - vertical */}
                {controls.length > 0 && (
                  <div className="w-full lg:w-48 flex-shrink-0 bg-background-elevated border border-white/20 rounded-lg" style={{ padding: fluidSizing.space.md }}>
                    <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.md }}>
                      <svg className="size-icon-sm text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-orbitron font-bold text-white text-fluid-xs">{t('snake.controlsTitle')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1" style={{ gap: fluidSizing.space.sm }}>
                      {controls.map((control, index) => (
                        <div 
                          key={index}
                          className={`flex items-start bg-background-dark/50 rounded border ${
                            control.color === 'cyan' ? 'border-white/10' :
                            control.color === 'purple' ? 'border-text-secondary/10' :
                            'border-cyber-red/10'
                          }`}
                          style={{ gap: fluidSizing.space.sm, padding: fluidSizing.space.sm }}
                        >
                          <div className={`flex-shrink-0 ${
                            control.color === 'cyan' ? 'text-white' :
                            control.color === 'purple' ? 'text-text-secondary' :
                            'text-cyber-red'
                          }`}>
                            {control.icon}
                          </div>
                          <span className="text-text-secondary leading-relaxed text-fluid-xs">{control.label}</span>
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
