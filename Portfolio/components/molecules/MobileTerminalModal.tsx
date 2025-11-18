'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TerminalInit from './TerminalInit';
import TerminalHelp from './TerminalHelp';
import TerminalStatus from './TerminalStatus';
import TerminalGames from './TerminalGames';
import TerminalLanguage from './TerminalLanguage';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface MobileTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName?: string;
  currentView: 'main' | 'help' | 'status' | 'games' | 'language';
  onViewChange: (view: 'main' | 'help' | 'status' | 'games' | 'language') => void;
  onCommandExecute: (command: string) => void;
  commandError: boolean;
  matrixMessage: string;
}

export default function MobileTerminalModal({
  isOpen,
  onClose,
  profileName,
  currentView,
  onViewChange,
  onCommandExecute,
  commandError,
  matrixMessage,
}: MobileTerminalModalProps) {
  const [terminalInput, setTerminalInput] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Detect keyboard visibility - iOS compatible
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      // Use visualViewport API for better iOS support
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        // Keyboard is open if viewport is significantly smaller than window
        const isKeyboardOpen = viewportHeight < windowHeight * 0.75;
        setKeyboardVisible(isKeyboardOpen);
      } else {
        // Fallback for browsers without visualViewport
        const isKeyboardOpen = window.innerHeight < window.screen.height * 0.75;
        setKeyboardVisible(isKeyboardOpen);
      }
    };

    // Listen to both resize and visualViewport events
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Prevent body scroll on iOS when modal opens
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll on iOS
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // NO auto-focus to prevent keyboard from opening automatically
    } else {
      // Restore body scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      
      setKeyboardVisible(false);
    }

    return () => {
      // Cleanup on unmount
      if (isOpen) {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    // Reset to main view when closing
    onViewChange('main');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onCommandExecute(terminalInput);
      setTerminalInput('');
      // Hide keyboard after sending command
      terminalInputRef.current?.blur();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-[100] md:hidden"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ y: '100%' }}
            animate={{ y: keyboardVisible ? '-10%' : 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed inset-x-0 bottom-0 z-[101] md:hidden flex flex-col ${keyboardVisible ? 'max-h-50-viewport' : 'max-h-85-viewport'}`}
            style={{ 
              paddingBottom: 'env(safe-area-inset-bottom)',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Terminal window */}
            <div className="bg-background-surface/95 backdrop-blur-md border-t border-white/30 rounded-t-2xl overflow-hidden shadow-2xl flex flex-col h-full">
              {/* Terminal header */}
              <div className="bg-background-elevated flex items-center justify-between border-b border-white/30 flex-shrink-0" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.md}` }}>
                <div className="flex items-center" style={{ gap: fluidSizing.space.md }}>
                  <div className="flex" style={{ gap: fluidSizing.space.sm }}>
                    <div className="rounded-full bg-cyber-red" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
                    <div className="rounded-full bg-white" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
                    <div className="rounded-full bg-white" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
                  </div>
                  <span className="font-mono text-text-muted text-fluid-xs">
                    ~/terminal
                    {currentView !== 'main' && (
                      <span className="text-white">
                        /{currentView === 'help' ? 'help.sh' : 
                          currentView === 'status' ? 'status.sh' : 
                          currentView === 'games' ? 'games.sh' : 
                          currentView === 'language' ? 'language.sh' : ''}
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg hover:bg-white/10 transition-colors"
                  style={{ padding: fluidSizing.space.xs }}
                  aria-label="Close terminal"
                >
                  <svg className="size-icon-md text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Title Banner */}
              <div className="bg-gradient-to-r from-white/10 via-text-secondary/10 to-white/10 border-b border-white/20 flex-shrink-0" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.md}` }}>
                <h2 className="font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary text-center text-fluid-sm">
                  {t('terminal.interactiveExperience')}
                </h2>
              </div>

              {/* Terminal content */}
              <div 
                className="flex-1 overflow-y-auto font-mono text-fluid-sm"
                style={{ 
                  padding: fluidSizing.space.md, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: fluidSizing.space.md,
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                }}
              >
                {/* Render current view */}
                {currentView === 'main' && (
                  <>
                    <TerminalInit profileName={profileName} />
                    <div style={{ paddingTop: fluidSizing.space.md }}>
                      <TerminalHelp onCommandSelect={(cmd) => {
                        onCommandExecute(cmd);
                      }} />
                    </div>
                    
                    {/* Easter egg hint */}
                    <div className="text-text-muted/50 italic text-fluid-xs" style={{ paddingTop: fluidSizing.space.md }}>
                      {t('terminal.easterEggHint')}
                    </div>
                  </>
                )}

                {currentView === 'help' && (
                  <TerminalHelp onCommandSelect={(cmd) => {
                    onCommandExecute(cmd);
                  }} />
                )}

                {currentView === 'status' && <TerminalStatus onBack={() => onViewChange('main')} />}

                {currentView === 'games' && (
                  <TerminalGames 
                    onBack={() => onViewChange('main')} 
                    onGameOpen={handleClose}
                  />
                )}

                {currentView === 'language' && <TerminalLanguage onBack={() => onViewChange('main')} />}

                {/* Matrix message */}
                {matrixMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-fluid-xs"
                  >
                    <span className="text-green-400">{'>'}</span> {matrixMessage}
                  </motion.div>
                )}

                {/* Command error */}
                {commandError && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-cyber-red text-fluid-xs"
                  >
                    <span className="text-cyber-red">{'>'}</span> {t('terminal.commandNotFound')}
                  </motion.div>
                )}

                {/* Input prompt - Only show in main and help views */}
                {(currentView === 'main' || currentView === 'help') && (
                  <div className="flex items-center" style={{ gap: fluidSizing.space.sm, paddingTop: fluidSizing.space.sm }}>
                    <span className="text-cyber-red">{'>'}</span>
                    <input
                      ref={terminalInputRef}
                      type="text"
                      inputMode="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={(e) => {
                        // Scroll input into view on iOS
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 300);
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-white font-mono caret-white text-fluid-sm placeholder:text-xs"
                      placeholder={t('terminal.typeCommand')}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      style={{ 
                        fontSize: '16px',
                        WebkitAppearance: 'none',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
