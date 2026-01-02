'use client';

import { useState, useCallback, useEffect } from 'react';
import ExportSection from '../molecules/ExportSection';
import ExportCard from '../molecules/ExportCard';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { alerts } from '@/lib/alerts';

interface CommunicationExportsProps {
  onExport: (data: any[], filename: string, format: 'csv' | 'json') => void;
}

export default function CommunicationExports({ onExport }: CommunicationExportsProps) {
  const [stats, setStats] = useState({ messages: 0, subscribers: 0 });
  const [exportingItems, setExportingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [messagesRes, subscribersRes] = await Promise.all([
        api.getMessages(),
        api.getSubscribers(),
      ]);

      const messagesCount = messagesRes.success && messagesRes.data 
        ? (Array.isArray(messagesRes.data) ? messagesRes.data.length : 0)
        : 0;

      const subscribersCount = subscribersRes.success && subscribersRes.data
        ? (Array.isArray(subscribersRes.data) ? subscribersRes.data.length : 0)
        : 0;

      setStats({ messages: messagesCount, subscribers: subscribersCount });
    } catch (error) {
      logger.error('Error loading communication stats', error);
    }
  };

  const handleExport = useCallback(async (type: 'messages' | 'subscribers', format: 'csv' | 'json') => {
    setExportingItems(prev => ({ ...prev, [type]: true }));

    try {
      let data: any[] = [];
      let filename = '';

      switch (type) {
        case 'messages': {
          const res = await api.getMessages();
          data = res.success && res.data ? (Array.isArray(res.data) ? res.data : []) : [];
          filename = `contact-messages-${new Date().toISOString().split('T')[0]}`;
          break;
        }
        case 'subscribers': {
          const res = await api.getSubscribers();
          data = res.success && res.data ? (Array.isArray(res.data) ? res.data : []) : [];
          filename = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}`;
          break;
        }
      }

      if (!data || data.length === 0) {
        alerts.warning('Sin datos', 'No hay datos disponibles para exportar');
        return;
      }

      onExport(data, filename, format);
      alerts.success('Exportación exitosa', `Se exportaron ${data.length} registros correctamente`);
      logger.info('Export completed', { type, format, count: data.length });
    } catch (error) {
      logger.error('Export error', error);
      alerts.error('Error de exportación', 'No se pudo completar la exportación');
    } finally {
      setExportingItems(prev => ({ ...prev, [type]: false }));
    }
  }, [onExport]);

  return (
    <ExportSection
      title="Comunicación"
      description="Exporta mensajes de contacto y suscriptores de newsletter"
      icon="messages"
      delay={0.45}
    >
      <ExportCard
        title="Mensajes de Contacto"
        description="Todos los mensajes recibidos vía formulario de contacto con nombre, email, asunto, mensaje y status."
        icon="messages"
        recordCount={stats.messages}
        onExport={(format) => handleExport('messages', format)}
        isExporting={exportingItems.messages}
        delay={0.5}
      />
      <ExportCard
        title="Suscriptores Newsletter"
        description="Lista completa de suscriptores con email, fuente (main/portfolio), status y fecha de suscripción."
        icon="newsletter"
        recordCount={stats.subscribers}
        onExport={(format) => handleExport('subscribers', format)}
        isExporting={exportingItems.subscribers}
        delay={0.55}
      />
    </ExportSection>
  );
}
