'use client';

import { useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import TerminalInit from '@/components/molecules/TerminalInit';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useMatrix } from '@/lib/contexts/MatrixContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import type { TerminalView } from '@/lib/hooks/useTerminal';

const TerminalHelp = dynamic(() => import('@/components/molecules/TerminalHelp'), {
  loading: () => <div className="text-text-secondary font-mono text-sm">Loading...</div>,
});
const TerminalStatus = dynamic(() => import('@/components/molecules/TerminalStatus'), {
  loading: () => <div className="text-text-secondary font-mono text-sm">Loading...</div>,
});
const TerminalGames = dynamic(() => import('@/components/molecules/TerminalGames'), {
  ssr: false,
  loading: () => <div className="text-text-secondary font-mono text-sm">Loading games...</div>,
});
const TerminalLanguage = dynamic(() => import('@/components/molecules/TerminalLanguage'), {
  loading: () => <div className="text-text-secondary font-mono text-sm">Loading...</div>,
});

const VIEW_FILE_MAP: Record<Exclude<TerminalView, 'main'>, string> = {
  help: 'help.sh',
  status: 'status.sh',
  games: 'games.sh',
  language: 'language.sh',
};

interface HomeTerminalProps {
  currentView: TerminalView;
  setCurrentView: (view: TerminalView) => void;
  terminalInput: string;
  setTerminalInput: (value: string) => void;
  commandError: boolean;
  matrixMessage: string;
  onCommand: (command: string) => void;
}

function HomeTerminalInner({
  currentView,
  setCurrentView,
  terminalInput,
  setTerminalInput,
  commandError,
  matrixMessage,
  onCommand,
}: HomeTerminalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { matrixMode } = useMatrix();
  const { lowPerformanceMode } = usePerformance();

  const handleClick = useCallback(() => inputRef.current?.focus(), []);
  const handleBack = useCallback(() => setCurrentView('main'), [setCurrentView]);

  return (
    <motion.div
      className="hidden lg:block"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="relative" onClick={handleClick}>
        {/* Terminal window */}
        <motion.div className="bg-background-surface/80 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden shadow-2xl">
          {/* Terminal header */}
          <div
            className="bg-background-elevated flex items-center border-b border-white/30"
            style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}`, gap: fluidSizing.space.sm }}
          >
            <div className="flex" style={{ gap: fluidSizing.space.sm }}>
              <div className="rounded-full bg-cyber-red" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
              <div className="rounded-full bg-white" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
              <div className="rounded-full bg-white" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
            </div>
            <span className="font-mono text-text-muted text-fluid-xs" style={{ marginLeft: fluidSizing.space.lg }}>
              ~/portfolio/terminal
              {currentView !== 'main' && (
                <span className="text-white">/{VIEW_FILE_MAP[currentView]}</span>
              )}
            </span>
          </div>

          {/* Terminal content */}
          <div
            className="font-mono text-fluid-sm"
            style={{ padding: fluidSizing.space.xl, gap: fluidSizing.space.md, display: 'flex', flexDirection: 'column' }}
          >
            {/* View router */}
            {currentView === 'main' && (
              <>
                <TerminalInit profileName={t('home.name')} />
                <div style={{ paddingTop: fluidSizing.space.md }}>
                  <TerminalHelp onCommandSelect={onCommand} />
                </div>
                <motion.div
                  className="text-text-muted/50 italic text-fluid-xs"
                  style={{ paddingTop: fluidSizing.space.lg }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <span className="text-cyber-red">#</span> {t('terminal.easterEgg')}
                </motion.div>
              </>
            )}
            {currentView === 'help' && <TerminalHelp onCommandSelect={onCommand} onBack={handleBack} />}
            {currentView === 'status' && <TerminalStatus onBack={handleBack} />}
            {currentView === 'games' && <TerminalGames onBack={handleBack} />}
            {currentView === 'language' && <TerminalLanguage onBack={handleBack} />}

            {/* Command error */}
            {commandError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-3">
                <div className="bg-cyber-red/10 border border-cyber-red/30 rounded px-3 py-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyber-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-cyber-red font-mono text-xs font-bold">{t('terminal.commandNotFound')}</div>
                      <div className="text-text-muted text-xs mt-0.5">{t('terminal.tryHelp')}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Matrix message */}
            {matrixMessage && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="pt-3 text-center">
                <div className={`font-orbitron text-sm animate-pulse ${matrixMode ? 'text-cyber-blue-cyan' : 'text-text-muted'}`}>
                  {matrixMessage}
                </div>
              </motion.div>
            )}

            {/* Input line */}
            <motion.div className="flex items-center pt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
              <span className="text-cyber-red">❯</span>
              <div className="flex-1 flex items-center ml-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onCommand(terminalInput); }}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm caret-white"
                  placeholder={t('terminal.inputPlaceholder')}
                  autoComplete="off"
                  spellCheck={false}
                />
                <motion.span className="inline-block w-2 h-4 bg-white ml-1" animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating decorative elements — respect lowPerformanceMode */}
        {!lowPerformanceMode && (
          <>
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 border-2 border-white/30 rounded-lg -z-10"
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 border-2 border-white/30 rounded-full -z-10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}

const HomeTerminal = memo(HomeTerminalInner);
export default HomeTerminal;
