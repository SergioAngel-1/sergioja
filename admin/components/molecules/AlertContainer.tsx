'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alertManager, Alert, alertStyles, alertPositions } from '@/shared/alertSystem';

export default function AlertContainer() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const unsubscribe = alertManager.subscribe((newAlerts) => {
      setAlerts(newAlerts);
    });

    return unsubscribe;
  }, []);

  // Agrupar alertas por posición
  const alertsByPosition = alerts.reduce((acc, alert) => {
    const position = alert.position || 'bottom-left';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(alert);
    return acc;
  }, {} as Record<string, Alert[]>);

  return (
    <>
      {Object.entries(alertsByPosition).map(([position, positionAlerts]) => (
        <div
          key={position}
          className="fixed z-[9999] flex flex-col gap-3 pointer-events-none"
          style={alertPositions[position as keyof typeof alertPositions]}
        >
          <AnimatePresence mode="popLayout">
            {positionAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
}

function AlertItem({ alert }: { alert: Alert }) {
  const style = alertStyles[alert.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="pointer-events-auto max-w-sm w-full"
    >
      <div
        className="rounded-lg border p-4 shadow-lg backdrop-blur-sm"
        style={{
          backgroundColor: style.bgColor,
          borderColor: style.borderColor,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 text-2xl"
            style={{ color: style.color }}
          >
            {style.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className="font-orbitron font-bold text-sm mb-1"
              style={{ color: style.color }}
            >
              {alert.title}
            </h4>
            {alert.message && (
              <p className="text-text-secondary text-sm">{alert.message}</p>
            )}
          </div>
          {alert.dismissible && (
            <button
              onClick={() => alertManager.remove(alert.id)}
              className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
