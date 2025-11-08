'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import GameArrowButton from '@/components/atoms/GameArrowButton';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_WIDTH = 30;
const GRID_HEIGHT = 18;
const CELL_SIZE = 20;
const MOBILE_GRID_WIDTH = 15;
const MOBILE_GRID_HEIGHT = 20;
const MOBILE_CELL_SIZE = 15;
const INITIAL_SPEED = 150;

interface SnakeGameProps {
  isActive: boolean;
  onClose: () => void;
  onScoreUpdate?: (score: number, highScore: number) => void;
  onGameStateChange?: (isPaused: boolean, isGameOver: boolean) => void;
}

export default function SnakeGame({ isActive, onClose, onScoreUpdate, onGameStateChange }: SnakeGameProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [snake, setSnake] = useState<Position[]>([{ x: 15, y: 9 }]);
  const [food, setFood] = useState<Position>({ x: 20, y: 9 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const { lowPerformanceMode } = usePerformance();
  const { t } = useLanguage();
  
  const gridWidth = isMobile ? MOBILE_GRID_WIDTH : GRID_WIDTH;
  const gridHeight = isMobile ? MOBILE_GRID_HEIGHT : GRID_HEIGHT;
  const cellSize = isMobile ? MOBILE_CELL_SIZE : CELL_SIZE;
  
  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snake-highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Notify parent of score changes
  useEffect(() => {
    if (onScoreUpdate) {
      onScoreUpdate(score, highScore);
    }
  }, [score, highScore, onScoreUpdate]);

  // Notify parent of game state changes
  useEffect(() => {
    if (onGameStateChange) {
      onGameStateChange(isPaused, gameOver);
    }
  }, [isPaused, gameOver, onGameStateChange]);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [gridWidth, gridHeight]);

  // Reset game
  const resetGame = useCallback(() => {
    const startX = Math.floor(gridWidth / 2);
    const startY = Math.floor(gridHeight / 2);
    const initialSnake = [{ x: startX, y: startY }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  }, [generateFood, gridWidth, gridHeight]);

  // Handle keyboard input for movement
  useEffect(() => {
    if (!isActive || gameOver || isPaused) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const currentDir = directionRef.current;

      if (key === 'arrowup' || key === 'w') {
        if (currentDir !== 'DOWN') {
          setDirection('UP');
          directionRef.current = 'UP';
        }
      } else if (key === 'arrowdown' || key === 's') {
        if (currentDir !== 'UP') {
          setDirection('DOWN');
          directionRef.current = 'DOWN';
        }
      } else if (key === 'arrowleft' || key === 'a') {
        if (currentDir !== 'RIGHT') {
          setDirection('LEFT');
          directionRef.current = 'LEFT';
        }
      } else if (key === 'arrowright' || key === 'd') {
        if (currentDir !== 'LEFT') {
          setDirection('RIGHT');
          directionRef.current = 'RIGHT';
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, gameOver, isPaused]);

  // Handle keyboard input for pause and close (always active)
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === ' ' || key === 'p') {
        if (!gameOver) {
          e.preventDefault();
          setIsPaused(prev => !prev);
        }
      } else if (key === 'escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, gameOver, onClose]);

  // Game loop
  useEffect(() => {
    if (!isActive || gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        let newHead: Position;

        switch (directionRef.current) {
          case 'UP':
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: head.x - 1, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= gridWidth || newHead.y < 0 || newHead.y >= gridHeight) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snake-highscore', newScore.toString());
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
          return newSnake;
        }

        // Remove tail if no food eaten
        newSnake.pop();
        return newSnake;
      });
    }, INITIAL_SPEED - Math.min(score, 100));

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isActive, gameOver, isPaused, food, score, highScore, generateFood, gridWidth, gridHeight]);

  // Close game when switching to low performance mode
  useEffect(() => {
    if (lowPerformanceMode && isActive) {
      onClose();
    }
  }, [lowPerformanceMode, isActive, onClose]);

  // Reset game when opening
  useEffect(() => {
    if (isActive) {
      resetGame();
    }
  }, [isActive, resetGame]);

  // Handle touch controls
  const handleMove = (newDirection: Direction) => {
    if (gameOver || isPaused) return;
    const currentDir = directionRef.current;
    
    if (newDirection === 'UP' && currentDir !== 'DOWN') {
      setDirection('UP');
      directionRef.current = 'UP';
    } else if (newDirection === 'DOWN' && currentDir !== 'UP') {
      setDirection('DOWN');
      directionRef.current = 'DOWN';
    } else if (newDirection === 'LEFT' && currentDir !== 'RIGHT') {
      setDirection('LEFT');
      directionRef.current = 'LEFT';
    } else if (newDirection === 'RIGHT' && currentDir !== 'LEFT') {
      setDirection('RIGHT');
      directionRef.current = 'RIGHT';
    }
  };

  return (
    <div className="space-y-4">
      {/* Game board with controls */}
      <div className="flex gap-3 items-center justify-center">
        {/* Game board */}
        <div
          className="relative bg-background-dark border-2 border-cyber-blue-cyan/30 rounded-lg"
          style={{
            width: gridWidth * cellSize,
            height: gridHeight * cellSize,
          }}
        >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {Array.from({ length: gridHeight }).map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-cyber-blue-cyan" style={{ top: i * cellSize }} />
          ))}
          {Array.from({ length: gridWidth }).map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-cyber-blue-cyan" style={{ left: i * cellSize }} />
          ))}
        </div>

                {/* Snake */}
                {snake.map((segment, index) => (
                  <motion.div
                    key={`${segment.x}-${segment.y}-${index}`}
                    className={`absolute rounded-sm ${
                      index === 0 ? 'bg-cyber-blue-cyan' : 'bg-cyber-blue-cyan/70'
                    }`}
                    style={{
                      left: segment.x * cellSize,
                      top: segment.y * cellSize,
                      width: cellSize - 2,
                      height: cellSize - 2,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                ))}

                {/* Food */}
                <motion.div
                  className="absolute bg-cyber-red rounded-sm"
                  style={{
                    left: food.x * cellSize,
                    top: food.y * cellSize,
                    width: cellSize - 2,
                    height: cellSize - 2,
                  }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />

                {/* Game over overlay */}
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-background-dark/90 flex flex-col items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="font-orbitron text-2xl text-cyber-red mb-2">{t('snake.gameOver')}</div>
                      <div className="font-mono text-sm text-text-muted mb-4">{t('snake.score')}: {score}</div>
                      <button
                        onClick={resetGame}
                        className="px-4 py-2 bg-cyber-blue-cyan text-background-dark font-mono text-sm rounded hover:bg-cyber-blue-cyan/80 transition-colors"
                      >
                        {t('snake.playAgain')}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Paused overlay */}
                {isPaused && !gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-background-dark/80 flex items-center justify-center"
                  >
                    <div className="font-orbitron text-xl text-cyber-blue-cyan">{t('snake.paused')}</div>
                  </motion.div>
                )}
        </div>

        {/* Mobile touch controls */}
        {isMobile && (
          <div className="flex flex-col gap-2 w-24 sm:w-28">
            <GameArrowButton 
              direction="UP" 
              onClick={() => handleMove('UP')} 
              disabled={gameOver}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <GameArrowButton 
                direction="LEFT" 
                onClick={() => handleMove('LEFT')} 
                disabled={gameOver}
              />
              <GameArrowButton 
                direction="RIGHT" 
                onClick={() => handleMove('RIGHT')} 
                disabled={gameOver}
              />
            </div>
            
            <GameArrowButton 
              direction="DOWN" 
              onClick={() => handleMove('DOWN')} 
              disabled={gameOver}
            />
          </div>
        )}
      </div>
    </div>
  );
}
