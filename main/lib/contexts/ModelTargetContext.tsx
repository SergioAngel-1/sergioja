'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TargetPosition {
  x: number;
  y: number;
  timestamp: number;
}

interface ModelTargetContextType {
  targetPosition: TargetPosition | null;
  setTargetPosition: (position: { x: number; y: number }) => void;
  clearTarget: () => void;
}

const ModelTargetContext = createContext<ModelTargetContextType | undefined>(undefined);

export function ModelTargetProvider({ children }: { children: ReactNode }) {
  const [targetPosition, setTargetPositionState] = useState<TargetPosition | null>(null);

  const setTargetPosition = (position: { x: number; y: number }) => {
    setTargetPositionState({
      x: position.x,
      y: position.y,
      timestamp: Date.now(),
    });
  };

  const clearTarget = () => {
    setTargetPositionState(null);
  };

  return (
    <ModelTargetContext.Provider value={{ targetPosition, setTargetPosition, clearTarget }}>
      {children}
    </ModelTargetContext.Provider>
  );
}

export function useModelTarget() {
  const context = useContext(ModelTargetContext);
  if (context === undefined) {
    throw new Error('useModelTarget must be used within a ModelTargetProvider');
  }
  return context;
}
