'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import GameArrowButton from '@/components/atoms/GameArrowButton';

type Piece = number[][];
type Board = number[][];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 24;
const MOBILE_CELL_SIZE = 18;
const INITIAL_SPEED = 800;

const PIECES: { [key: string]: Piece } = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
};

const PIECE_COLORS: { [key: string]: string } = {
  I: 'bg-cyber-blue-cyan',
  O: 'bg-yellow-500',
  T: 'bg-cyber-purple',
  S: 'bg-green-500',
  Z: 'bg-cyber-red',
  J: 'bg-blue-600',
  L: 'bg-orange-500',
};

interface TetrisGameProps {
  isActive: boolean;
  onClose: () => void;
  onScoreUpdate?: (score: number, highScore: number, level: number, lines: number) => void;
  onGameStateChange?: (isPaused: boolean, isGameOver: boolean) => void;
}

export default function TetrisGame({ isActive, onClose, onScoreUpdate, onGameStateChange }: TetrisGameProps) {
  const [board, setBoard] = useState<Board>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<{ shape: Piece; type: string; x: number; y: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const { lowPerformanceMode } = usePerformance();
  const { t } = useLanguage();
  
  const [isMobile, setIsMobile] = useState(false);
  const cellSize = isMobile ? MOBILE_CELL_SIZE : CELL_SIZE;

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('tetris-highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Notify parent of score changes
  useEffect(() => {
    if (onScoreUpdate) {
      onScoreUpdate(score, highScore, level, linesCleared);
    }
  }, [score, highScore, level, linesCleared, onScoreUpdate]);

  // Notify parent of game state changes
  useEffect(() => {
    if (onGameStateChange) {
      onGameStateChange(isPaused, gameOver);
    }
  }, [isPaused, gameOver, onGameStateChange]);

  // Generate random piece
  const generatePiece = useCallback(() => {
    const types = Object.keys(PIECES);
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      shape: PIECES[type],
      type,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
    };
  }, []);

  // Check collision
  const checkCollision = useCallback((piece: { shape: Piece; x: number; y: number }, board: Board) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Merge piece to board
  const mergePieceToBoard = useCallback((piece: { shape: Piece; type: string; x: number; y: number }, board: Board) => {
    const newBoard = board.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && piece.y + y >= 0) {
          newBoard[piece.y + y][piece.x + x] = Object.keys(PIECES).indexOf(piece.type) + 1;
        }
      });
    });
    return newBoard;
  }, []);

  // Clear lines
  const clearLines = useCallback((board: Board) => {
    let lines = 0;
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== 0)) {
        lines++;
        return false;
      }
      return true;
    });
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { newBoard, lines };
  }, []);

  // Rotate piece
  const rotatePiece = useCallback((piece: { shape: Piece; type: string; x: number; y: number }) => {
    if (piece.type === 'O') return piece; // O piece doesn't rotate
    
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    
    return { ...piece, shape: rotated };
  }, []);

  // Move piece
  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
    
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else if (dy > 0) {
      // Piece landed
      const newBoard = mergePieceToBoard(currentPiece, board);
      const { newBoard: clearedBoard, lines } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLinesCleared(prev => prev + lines);
      setScore(prev => prev + lines * 100 * level);
      setLevel(Math.floor((linesCleared + lines) / 10) + 1);
      
      const nextPiece = generatePiece();
      if (checkCollision(nextPiece, clearedBoard)) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('tetris-highscore', score.toString());
        }
      } else {
        setCurrentPiece(nextPiece);
      }
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision, mergePieceToBoard, clearLines, generatePiece, score, level, linesCleared, highScore]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(generatePiece());
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setIsPaused(false);
  }, [generatePiece]);

  // Handle keyboard for movement
  useEffect(() => {
    if (!isActive || gameOver || isPaused) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        movePiece(-1, 0);
      } else if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        movePiece(1, 0);
      } else if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        movePiece(0, 1);
      } else if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        if (currentPiece) {
          const rotated = rotatePiece(currentPiece);
          if (!checkCollision(rotated, board)) {
            setCurrentPiece(rotated);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, gameOver, isPaused, movePiece, currentPiece, rotatePiece, checkCollision, board]);

  // Handle pause and close
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
      movePiece(0, 1);
    }, Math.max(INITIAL_SPEED - (level - 1) * 50, 200));

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isActive, gameOver, isPaused, level, movePiece]);

  // Close when switching to low performance
  useEffect(() => {
    if (lowPerformanceMode && isActive) {
      onClose();
    }
  }, [lowPerformanceMode, isActive, onClose]);

  // Initialize game
  useEffect(() => {
    if (isActive && !currentPiece) {
      resetGame();
    }
  }, [isActive, currentPiece, resetGame]);

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell && currentPiece.y + y >= 0 && currentPiece.y + y < BOARD_HEIGHT) {
            displayBoard[currentPiece.y + y][currentPiece.x + x] = Object.keys(PIECES).indexOf(currentPiece.type) + 1;
          }
        });
      });
    }
    
    return displayBoard;
  };

  const displayBoard = renderBoard();

  // Touch controls handler
  const handleTouchControl = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (dir === 'UP') {
      if (currentPiece) {
        const rotated = rotatePiece(currentPiece);
        if (!checkCollision(rotated, board)) setCurrentPiece(rotated);
      }
    } else if (dir === 'LEFT') {
      movePiece(-1, 0);
    } else if (dir === 'RIGHT') {
      movePiece(1, 0);
    } else if (dir === 'DOWN') {
      movePiece(0, 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Game board with controls */}
      <div className="grid grid-cols-[auto,auto] lg:grid-cols-[auto,1fr] gap-3 items-center justify-center justify-items-center w-full">
        {/* Game board */}
        <div
          className="relative bg-background-dark border-2 border-cyber-blue-cyan/30 rounded-lg overflow-hidden"
          style={{
            width: BOARD_WIDTH * cellSize,
            height: BOARD_HEIGHT * cellSize,
          }}
        >
          {/* Grid */}
          {displayBoard.map((row, y) => (
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`absolute border box-border border-cyber-blue-cyan/5 ${
                  cell ? PIECE_COLORS[Object.keys(PIECES)[cell - 1]] : ''
                }`}
                style={{
                  left: x * cellSize,
                  top: y * cellSize,
                  width: cellSize,
                  height: cellSize,
                }}
              />
            ))
          ))}

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
          <div className="flex flex-col items-center gap-2 w-24 sm:w-28 place-self-center mx-auto">
            <GameArrowButton direction="UP" onClick={() => handleTouchControl('UP')} disabled={gameOver} />
            <div className="grid grid-cols-2 gap-2 w-full">
              <GameArrowButton direction="LEFT" onClick={() => handleTouchControl('LEFT')} disabled={gameOver} />
              <GameArrowButton direction="RIGHT" onClick={() => handleTouchControl('RIGHT')} disabled={gameOver} />
            </div>
            <GameArrowButton direction="DOWN" onClick={() => handleTouchControl('DOWN')} disabled={gameOver} />
          </div>
        )}
      </div>
    </div>
  );
}
