'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function StatusPanel() {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setStats({
        cpu: Math.floor(Math.random() * 30) + 40,
        memory: Math.floor(Math.random() * 20) + 60,
        network: Math.floor(Math.random() * 40) + 30,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed top-6 right-6 bg-background-surface/90 backdrop-blur-md border-2 border-cyber-black rounded-lg p-4 shadow-glow-black z-30"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="font-mono text-xs space-y-2 min-w-[200px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyber-black/30 pb-2">
          <span className="text-cyber-black font-bold">SYSTEM STATUS</span>
          <motion.div
            className="w-2 h-2 rounded-full bg-cyber-blue-cyan"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Time */}
        <div className="flex justify-between">
          <span className="text-text-muted">TIME:</span>
          <span className="text-cyber-blue-cyan font-bold">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-1.5">
          <StatBar label="CPU" value={stats.cpu} color="red" />
          <StatBar label="MEM" value={stats.memory} color="blue" />
          <StatBar label="NET" value={stats.network} color="purple" />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 pt-2 border-t border-cyber-black/30">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue-cyan animate-pulse" />
          <span className="text-[10px] text-text-secondary">ONLINE</span>
        </div>
      </div>
    </motion.div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: 'red' | 'blue' | 'purple' }) {
  const colorClass = color === 'red' 
    ? 'bg-cyber-red' 
    : color === 'blue' 
    ? 'bg-cyber-blue-cyan' 
    : 'bg-cyber-purple';

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-text-muted text-[10px]">{label}</span>
        <span className="text-text-primary text-[10px] font-bold">{value}%</span>
      </div>
      <div className="w-full h-1 bg-background-elevated rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
