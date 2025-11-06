'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import CameraCorner from '@/components/atoms/CameraCorner';
import DataStream from '@/components/atoms/DataStream';
import HexagonGrid from '@/components/atoms/HexagonGrid';
import ScanLine from '@/components/atoms/ScanLine';
import CenteredHero from '@/components/molecules/CenteredHero';
import FloatingMenu from '@/components/molecules/FloatingMenu';
import SettingsPanel from '@/components/molecules/SettingsPanel';
import VisionCard from '@/components/cards/VisionCard';
import InfoCard from '@/components/cards/InfoCard';
import ServicesCard from '@/components/cards/ServicesCard';
import ContactCard from '@/components/cards/ContactCard';
import { 
  getGridConfig, 
  calculateAutoLayout, 
  PRESET_LAYOUTS,
  GridPosition 
} from '@/lib/gridSystem';

interface Panel {
  id: string;
  name: string;
  isOpen: boolean;
  size: '1x1' | '1x2' | '2x1' | '2x2';
  priority: number;
}

export default function Home() {
  const [panels, setPanels] = useState<Panel[]>([
    { id: 'vision', name: 'Visión', isOpen: true, size: '1x1', priority: 10 },
    { id: 'info', name: 'Info', isOpen: true, size: '1x1', priority: 9 },
    { id: 'services', name: 'Servicios', isOpen: true, size: '1x1', priority: 8 },
    { id: 'contact', name: 'Contacto', isOpen: true, size: '1x1', priority: 7 },
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gridPositions, setGridPositions] = useState<Map<string, GridPosition>>(new Map());
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Actualizar tamaño de ventana
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Recalcular posiciones cuando cambian los paneles o el tamaño de ventana
  useEffect(() => {
    if (windowSize.width === 0) return;

    const config = getGridConfig(windowSize.width, windowSize.height);
    const openPanels = panels.filter(p => p.isOpen);
    
    const layout = openPanels.map(p => ({
      id: p.id,
      size: p.size,
      priority: p.priority,
      preferredPosition: PRESET_LAYOUTS.default.find(preset => preset.id === p.id)?.preferredPosition
    }));

    const positions = calculateAutoLayout(layout, config, windowSize.width, windowSize.height);
    setGridPositions(positions);
  }, [panels, windowSize]);

  const handleTogglePanel = (id: string) => {
    setPanels(prev => prev.map(panel => 
      panel.id === id ? { ...panel, isOpen: !panel.isOpen } : panel
    ));
  };

  const handlePortfolioClick = () => {
    window.location.href = 'http://localhost:3000';
  };

  return (
    <div className="relative w-full h-screen bg-background-light overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 cyber-grid opacity-20 z-0" />
      <div className="absolute inset-0 z-0">
        <HexagonGrid />
      </div>
      
      {/* Data streams */}
      <div className="absolute inset-0 z-0">
        <DataStream position="left" color="blue" />
        <DataStream position="right" color="purple" />
      </div>
      
      {/* Scan lines */}
      <div className="absolute inset-0 z-0">
        <ScanLine direction="horizontal" color="blue" duration={4} />
        <ScanLine direction="vertical" color="red" duration={5} />
      </div>

      {/* Camera corners */}
      <motion.div 
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <CameraCorner position="top-left" size={80} />
      </motion.div>
      
      <motion.div 
        className="absolute top-6 right-6 z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <CameraCorner position="top-right" size={80} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-6 left-6 z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 200 }}
      >
        <CameraCorner position="bottom-left" size={80} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-6 right-6 z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        <CameraCorner position="bottom-right" size={80} />
      </motion.div>

      {/* Menu Button */}
      <motion.button
        onClick={() => {
          if (!isMenuOpen) setIsSettingsOpen(false);
          setIsMenuOpen(!isMenuOpen);
        }}
        className="fixed left-24 top-8 z-50 group"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-cyber-black/20 hover:bg-white rounded-lg px-3 py-2 transition-all duration-300">
          <svg className="w-4 h-4 text-cyber-black/70 group-hover:text-cyber-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-mono text-xs text-cyber-black/70 group-hover:text-cyber-black tracking-wide">
            menú
          </span>
        </div>
      </motion.button>

      {/* Settings Button */}
      <motion.button
        onClick={() => {
          if (!isSettingsOpen) setIsMenuOpen(false);
          setIsSettingsOpen(!isSettingsOpen);
        }}
        className="fixed left-[180px] top-8 z-50 group"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-cyber-black/20 hover:bg-white rounded-lg px-3 py-2 transition-all duration-300">
          <svg className="w-4 h-4 text-cyber-black/70 group-hover:text-cyber-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-mono text-xs text-cyber-black/70 group-hover:text-cyber-black tracking-wide">
            ajustes
          </span>
        </div>
      </motion.button>

      {/* Settings Panel */}
      <SettingsPanel 
        panels={panels}
        onTogglePanel={handleTogglePanel}
        isOpen={isSettingsOpen}
        onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
      />

      {/* Floating Menu */}
      <FloatingMenu 
        onPortfolioClick={handlePortfolioClick}
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Custom Cards con Grid System */}
      <VisionCard
        isOpen={panels.find(p => p.id === 'vision')?.isOpen || false}
        onClose={() => handleTogglePanel('vision')}
        gridPosition={gridPositions.get('vision')}
      />

      <InfoCard
        isOpen={panels.find(p => p.id === 'info')?.isOpen || false}
        onClose={() => handleTogglePanel('info')}
        gridPosition={gridPositions.get('info')}
      />

      <ServicesCard
        isOpen={panels.find(p => p.id === 'services')?.isOpen || false}
        onClose={() => handleTogglePanel('services')}
        gridPosition={gridPositions.get('services')}
      />

      <ContactCard
        isOpen={panels.find(p => p.id === 'contact')?.isOpen || false}
        onClose={() => handleTogglePanel('contact')}
        gridPosition={gridPositions.get('contact')}
      />

      {/* Main content */}
      <main className="relative z-20">
        <CenteredHero />
      </main>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-40 pointer-events-none z-0"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 3 === 0 ? '#00BFFF' : i % 3 === 1 ? '#FF0000' : '#8B00FF',
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.02) 50%)',
          backgroundSize: '100% 4px',
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none z-30" 
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)'
        }}
      />
    </div>
  );
}