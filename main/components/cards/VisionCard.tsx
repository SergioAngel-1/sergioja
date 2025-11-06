'use client';

import { motion } from 'framer-motion';
import InfoPanel from '@/components/atoms/InfoPanel';
import { GridPosition } from '@/lib/gridSystem';

interface VisionCardProps {
  isOpen: boolean;
  onClose: () => void;
  gridPosition?: GridPosition;
}

export default function VisionCard({ isOpen, onClose, gridPosition }: VisionCardProps) {
  return (
    <InfoPanel
      isOpen={isOpen}
      onClose={onClose}
      title="VISIÓN"
      subtitle="Transformando Ideas en Realidad"
      status="processing"
      gridPosition={gridPosition}
      containerClassName="!bg-gradient-to-br from-cyber-red/10 via-white/95 to-cyber-purple/10 border-cyber-red/30"
    >
      <div className="space-y-3">
        {/* Main vision statement */}
        <div className="relative">
          <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-cyber-red to-cyber-purple rounded-full" />
          <p className="text-cyber-black/80 leading-relaxed pl-2 font-rajdhani font-medium">
            Crear soluciones tecnológicas innovadoras que impulsen el crecimiento digital de empresas y emprendedores.
          </p>
        </div>

        {/* Vision pillars */}
        <div className="pt-2 space-y-2">
          <motion.div 
            className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-cyber-red/5 hover:bg-cyber-red/10 transition-colors"
            whileHover={{ x: 4 }}
          >
            <motion.div 
              className="w-2 h-2 rounded-full bg-cyber-red"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-cyber-black/70 text-xs font-medium">Innovación constante</span>
          </motion.div>

          <motion.div 
            className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-cyber-blue-cyan/5 hover:bg-cyber-blue-cyan/10 transition-colors"
            whileHover={{ x: 4 }}
          >
            <motion.div 
              className="w-2 h-2 rounded-full bg-cyber-blue-cyan"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <span className="text-cyber-black/70 text-xs font-medium">Calidad premium</span>
          </motion.div>

          <motion.div 
            className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-cyber-purple/5 hover:bg-cyber-purple/10 transition-colors"
            whileHover={{ x: 4 }}
          >
            <motion.div 
              className="w-2 h-2 rounded-full bg-cyber-purple"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
            <span className="text-cyber-black/70 text-xs font-medium">Resultados medibles</span>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyber-red/10">
          <div className="text-center p-2 rounded-md bg-cyber-red/5">
            <div className="font-orbitron text-lg font-black text-cyber-red">100%</div>
            <div className="text-[9px] text-cyber-black/50 uppercase tracking-wide">Compromiso</div>
          </div>
          <div className="text-center p-2 rounded-md bg-cyber-purple/5">
            <div className="font-orbitron text-lg font-black text-cyber-purple">24/7</div>
            <div className="text-[9px] text-cyber-black/50 uppercase tracking-wide">Soporte</div>
          </div>
        </div>
      </div>
    </InfoPanel>
  );
}
