import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useMatrix } from '@/lib/contexts/MatrixContext';

export type TerminalView = 'main' | 'help' | 'status' | 'games' | 'language';

export interface UseTerminalReturn {
  currentView: TerminalView;
  setCurrentView: (view: TerminalView) => void;
  terminalInput: string;
  setTerminalInput: (value: string) => void;
  commandError: boolean;
  matrixMessage: string;
  showMatrixDialog: boolean;
  showMobileTerminal: boolean;
  setShowMobileTerminal: (value: boolean | ((prev: boolean) => boolean)) => void;
  showDevTipsModal: boolean;
  setShowDevTipsModal: (value: boolean) => void;
  handleTerminalCommand: (command: string) => void;
  handleMatrixConfirm: () => void;
  handleMatrixCancel: () => void;
}

/**
 * Encapsulates all terminal state and command handling logic.
 */
export function useTerminal(): UseTerminalReturn {
  const [currentView, setCurrentView] = useState<TerminalView>('main');
  const [terminalInput, setTerminalInput] = useState('');
  const [commandError, setCommandError] = useState(false);
  const [matrixMessage, setMatrixMessage] = useState('');
  const [showMatrixDialog, setShowMatrixDialog] = useState(false);
  const [showMobileTerminal, setShowMobileTerminal] = useState(false);
  const [showDevTipsModal, setShowDevTipsModal] = useState(false);

  const router = useRouter();
  const { t } = useLanguage();
  const { matrixMode, setMatrixMode } = useMatrix();

  // Register terminal handler with Header (toggle open/close)
  useEffect(() => {
    const event = new CustomEvent('register-terminal-handler', {
      detail: { handler: () => setShowMobileTerminal(prev => !prev) },
    });
    window.dispatchEvent(event);
  }, []);

  // Emit events when mobile terminal modal opens/closes
  useEffect(() => {
    window.dispatchEvent(
      new Event(showMobileTerminal ? 'terminal-modal-open' : 'terminal-modal-close')
    );
  }, [showMobileTerminal]);

  // Clear 'coming soon' message when changing terminal views
  useEffect(() => {
    if (matrixMessage === t('performance.comingSoon')) {
      setMatrixMessage('');
      setShowMatrixDialog(false);
    }
  }, [currentView, matrixMessage, t]);

  const handleTerminalCommand = useCallback(
    (command: string) => {
      const cmd = command.toLowerCase().trim();
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
        setShowMatrixDialog(false);
        setMatrixMessage(t('performance.comingSoon'));
      } else if (cmd === 'language' || cmd === t('terminal.language')) {
        setCurrentView('language');
      } else {
        setCommandError(true);
        setTimeout(() => setCommandError(false), 3000);
      }
      setTerminalInput('');
    },
    [t, router]
  );

  const handleMatrixConfirm = useCallback(() => {
    setShowMatrixDialog(false);
    const next = !matrixMode;
    setMatrixMode(next);
    setMatrixMessage(next ? t('matrix.activated') : t('matrix.deactivated'));
  }, [matrixMode, setMatrixMode, t]);

  const handleMatrixCancel = useCallback(() => {
    setShowMatrixDialog(false);
  }, []);

  return {
    currentView,
    setCurrentView,
    terminalInput,
    setTerminalInput,
    commandError,
    matrixMessage,
    showMatrixDialog,
    showMobileTerminal,
    setShowMobileTerminal,
    showDevTipsModal,
    setShowDevTipsModal,
    handleTerminalCommand,
    handleMatrixConfirm,
    handleMatrixCancel,
  };
}
