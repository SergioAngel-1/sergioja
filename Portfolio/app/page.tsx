'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Button from '@/components/atoms/Button';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import TerminalInit from '@/components/molecules/TerminalInit';
import MatrixConfirmDialog from '@/components/molecules/MatrixConfirmDialog';
import MobileTerminalModal from '@/components/molecules/MobileTerminalModal';

// Lazy load heavy terminal components
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
import { useLogger } from '@/shared/hooks/useLogger';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useMatrix } from '@/lib/contexts/MatrixContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import DevTipsModal from '@/components/molecules/DevTipsModal';
import { alerts } from '@/shared/alertSystem';
import { api } from '@/lib/api-client';
import { getReCaptchaToken } from '@/shared/recaptchaHelpers';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';
import useProfile from '@/lib/hooks/useProfile';

type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export default function Home() {
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [terminalInput, setTerminalInput] = useState('');
  const [showDevTipsModal, setShowDevTipsModal] = useState(false);
  
  // Track scroll depth and time on page
  usePageAnalytics();
  
  // Usar hook de perfil para obtener disponibilidad
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const [currentView, setCurrentView] = useState<'main' | 'help' | 'status' | 'games' | 'language'>('main');
  const [showMatrixDialog, setShowMatrixDialog] = useState(false);
  const [matrixMessage, setMatrixMessage] = useState('');
  const [commandError, setCommandError] = useState(false);
  const [showMobileTerminal, setShowMobileTerminal] = useState(false);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const log = useLogger('Home');
  const controls = useAnimation();
  const { t, language } = useLanguage();
  const { matrixMode, setMatrixMode } = useMatrix();
  const { lowPerformanceMode } = usePerformance();

  const words = useMemo(
    () => [t('home.title'), t('home.developer'), t('home.automation'), t('home.scalability'), t('home.integration')],
    [language]
  );

  // Determinar estado de disponibilidad desde el perfil
  const availabilityStatus: AvailabilityStatus =
    profile?.availability === 'busy' || profile?.availability === 'unavailable'
      ? profile.availability
      : 'available';
  
  // Configuración de disponibilidad con colores y textos
  const availabilityConfig = useMemo(() => {
    const map: Record<AvailabilityStatus, { text: string; color: string; bgColor: string }> = {
      available: {
        text: t('home.available'),
        color: '#00F7C0',
        bgColor: 'bg-[#00F7C0]',
      },
      busy: {
        text: t('home.busy') || 'Ocupado',
        color: '#FFA500',
        bgColor: 'bg-[#FFA500]',
      },
      unavailable: {
        text: t('home.unavailable') || 'No disponible',
        color: '#FE4C4C',
        bgColor: 'bg-[#FE4C4C]',
      },
    };
    return map[availabilityStatus];
  }, [availabilityStatus, t]);

  // Register terminal handler with Header (toggle open/close)
  useEffect(() => {
    const event = new CustomEvent('register-terminal-handler', {
      detail: { handler: () => setShowMobileTerminal(prev => !prev) }
    });
    window.dispatchEvent(event);
  }, []);

  // Emit events when mobile terminal modal opens/closes
  useEffect(() => {
    if (showMobileTerminal) {
      window.dispatchEvent(new Event('terminal-modal-open'));
    } else {
      window.dispatchEvent(new Event('terminal-modal-close'));
    }
  }, [showMobileTerminal]);

  // reset typing when language changes
  useEffect(() => {
    setTypedText('');
    setCurrentWordIndex(0);
  }, [language]);

  // Handle terminal input commands
  const handleTerminalCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    // Reset error state
    setCommandError(false);
    
    if (!cmd) {
      setTerminalInput('');
      return;
    }
    
    if (cmd === 'dev' || cmd === 'dev tips') {
      setShowDevTipsModal(true);
    } else if (cmd === 'projects' || cmd === t('terminal.projects')) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('app:navigation-start'));
      }
      router.push('/projects');
    } else if (cmd === 'help' || cmd === t('terminal.help')) {
      setCurrentView('help');
    } else if (cmd === 'status' || cmd === t('terminal.status')) {
      setCurrentView('status');
    } else if (cmd === 'games' || cmd === t('terminal.games')) {
      setCurrentView('games');
    } else if (cmd === 'clear' || cmd === 'cls') {
      setCurrentView('main');
      setMatrixMessage('');
      setShowMatrixDialog(false);
    } else if (cmd === 'matrix' || cmd === 'matrix --disable') {
      // Matrix command disabled: show "coming soon" and do nothing
      setShowMatrixDialog(false);
      setMatrixMessage(t('performance.comingSoon'));
    } else if (cmd === 'language' || cmd === t('terminal.language')) {
      setCurrentView('language');
    } else {
      // Command not found
      setCommandError(true);
      setTimeout(() => setCommandError(false), 3000);
    }
    setTerminalInput('');
  };

  // Handle matrix mode activation
  const handleMatrixConfirm = () => {
    setShowMatrixDialog(false);
    const newMatrixMode = !matrixMode;
    setMatrixMode(newMatrixMode);
    setMatrixMessage(newMatrixMode ? t('matrix.activated') : t('matrix.deactivated'));
    // Message stays permanently, no timeout
  };

  const handleMatrixCancel = () => {
    setShowMatrixDialog(false);
  };

  // Clear 'coming soon' message when changing terminal views
  useEffect(() => {
    if (matrixMessage === t('performance.comingSoon')) {
      setMatrixMessage('');
      setShowMatrixDialog(false);
    }
  }, [currentView, matrixMessage, t]);

  // Focus terminal input when clicking on terminal
  const handleTerminalClick = () => {
    terminalInputRef.current?.focus();
  };

  // Typing animation effect
  useEffect(() => {
    const word = words[currentWordIndex] || '';
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      if (!isDeleting) {
        setTypedText(word.substring(0, currentIndex + 1));
        currentIndex++;
        if (currentIndex === word.length) {
          isDeleting = true;
          timeoutId = setTimeout(type, 800); // Pause at end
        } else {
          timeoutId = setTimeout(type, 120);
        }
      } else {
        setTypedText(word.substring(0, Math.max(0, currentIndex - 1)));
        currentIndex--;
        if (currentIndex <= 0) {
          isDeleting = false;
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        } else {
          timeoutId = setTimeout(type, 120);
        }
      }
    };

    timeoutId = setTimeout(type, 120);

    return () => clearTimeout(timeoutId);
  }, [currentWordIndex, words]);

  const handleDevTipsSubmit = async (email: string) => {
    try {
      const recaptchaToken = await getReCaptchaToken(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
        'subscribe_newsletter'
      );

      const response = await api.subscribeNewsletter({
        email,
        recaptchaToken: recaptchaToken || undefined,
        recaptchaAction: 'subscribe_newsletter',
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to subscribe');
      }

      log.info('Email subscribed:', email);
      setMatrixMessage(t('devTips.success'));
      alerts.success(t('alerts.success'), t('devTips.success'), 6000);
      if (typeof window !== 'undefined') {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: 'newsletter_subscribe',
          source: 'portfolio',
          form_name: 'dev_tips_modal',
          page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        });
      }
    } catch (error) {
      log.error('Error subscribing email:', error);
      alerts.error(t('alerts.sendError'), t('devTips.submitError'), 6000);
      throw error;
    }
  };

  return (
    <>
      {/* Dev Tips Modal */}
      <DevTipsModal
        isOpen={showDevTipsModal}
        onClose={() => setShowDevTipsModal(false)}
        onSubmit={handleDevTipsSubmit}
      />

      {/* Matrix Confirmation Dialog */}
      <MatrixConfirmDialog 
        isOpen={showMatrixDialog}
        onConfirm={handleMatrixConfirm}
        onCancel={handleMatrixCancel}
      />

      {/* Mobile Terminal Modal */}
      <MobileTerminalModal
        isOpen={showMobileTerminal}
        onClose={() => setShowMobileTerminal(false)}
        profileName={t('home.name')}
        currentView={currentView}
        onViewChange={setCurrentView}
        onCommandExecute={handleTerminalCommand}
        commandError={commandError}
        matrixMessage={matrixMessage}
      />

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset" style={{ paddingTop: `calc(${fluidSizing.header.height} - env(safe-area-inset-top, 0px))` }}>
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-15" />

      {/* Animated glow effects - Sutiles y uniformes */}
      <GlowEffect
        color="white"
        size="xl"
        position={{ top: '30%', right: '20%' }}
        opacity={0.15}
        blur="lg"
        animationType="pulse"
        duration={4}
      />

      <GlowEffect
        color="white"
        size="lg"
        position={{ bottom: '30%', left: '20%' }}
        opacity={0.1}
        blur="lg"
        animationType="pulse"
        duration={5}
        delay={1}
      />

      {/* Floating particles - Reducidas en móvil */}
      <FloatingParticles count={15} color="bg-white" className="hidden md:block" />
      <FloatingParticles count={8} color="bg-white" className="md:hidden" />

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={
          {
            background:
              'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
            backgroundSize: '100% 4px',
          }
        }
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: '1600px', padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}` }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 'clamp(2rem, 4vw, 6rem)' }}>
          {/* Left side - Main content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title with glitch effect */}
            <motion.h1
              className="font-orbitron font-black mb-fluid-md relative leading-tight"
              style={{ fontSize: fluidSizing.text['6xl'] }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="relative inline-block" style={{ color: 'transparent', WebkitTextStroke: '2px white' }}>
                {t('home.firstName')}
                <motion.span
                  className="absolute inset-0"
                  style={{ color: 'transparent', WebkitTextStroke: '2px black' } as any}
                  animate={
                    {
                      x: [0, -5, 5, -3, 3, 0],
                      y: [0, 2, -2, 1, -1, 0],
                      opacity: [0, 0.8, 0.8, 0.6, 0.6, 0],
                    }
                  }
                  transition={
                    {
                      duration: 0.4,
                      repeat: Infinity,
                      repeatDelay: 4,
                    }
                  }
                >
                  {t('home.firstName')}
                </motion.span>
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-secondary to-white animate-gradient relative inline-block" style={{ WebkitTextStroke: '1px white' }}>
                {t('home.lastName')}
              </span>
            </motion.h1>

            {/* Animated subtitle with typing effect */}
            <motion.div
              className="font-orbitron text-text-secondary mb-fluid-md tracking-wider flex items-center"
              style={{ fontSize: fluidSizing.text['2xl'], height: fluidSizing.size.buttonLg }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="text-cyber-red" style={{ marginRight: fluidSizing.space.sm }}>{'>'}</span>
              <span className="text-white truncate">{typedText}</span>
              <motion.span
                className="inline-block bg-white flex-shrink-0"
                style={{ 
                  width: fluidSizing.space.xs, 
                  height: fluidSizing.text['2xl'],
                  marginLeft: fluidSizing.space.xs
                }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="font-rajdhani text-text-secondary mb-fluid-xl max-w-xl leading-relaxed text-fluid-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {t('home.tagline')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row mb-fluid-xl"
              style={{ gap: fluidSizing.space.md }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link href="/projects" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black">
                    <span className="flex items-center justify-center gap-2">
                      {t('home.viewProjects')}
                      <svg
                        className="size-icon-md"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white text-black border-white hover:bg-transparent hover:text-white">
                    {t('home.contact')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Status indicator - Dinámico desde API */}
            <motion.div
              className="flex items-center gap-fluid-sm justify-center sm:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="relative">
                <div 
                  className="rounded-full animate-pulse" 
                  style={{ 
                    width: fluidSizing.space.md, 
                    height: fluidSizing.space.md,
                    backgroundColor: availabilityConfig.color,
                    boxShadow: `0 0 12px ${availabilityConfig.color}`,
                  }} 
                />
                <motion.div 
                  className="absolute inset-0 rounded-full" 
                  style={{ 
                    width: fluidSizing.space.md, 
                    height: fluidSizing.space.md,
                    backgroundColor: availabilityConfig.color,
                  }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-text-secondary font-rajdhani text-fluid-sm">
                {availabilityConfig.text}
              </span>
            </motion.div>

            {/* Focus areas */}
            <motion.div
              className="mb-6 lg:mb-0 relative"
              style={{ 
                marginTop: fluidSizing.space['2xl'],
                paddingTop: fluidSizing.space.xl
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {/* Animated gradient separator */}
              <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-white via-text-secondary to-white"
                  animate={lowPerformanceMode ? {} : {
                    x: ['-100%', '100%'],
                  }}
                  transition={lowPerformanceMode ? {} : {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ width: '200%' }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-fluid-sm">
                <span className="font-orbitron font-bold text-white text-fluid-base">
                  {t('home.focus')}:
                </span>
                {[
                  { key: 'focusTechShort' },
                  { key: 'focusStrategicShort' },
                  { key: 'focusHumanShort' },
                ].map((focus, index) => (
                  <motion.div
                    key={focus.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
                    className="flex items-center gap-fluid-sm"
                  >
                    {index > 0 && (
                      <svg className="size-icon-sm text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    <span className="font-rajdhani font-semibold text-text-secondary uppercase tracking-wide text-fluid-xs">
                      {t(`home.${focus.key}`)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Terminal/Code preview */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative" onClick={handleTerminalClick}>
              {/* Terminal window */}
              <motion.div 
                className="bg-background-surface/80 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden shadow-2xl"
              >
                {/* Terminal header */}
                <div className="bg-background-elevated flex items-center border-b border-white/30" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}`, gap: fluidSizing.space.sm }}>
                  <div className="flex" style={{ gap: fluidSizing.space.sm }}>
                    <div className="rounded-full bg-cyber-red" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
                    <div className="rounded-full bg-white" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
                    <div className="rounded-full bg-white" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
                  </div>
                  <span className="font-mono text-text-muted text-fluid-xs" style={{ marginLeft: fluidSizing.space.lg }}>
                    ~/portfolio/terminal
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

                {/* Terminal content */}
                <div className="font-mono text-fluid-sm" style={{ padding: fluidSizing.space.xl, gap: fluidSizing.space.md, display: 'flex', flexDirection: 'column' }}>
                  {/* Render current view */}
                  {currentView === 'main' && (
                    <>
                      <TerminalInit profileName={t('home.name')} />
                      <div style={{ paddingTop: fluidSizing.space.md }}>
                        <TerminalHelp onCommandSelect={(cmd) => handleTerminalCommand(cmd)} />
                      </div>
                      <motion.div className="text-text-muted/50 italic text-fluid-xs" style={{ paddingTop: fluidSizing.space.lg }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                        <span className="text-cyber-red">#</span> {t('terminal.easterEgg')}
                      </motion.div>
                    </>
                  )}

                  {currentView === 'help' && (
                    <TerminalHelp 
                      onCommandSelect={(cmd) => handleTerminalCommand(cmd)} 
                      onBack={() => setCurrentView('main')} 
                    />
                  )}

                  {currentView === 'status' && (
                    <TerminalStatus onBack={() => setCurrentView('main')} />
                  )}

                  {currentView === 'games' && (
                    <TerminalGames onBack={() => setCurrentView('main')} />
                  )}

                  {currentView === 'language' && (
                    <TerminalLanguage onBack={() => setCurrentView('main')} />
                  )}


                  {/* Command error message */}
                  {commandError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="pt-3"
                    >
                      <div className="bg-cyber-red/10 border border-cyber-red/30 rounded px-3 py-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-cyber-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-cyber-red font-mono text-xs font-bold">
                              {t('terminal.commandNotFound')}
                            </div>
                            <div className="text-text-muted text-xs mt-0.5">
                              {t('terminal.tryHelp')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Matrix mode message */}
                  {matrixMessage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="pt-3 text-center"
                    >
                      <div className={`font-orbitron text-sm animate-pulse ${
                        matrixMode ? 'text-cyber-blue-cyan' : 'text-text-muted'
                      }`}>
                        {matrixMessage}
                      </div>
                    </motion.div>
                  )}

                  {/* Interactive input line */}
                  <motion.div className="flex items-center pt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
                    <span className="text-cyber-red">❯</span>
                    <div className="flex-1 flex items-center ml-2">
                      <input
                        ref={terminalInputRef}
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleTerminalCommand(terminalInput);
                          }
                        }}
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

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 border-2 border-white/30 rounded-lg -z-10"
                animate={
                  {
                    rotate: [0, 90, 180, 270, 360],
                  }
                }
                transition={
                  {
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }
                }
              />

              <motion.div
                className="absolute -bottom-6 -left-6 w-16 h-16 border-2 border-white/30 rounded-full -z-10"
                animate={
                  {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }
                }
                transition={
                  {
                    duration: 3,
                    repeat: Infinity,
                  }
                }
              />
            </div>
          </motion.div>
        </div>
      </div>

    </div>
    </>
  );
}
