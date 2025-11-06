'use client';

import { motion } from 'framer-motion';
import ManagementPanel from '@/components/atoms/ManagementPanel';

interface SettingsPanelProps {
  panels: {
    id: string;
    name: string;
    isOpen: boolean;
  }[];
  onTogglePanel: (id: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function SettingsPanel({ panels, onTogglePanel, isOpen = false, onToggle }: SettingsPanelProps) {
  return (
    <ManagementPanel
      isOpen={isOpen}
      onClose={onToggle || (() => {})}
      title="Ajustes"
      position="left"
    >
      {/* Section Title */}
      <h3 className="font-mono text-[10px] text-cyber-black/50 tracking-wide mb-2 uppercase">
        Recuadros abiertos
      </h3>

      {/* Panels List */}
      <div className="space-y-1.5">
                {panels.map((panel, index) => (
                  <motion.div
                    key={panel.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-cyber-black/5 transition-all duration-200 group"
                  >
                    <span className="font-mono text-xs text-cyber-black/70 group-hover:text-cyber-black transition-colors">
                      {panel.name}
                    </span>
                    
                    {/* Toggle switch */}
                    <button
                      onClick={() => onTogglePanel(panel.id)}
                      className={`relative w-8 h-4 rounded-full transition-all duration-300 ${
                        panel.isOpen ? 'bg-cyber-blue-cyan' : 'bg-cyber-black/20'
                      }`}
                    >
                      <motion.div
                        className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                        animate={{ x: panel.isOpen ? 16 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </motion.div>
                ))}
              </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-cyber-black/5">
        <div className="flex items-center justify-center gap-1.5">
          <span className="font-mono text-[10px] text-cyber-black/40">{panels.filter(p => p.isOpen).length}/{panels.length} activos</span>
        </div>
      </div>
    </ManagementPanel>
  );
}
