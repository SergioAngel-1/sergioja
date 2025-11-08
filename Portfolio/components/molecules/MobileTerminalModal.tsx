'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TerminalInit from './TerminalInit';
import TerminalHelp from './TerminalHelp';
import TerminalStatus from './TerminalStatus';
import TerminalGames from './TerminalGames';
import TerminalLanguage from './TerminalLanguage';
import { useLanguage } from '@/lib/contexts/LanguageContext';

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
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      terminalInputRef.current?.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    // Reset to main view when closing
    onViewChange('main');
    onClose();
  };

  const handleTerminalClick = () => {
    terminalInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onCommandExecute(terminalInput);
      setTerminalInput('');
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[101] md:hidden max-h-[85vh] flex flex-col"
          >
            {/* Terminal window */}
            <div className="bg-background-surface/95 backdrop-blur-md border-t border-white/30 rounded-t-2xl overflow-hidden shadow-2xl flex flex-col h-full">
              {/* Terminal header */}
              <div className="bg-background-elevated px-4 py-3 flex items-center justify-between border-b border-white/30 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyber-red" />
                    <div className="w-3 h-3 rounded-full bg-white" />
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <span className="font-mono text-xs text-text-muted">
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
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close terminal"
                >
                  <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Title Banner */}
              <div className="bg-gradient-to-r from-white/10 via-text-secondary/10 to-white/10 px-4 py-3 border-b border-white/20 flex-shrink-0">
                <h2 className="font-orbitron text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary text-center">
                  {t('terminal.interactiveExperience')}
                </h2>
              </div>

              {/* Terminal content */}
              <div 
                className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-3"
                onClick={handleTerminalClick}
              >
                {/* Render current view */}
                {currentView === 'main' && (
                  <>
                    <TerminalInit profileName={profileName} />
                    <div className="pt-3">
                      <TerminalHelp onCommandSelect={(cmd) => {
                        onCommandExecute(cmd);
                      }} />
                    </div>
                    
                    {/* Easter egg hint */}
                    <div className="pt-4 text-[10px] text-text-muted/50 italic">
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
                    className="text-white text-xs"
                  >
                    <span className="text-green-400">{'>'}</span> {matrixMessage}
                  </motion.div>
                )}

                {/* Command error */}
                {commandError && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-cyber-red text-xs"
                  >
                    <span className="text-cyber-red">{'>'}</span> {t('terminal.commandNotFound')}
                  </motion.div>
                )}

                {/* Input prompt */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-cyber-red">{'>'}</span>
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm caret-white"
                    placeholder={t('terminal.typeCommand')}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
