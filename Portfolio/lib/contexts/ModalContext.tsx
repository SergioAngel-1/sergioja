'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import GameModal, { GameControl, ScoreDisplay } from '@/components/molecules/GameModal';

export interface GameModalConfig {
  title: string;
  content: ReactNode;
  onPause?: () => void;
  onReset?: () => void;
  isPaused?: boolean;
  isGameOver?: boolean;
  controls?: GameControl[];
  scores?: ScoreDisplay[];
  controlsStacked?: boolean;
}

interface ModalContextType {
  openGameModal: (config: GameModalConfig) => void;
  closeGameModal: () => void;
  updateGameModal: (config: Partial<GameModalConfig>) => void;
  isGameModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<GameModalConfig>({
    title: '',
    content: null,
  });

  const openGameModal = useCallback((config: GameModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
  }, []);

  const closeGameModal = useCallback(() => {
    setIsOpen(false);
    // Clear content after animation
    setTimeout(() => {
      setModalConfig({ title: '', content: null });
    }, 300);
  }, []);

  const updateGameModal = useCallback((config: Partial<GameModalConfig>) => {
    setModalConfig(prev => ({ ...prev, ...config }));
  }, []);

  const value = useMemo(
    () => ({ openGameModal, closeGameModal, updateGameModal, isGameModalOpen: isOpen }),
    [openGameModal, closeGameModal, updateGameModal, isOpen]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* Global modal portal */}
      <GameModal 
        isOpen={isOpen} 
        onClose={closeGameModal} 
        title={modalConfig.title}
        onPause={modalConfig.onPause}
        onReset={modalConfig.onReset}
        isPaused={modalConfig.isPaused}
        isGameOver={modalConfig.isGameOver}
        controls={modalConfig.controls}
        scores={modalConfig.scores}
        controlsStacked={modalConfig.controlsStacked}
      >
        {modalConfig.content}
      </GameModal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
