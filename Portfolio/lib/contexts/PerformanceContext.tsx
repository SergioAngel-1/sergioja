'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PerformanceContextType {
  lowPerformanceMode: boolean;
  togglePerformanceMode: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);

  // Cargar preferencia del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lowPerformanceMode');
    if (saved !== null) {
      setLowPerformanceMode(JSON.parse(saved));
    }
  }, []);

  // Guardar preferencia en localStorage
  useEffect(() => {
    localStorage.setItem('lowPerformanceMode', JSON.stringify(lowPerformanceMode));
  }, [lowPerformanceMode]);

  const togglePerformanceMode = () => {
    setLowPerformanceMode(prev => !prev);
  };

  return (
    <PerformanceContext.Provider value={{ lowPerformanceMode, togglePerformanceMode }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    // Retornar valores por defecto si no hay provider (SSR o error)
    return {
      lowPerformanceMode: false,
      togglePerformanceMode: () => {},
    };
  }
  return context;
}
