'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';
import { useAlerts } from '@/lib/hooks/useAlerts';
import { alerts as alertsAPI, alertStyles, type Alert, type AlertPosition } from '../../../shared/alertSystem';
import { groupAlertsByPosition, formatElapsedTime } from '../../../shared/alertHelpers';

const AlertItem = forwardRef<HTMLDivElement, { alert: Alert }>(({ alert }, ref) => {
  const style = alertStyles[alert.type];
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative bg-white/90 backdrop-blur-md rounded-lg shadow-xl overflow-hidden min-w-[320px] max-w-[400px]"
      style={{
        borderLeft: `4px solid ${style.color}`,
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div 
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
            style={{
              backgroundColor: style.bgColor,
              color: style.color,
            }}
          >
            {style.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-orbitron font-bold text-sm text-cyber-black">
                {alert.title}
              </h4>
              
              {alert.dismissible && (
                <button
                  onClick={() => alertsAPI.dismiss(alert.id)}
                  className="flex-shrink-0 w-5 h-5 rounded hover:bg-cyber-black/10 flex items-center justify-center transition-colors group"
                  aria-label="Cerrar alerta"
                >
                  <svg className="w-3 h-3 text-cyber-black/40 group-hover:text-cyber-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {alert.message && (
              <p className="mt-1 text-xs text-cyber-black/70 leading-relaxed">
                {alert.message}
              </p>
            )}
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyber-black/50 uppercase tracking-wider">
                {alert.type}
              </span>
              <span className="text-[10px] font-mono text-cyber-black/50">
                {formatElapsedTime(alert.timestamp)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress bar para alertas con duración */}
        {alert.duration && alert.duration > 0 && (
          <motion.div
            className="absolute bottom-0 left-0 h-1"
            style={{ backgroundColor: style.color }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: alert.duration / 1000, ease: 'linear' }}
          />
        )}
      </div>
    </motion.div>
  );
});

function AlertGroup({ position, alerts }: { position: AlertPosition; alerts: Alert[] }) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={`fixed z-50 flex flex-col gap-3 ${positionClasses[position]}`}>
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function AlertContainer() {
  const alerts = useAlerts();
  const groupedAlerts = groupAlertsByPosition(alerts);

  return (
    <>
      {Array.from(groupedAlerts.entries()).map(([position, positionAlerts]) => (
        <AlertGroup key={position} position={position} alerts={positionAlerts} />
      ))}
    </>
  );
}
