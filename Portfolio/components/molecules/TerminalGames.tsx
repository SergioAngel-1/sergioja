'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import GameButton from './GameButton';
import SnakeGame from './SnakeGame';
import TetrisGame from './TetrisGame';
import TerminalBackButton from '@/components/atoms/TerminalBackButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useModal } from '@/lib/contexts/ModalContext';

interface TerminalGamesProps {
  onBack: () => void;
  onGameOpen?: () => void;
}

export default function TerminalGames({ onBack, onGameOpen }: TerminalGamesProps) {
  const { t } = useLanguage();
  const { closeGameModal, updateGameModal, isGameModalOpen } = useModal();
  const [isMobile, setIsMobile] = useState(false);
  const [activeGame, setActiveGame] = useState<'snake' | 'tetris' | null>(null);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Snake game state
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(0);
  const [snakePaused, setSnakePaused] = useState(false);
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  
  // Tetris game state
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisHighScore, setTetrisHighScore] = useState(0);
  const [tetrisLevel, setTetrisLevel] = useState(1);
  const [tetrisLines, setTetrisLines] = useState(0);
  const [tetrisPaused, setTetrisPaused] = useState(false);
  const [tetrisGameOver, setTetrisGameOver] = useState(false);

  // Snake callbacks
  const handleSnakeScoreUpdate = useCallback((score: number, highScore: number) => {
    setSnakeScore(score);
    setSnakeHighScore(highScore);
  }, []);

  const handleSnakeStateChange = useCallback((paused: boolean, gameOver: boolean) => {
    setSnakePaused(paused);
    setSnakeGameOver(gameOver);
  }, []);

  // Tetris callbacks
  const handleTetrisScoreUpdate = useCallback((score: number, highScore: number, level: number, lines: number) => {
    setTetrisScore(score);
    setTetrisHighScore(highScore);
    setTetrisLevel(level);
    setTetrisLines(lines);
  }, []);

  const handleTetrisStateChange = useCallback((paused: boolean, gameOver: boolean) => {
    setTetrisPaused(paused);
    setTetrisGameOver(gameOver);
  }, []);

  // Snake game content
  const snakeGameContent = useMemo(() => (
    <SnakeGame 
      isActive={true} 
      onClose={closeGameModal}
      onScoreUpdate={handleSnakeScoreUpdate}
      onGameStateChange={handleSnakeStateChange}
    />
  ), [closeGameModal, handleSnakeScoreUpdate, handleSnakeStateChange]);

  // Tetris game content
  const tetrisGameContent = useMemo(() => (
    <TetrisGame 
      isActive={true} 
      onClose={closeGameModal}
      onScoreUpdate={handleTetrisScoreUpdate}
      onGameStateChange={handleTetrisStateChange}
    />
  ), [closeGameModal, handleTetrisScoreUpdate, handleTetrisStateChange]);

  // Update modal scores when Snake scores change
  useEffect(() => {
    if (isGameModalOpen && activeGame === 'snake') {
      updateGameModal({
        scores: [
          { label: t('snake.score'), value: snakeScore, color: 'text-white' },
          { label: t('snake.high'), value: snakeHighScore, color: 'text-text-secondary' }
        ],
        isPaused: snakePaused,
        isGameOver: snakeGameOver
      });
    }
  }, [snakeScore, snakeHighScore, snakePaused, snakeGameOver, isGameModalOpen, activeGame, updateGameModal, t]);

  // Update modal scores when Tetris scores change
  useEffect(() => {
    if (isGameModalOpen && activeGame === 'tetris') {
      updateGameModal({
        scores: [
          { label: t('snake.score'), value: tetrisScore, color: 'text-white' },
          { label: t('snake.high'), value: tetrisHighScore, color: 'text-text-secondary' },
          { label: 'Level', value: tetrisLevel, color: 'text-green-400' },
          { label: 'Lines', value: tetrisLines, color: 'text-yellow-400' }
        ],
        isPaused: tetrisPaused,
        isGameOver: tetrisGameOver
      });
    }
  }, [tetrisScore, tetrisHighScore, tetrisLevel, tetrisLines, tetrisPaused, tetrisGameOver, isGameModalOpen, activeGame, updateGameModal, t]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-cyber-red">❯</span>
          <span className="text-white ml-2">{t('terminal.games')}</span>
        </motion.div>
        <TerminalBackButton onBack={onBack} delay={0.2} />
      </div>

      <motion.div
        className="pl-3 sm:pl-6 text-text-muted text-[10px] sm:text-xs mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t('terminal.gamesAvailable')}
      </motion.div>

      <motion.div
        className="pl-3 sm:pl-6 flex flex-wrap items-center gap-1.5 sm:gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GameButton
          gameName="Snake"
          gameTitle="snake.exe"
          onGameOpen={() => {
            setActiveGame('snake');
            onGameOpen?.();
          }}
          modalConfig={{
            content: snakeGameContent,
            onPause: () => setSnakePaused(!snakePaused),
            onReset: () => {
              setSnakeScore(0);
              setSnakeGameOver(false);
              setSnakePaused(false);
            },
            isPaused: snakePaused,
            isGameOver: snakeGameOver,
            scores: [
              { label: t('snake.score'), value: snakeScore, color: 'text-white' },
              { label: t('snake.high'), value: snakeHighScore, color: 'text-text-secondary' }
            ],
            controls: [
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                ),
                label: isMobile ? t('snake.moveKeysMobile') : t('snake.moveKeys'),
                color: 'cyan' as const
              },
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: isMobile ? t('snake.pauseKeyMobile') : t('snake.pauseKey'),
                color: 'purple' as const
              },
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ),
                label: isMobile ? t('snake.escKeyMobile') : t('snake.escKey'),
                color: 'red' as const
              }
            ]
          }}
          color="cyan"
        />
        <GameButton
          gameName="Tetris"
          gameTitle="tetris.exe"
          onGameOpen={() => {
            setActiveGame('tetris');
            onGameOpen?.();
          }}
          modalConfig={{
            content: tetrisGameContent,
            onPause: () => setTetrisPaused(!tetrisPaused),
            onReset: () => {
              setTetrisScore(0);
              setTetrisGameOver(false);
              setTetrisPaused(false);
            },
            isPaused: tetrisPaused,
            isGameOver: tetrisGameOver,
            controlsStacked: true,
            scores: [
              { label: t('snake.score'), value: tetrisScore, color: 'text-white' },
              { label: t('snake.high'), value: tetrisHighScore, color: 'text-text-secondary' },
              { label: 'Level', value: tetrisLevel, color: 'text-green-400' },
              { label: 'Lines', value: tetrisLines, color: 'text-yellow-400' }
            ],
            controls: [
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                ),
                label: '← → ↓ para mover, ↑ para rotar',
                color: 'cyan' as const
              },
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: t('snake.pauseKey'),
                color: 'purple' as const
              },
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ),
                label: t('snake.escKey'),
                color: 'red' as const
              }
            ]
          }}
          color="cyan"
        />
        <GameButton
          gameName="Hangman"
          gameTitle="hangman.exe"
          color="cyan"
          comingSoon={true}
        />
      </motion.div>
    </div>
  );
}
