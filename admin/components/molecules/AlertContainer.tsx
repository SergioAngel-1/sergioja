'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAlerts } from '@/lib/hooks';
import { alertManager, type Alert, alertStyles, alertPositions, type AlertPosition } from '@/shared/alertSystem';
import { groupAlertsByPosition, formatElapsedTime } from '@/shared/alertHelpers';

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
    <div className={`fixed z-[9999] flex flex-col gap-3 ${positionClasses[position]}`}>
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function AlertItem({ alert }: { alert: Alert }) {
  const style = alertStyles[alert.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative bg-admin-dark-surface backdrop-blur-md rounded-lg shadow-2xl overflow-hidden w-full max-w-[400px] min-w-[320px] border border-admin-gray-dark"
    >
      <div className="p-4 relative">
        {/* Grid overlay sutil */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="flex items-start gap-3 relative z-10">
          {/* Icon */}
          <div 
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg border border-admin-gray-dark"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: style.color,
            }}
          >
            {style.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 
                className="font-orbitron font-bold text-sm tracking-wide uppercase"
                style={{ color: style.color }}
              >
                {alert.title}
              </h4>
              
              {alert.dismissible && (
                <button
                  onClick={() => alertManager.remove(alert.id)}
                  className="flex-shrink-0 w-5 h-5 rounded hover:bg-admin-primary/10 flex items-center justify-center transition-all group border border-admin-gray-dark hover:border-admin-primary"
                  aria-label="Cerrar alerta"
                >
                  <svg className="w-3 h-3 text-admin-gray-medium group-hover:text-admin-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {alert.message && (
              <p className="mt-2 text-xs text-admin-gray-light leading-relaxed font-mono">
                {alert.message}
              </p>
            )}
            
            <div className="mt-3 flex items-center justify-between border-t border-admin-gray-dark pt-2">
              <span className="text-[10px] font-mono text-admin-gray-medium uppercase tracking-widest">
                [{alert.type}]
              </span>
              <span className="text-[10px] font-mono text-admin-gray-medium">
                {formatElapsedTime(alert.timestamp)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress bar para alertas con duración */}
        {alert.duration && alert.duration > 0 && (
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-admin-primary"
            style={{ 
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: alert.duration / 1000, ease: 'linear' }}
          />
        )}
      </div>
    </motion.div>
  );
}
