'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';

export default function WebVitalsEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="inline-block p-8 bg-admin-dark-elevated border border-admin-primary/30 rounded-lg">
        <Icon name="activity" size={64} className="mx-auto mb-4 opacity-50 text-admin-primary" />
        <p className="text-text-secondary text-lg font-rajdhani">No hay métricas de Web Vitals registradas</p>
        <p className="text-text-muted text-sm mt-2">Las métricas se recopilarán automáticamente cuando los usuarios visiten el sitio</p>
      </div>
    </motion.div>
  );
}
