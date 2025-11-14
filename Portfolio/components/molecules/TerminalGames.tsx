'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import GameButton from './GameButton';
import SnakeGame from './SnakeGame';
import TetrisGame from './TetrisGame';
import TerminalBackButton from '@/components/atoms/TerminalBackButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useModal } from '@/lib/contexts/ModalContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

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
  const [snakePaused, setSnakePaused] = useState(false);
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const [snakeResetTrigger, setSnakeResetTrigger] = useState(0);
  
  // Tetris game state
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisHighScore, setTetrisHighScore] = useState(0);
  const [tetrisLevel, setTetrisLevel] = useState(1);
  const [tetrisLines, setTetrisLines] = useState(0);
  const [tetrisPaused, setTetrisPaused] = useState(false);
  const [tetrisGameOver, setTetrisGameOver] = useState(false);
  const [tetrisResetTrigger, setTetrisResetTrigger] = useState(0);

  // Refs to avoid redundant modal updates causing render loops
  const lastSnakeRef = useRef<null | { score: number; paused: boolean; gameOver: boolean }>(null);
  const lastTetrisRef = useRef<
    null | { score: number; level: number; lines: number; paused: boolean; gameOver: boolean }
  >(null);

  // Snake callbacks
  const handleSnakeScoreUpdate = useCallback((score: number) => {
    setSnakeScore(score);
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
      paused={snakePaused}
      resetTrigger={snakeResetTrigger}
    />
  ), [closeGameModal, handleSnakeScoreUpdate, handleSnakeStateChange, snakeResetTrigger, snakePaused]);

  // Keep modal content in sync for Snake when pause/reset changes
  useEffect(() => {
    if (isGameModalOpen && activeGame === 'snake') {
      updateGameModal({ content: snakeGameContent });
    }
  }, [snakeGameContent, isGameModalOpen, activeGame, updateGameModal]);

  // Tetris game content
  const tetrisGameContent = useMemo(() => (
    <TetrisGame 
      isActive={true} 
      onClose={closeGameModal}
      onScoreUpdate={handleTetrisScoreUpdate}
      onGameStateChange={handleTetrisStateChange}
      paused={tetrisPaused}
      resetTrigger={tetrisResetTrigger}
    />
  ), [closeGameModal, handleTetrisScoreUpdate, handleTetrisStateChange, tetrisPaused, tetrisResetTrigger]);

  // Keep modal content in sync for Tetris when pause/reset changes
  useEffect(() => {
    if (isGameModalOpen && activeGame === 'tetris') {
      updateGameModal({ content: tetrisGameContent });
    }
  }, [tetrisGameContent, isGameModalOpen, activeGame, updateGameModal]);

  // Update modal scores when Snake scores change
  useEffect(() => {
    if (isGameModalOpen && activeGame === 'snake') {
      const snapshot = { score: snakeScore, paused: snakePaused, gameOver: snakeGameOver };
      const last = lastSnakeRef.current;
      const changed = !last || last.score !== snapshot.score || last.paused !== snapshot.paused || last.gameOver !== snapshot.gameOver;
      if (changed) {
        lastSnakeRef.current = snapshot;
        updateGameModal({
          scores: [
            { label: t('snake.score'), value: snakeScore, color: 'text-white' }
          ],
          isPaused: snakePaused,
          isGameOver: snakeGameOver
        });
      }
    }
  }, [snakeScore, snakePaused, snakeGameOver, isGameModalOpen, activeGame, updateGameModal, t]);

  // Update modal scores when Tetris scores change
  useEffect(() => {
    if (isGameModalOpen && activeGame === 'tetris') {
      const snapshot = { score: tetrisScore, level: tetrisLevel, lines: tetrisLines, paused: tetrisPaused, gameOver: tetrisGameOver };
      const last = lastTetrisRef.current;
      const changed =
        !last ||
        last.score !== snapshot.score ||
        last.level !== snapshot.level ||
        last.lines !== snapshot.lines ||
        last.paused !== snapshot.paused ||
        last.gameOver !== snapshot.gameOver;
      if (changed) {
        lastTetrisRef.current = snapshot;
        updateGameModal({
          scores: [
            { label: t('snake.score'), value: tetrisScore, color: 'text-white' },
            { label: t('tetris.level'), value: tetrisLevel, color: 'text-white' },
            { label: t('tetris.lines'), value: tetrisLines, color: 'text-white' }
          ],
          isPaused: tetrisPaused,
          isGameOver: tetrisGameOver
        });
      }
    }
  }, [tetrisScore, tetrisLevel, tetrisLines, tetrisPaused, tetrisGameOver, isGameModalOpen, activeGame, updateGameModal, t]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-cyber-red">❯</span>
          <span className="text-white" style={{ marginLeft: fluidSizing.space.sm }}>{t('terminal.games')}</span>
        </motion.div>
        <TerminalBackButton onBack={onBack} delay={0.2} />
      </div>

      <motion.div
        className="text-text-muted text-fluid-xs"
        style={{ paddingLeft: fluidSizing.space.md, marginBottom: fluidSizing.space.sm }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t('terminal.gamesAvailable')}
      </motion.div>

      <motion.div
        className="flex flex-wrap items-center"
        style={{ paddingLeft: fluidSizing.space.md, gap: fluidSizing.space.sm }}
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
            onPause: () =>
              setSnakePaused(prev => {
                const next = !prev;
                updateGameModal({ isPaused: next });
                return next;
              }),
            onReset: () => {
              setSnakeScore(0);
              setSnakeGameOver(false);
              setSnakePaused(false);
              setSnakeResetTrigger(prev => prev + 1);
              updateGameModal({
                isPaused: false,
                isGameOver: false,
                scores: [{ label: t('snake.score'), value: 0, color: 'text-white' }],
              });
            },
            isPaused: snakePaused,
            isGameOver: snakeGameOver,
            scores: [
              { label: t('snake.score'), value: snakeScore, color: 'text-white' }
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
            onPause: () =>
              setTetrisPaused(prev => {
                const next = !prev;
                updateGameModal({ isPaused: next });
                return next;
              }),
            onReset: () => {
              setTetrisScore(0);
              setTetrisGameOver(false);
              setTetrisPaused(false);
              setTetrisResetTrigger(prev => prev + 1);
              updateGameModal({
                isPaused: false,
                isGameOver: false,
                scores: [
                  { label: t('snake.score'), value: 0, color: 'text-white' },
                  { label: t('tetris.level'), value: 1, color: 'text-white' },
                  { label: t('tetris.lines'), value: 0, color: 'text-white' },
                ],
              });
            },
            isPaused: tetrisPaused,
            isGameOver: tetrisGameOver,
            controlsStacked: true,
            scores: [
              { label: t('snake.score'), value: tetrisScore, color: 'text-white' },
              { label: t('tetris.level'), value: tetrisLevel, color: 'text-white' },
              { label: t('tetris.lines'), value: tetrisLines, color: 'text-white' }
            ],
            controls: [
              {
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                ),
                label: isMobile ? t('tetris.moveKeysMobile') : t('tetris.moveKeys'),
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
        gameName="Hangman"
        gameTitle="hangman.exe"
        color="cyan"
        comingSoon={true}
      />
    </motion.div>
  </div>
  );
}
