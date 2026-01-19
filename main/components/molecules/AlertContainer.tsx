'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';
import { useAlerts } from '@/shared/hooks/useAlerts';
import { alerts as alertsAPI, alertStyles, type Alert, type AlertPosition } from '@/shared/alertSystem';
import { groupAlertsByPosition, formatElapsedTime } from '@/shared/alertHelpers';

const AlertItem = forwardRef<HTMLDivElement, { alert: Alert }>(function AlertItem({ alert }, ref) {
  const style = alertStyles[alert.type];
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative bg-[#0a0a0a]/95 backdrop-blur-md rounded-none shadow-lg sm:shadow-2xl overflow-hidden w-[88vw] max-w-[380px] sm:min-w-[320px] sm:max-w-[400px] border-l sm:border-l-2 border-white"
      style={{
        boxShadow: `0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.5)`,
      }}
    >
      <div className="p-3 sm:p-4 relative">
        {/* Cyberpunk grid overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="flex items-start gap-2 sm:gap-3 relative z-10">
          {/* Icon */}
          <div 
            className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-none flex items-center justify-center font-bold text-sm sm:text-lg border border-white/30 text-white/80"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            {style.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-orbitron font-bold text-xs sm:text-sm text-white tracking-wide uppercase">
                {alert.title}
              </h4>
              
              {alert.dismissible && (
                <button
                  onClick={() => alertsAPI.dismiss(alert.id)}
                  className="flex-shrink-0 w-5 h-5 rounded-none hover:bg-white/10 flex items-center justify-center transition-all group border border-white/20 hover:border-white/40"
                  aria-label="Cerrar alerta"
                >
                  <svg className="w-3 h-3 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {alert.message && (
              <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-white/70 leading-relaxed font-mono">
                {alert.message}
              </p>
            )}
            
            <div className="mt-2 sm:mt-3 flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                [{alert.type}]
              </span>
              <span className="text-[10px] font-mono text-white/40">
                {formatElapsedTime(alert.timestamp)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress bar cyberpunk para alertas con duración */}
        {alert.duration && alert.duration > 0 && (
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] sm:h-[2px] bg-white/60"
            style={{ 
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
            }}
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
  const inset = 'clamp(0.5rem, 3vw, 1rem)';
  const positionStyle: React.CSSProperties = (() => {
    switch (position) {
      case 'top-left':
        return { top: `calc(${inset} + env(safe-area-inset-top))`, left: `calc(${inset} + env(safe-area-inset-left))` };
      case 'top-right':
        return { top: `calc(${inset} + env(safe-area-inset-top))`, right: `calc(${inset} + env(safe-area-inset-right))` };
      case 'bottom-left':
        return { bottom: `calc(${inset} + env(safe-area-inset-bottom))`, left: `calc(${inset} + env(safe-area-inset-left))` };
      case 'bottom-right':
        return { bottom: `calc(${inset} + env(safe-area-inset-bottom))`, right: `calc(${inset} + env(safe-area-inset-right))` };
      case 'top-center':
        return { top: `calc(${inset} + env(safe-area-inset-top))` };
      case 'bottom-center':
        return { bottom: `calc(${inset} + env(safe-area-inset-bottom))` };
      default:
        return {};
    }
  })();

  // Extra classes to keep centered groups centered
  const centerClasses = position.includes('center') ? 'left-1/2 -translate-x-1/2' : '';

  return (
    <div className={`fixed z-[70] flex flex-col gap-2 sm:gap-3 ${centerClasses}`} style={positionStyle}>
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function AlertContainer({ defaultPosition = 'bottom-left' }: { defaultPosition?: AlertPosition }) {
  const alerts = useAlerts();
  
  // Aplicar posición por defecto a alertas sin posición especificada
  const alertsWithPosition = alerts.map(alert => ({
    ...alert,
    position: alert.position || defaultPosition
  }));
  
  const groupedAlerts = groupAlertsByPosition(alertsWithPosition);

  return (
    <>
      {Array.from(groupedAlerts.entries()).map(([position, positionAlerts]) => (
        <AlertGroup key={position} position={position} alerts={positionAlerts} />
      ))}
    </>
  );
}
