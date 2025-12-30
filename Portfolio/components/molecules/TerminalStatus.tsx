'use client';

import { motion } from 'framer-motion';
import TerminalBackButton from '@/components/atoms/TerminalBackButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import useProfile from '@/lib/hooks/useProfile';
import { useSkills } from '@/lib/hooks/useSkills';
import { useMemo } from 'react';

interface TerminalStatusProps {
  onBack?: () => void;
}

export default function TerminalStatus({ onBack }: TerminalStatusProps = {}) {
  const { t } = useLanguage();
  const { profile, loading, error } = useProfile();
  const { skills, loading: skillsLoading } = useSkills();

  // Calcular años de experiencia (misma lógica que about/page.tsx)
  const totalExperience = useMemo(() => {
    return skills.length > 0
      ? Math.max(...skills.map(s => s.yearsOfExperience || 0))
      : 0;
  }, [skills]);

  // Determinar estado de disponibilidad
  const availabilityStatus = useMemo(() => {
    if (loading || error || !profile) return 'unavailable';
    return profile.availability || 'unavailable';
  }, [profile, loading, error]);

  // Determinar color y estado de disponibilidad
  const availabilityConfig = useMemo(() => {
    const configs: Record<string, { color: string; bgColor: string; label: string; animate: boolean }> = {
      available: { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)', label: t('terminal.online'), animate: true },
      busy: { color: '#facc15', bgColor: 'rgba(250, 204, 21, 0.2)', label: t('terminal.busy'), animate: true },
      unavailable: { color: '#f87171', bgColor: 'rgba(248, 113, 113, 0.2)', label: t('terminal.offline'), animate: false },
    };
    return configs[availabilityStatus] || configs.unavailable;
  }, [availabilityStatus, t]);

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
          <span className="text-white" style={{ marginLeft: fluidSizing.space.sm }}>{t('terminal.status')}</span>
        </motion.div>
        {onBack && <TerminalBackButton onBack={onBack} delay={0.2} />}
      </div>

      <motion.div
        className="grid grid-cols-2"
        style={{ paddingLeft: fluidSizing.space.md, gap: fluidSizing.space.sm }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Availability Card - Double width */}
        <motion.div
          className="col-span-2 bg-background-elevated border rounded-lg hover:border-opacity-60 transition-all duration-300"
          style={{ 
            padding: fluidSizing.space.md,
            borderColor: availabilityConfig.bgColor,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.sm }}>
            <span 
              className={`rounded-full flex-shrink-0 ${availabilityConfig.animate ? 'animate-pulse' : ''}`}
              style={{ 
                width: fluidSizing.space.sm, 
                height: fluidSizing.space.sm,
                backgroundColor: availabilityConfig.color,
              }} 
            />
            <span className="text-text-muted uppercase font-mono truncate text-fluid-xs">{t('terminal.availability')}</span>
          </div>
          <div className="font-bold font-orbitron truncate text-fluid-lg" style={{ color: availabilityConfig.color }}>
            {loading ? '...' : availabilityConfig.label}
          </div>
        </motion.div>

        {/* Location Card */}
        <motion.div
          className="bg-background-elevated border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300"
          style={{ padding: fluidSizing.space.md }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-text-muted uppercase font-mono truncate text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>{t('terminal.location')}</div>
          <div className="font-bold text-white font-orbitron truncate text-fluid-lg">
            {loading ? '...' : profile?.location}
          </div>
        </motion.div>

        {/* Uptime Card */}
        <motion.div
          className="bg-background-elevated border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300"
          style={{ padding: fluidSizing.space.md }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-text-muted uppercase font-mono truncate text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>{t('terminal.uptime')}</div>
          <div className="font-bold text-white font-orbitron truncate text-fluid-lg">
            {skillsLoading ? '...' : `${totalExperience}+ ${t('terminal.years')}`}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
