'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MatrixContextType {
  matrixMode: boolean;
  toggleMatrixMode: () => void;
  setMatrixMode: (value: boolean) => void;
}

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export function MatrixProvider({ children }: { children: ReactNode }) {
  const [matrixMode, setMatrixModeState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cargar estado guardado
    const saved = localStorage.getItem('matrix-mode');
    if (saved === 'true') {
      setMatrixModeState(true);
    }
  }, []);

  const setMatrixMode = (value: boolean) => {
    setMatrixModeState(value);
    if (mounted) {
      localStorage.setItem('matrix-mode', value.toString());
    }
  };

  const toggleMatrixMode = () => {
    setMatrixMode(!matrixMode);
  };

  return (
    <MatrixContext.Provider value={{ matrixMode, toggleMatrixMode, setMatrixMode }}>
      {children}
    </MatrixContext.Provider>
  );
}

export function useMatrix() {
  const context = useContext(MatrixContext);
  if (context === undefined) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
}
