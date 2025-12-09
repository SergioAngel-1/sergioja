'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loader from '@/components/atoms/Loader';
import Icon from '@/components/atoms/Icon';
import SubscriberCard from '@/components/molecules/SubscriberCard';
import StatCard from '@/components/molecules/StatCard';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';

interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export default function NewsletterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'email'>('date');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubscribers();
    }
  }, [isAuthenticated]);

  const loadSubscribers = async () => {
    try {
      setIsLoadingSubscribers(true);
      const response = await api.getSubscribers();
      
      if (response.success && response.data) {
        const subscribersData = Array.isArray(response.data)
          ? response.data
          : (response.data as any).subscribers || [];
        
        setSubscribers(subscribersData as Subscriber[]);
        logger.info('Subscribers loaded successfully', { count: subscribersData.length });
      } else {
        logger.error('Failed to load subscribers', response.error);
        setSubscribers([]);
      }
    } catch (error) {
      logger.error('Error loading subscribers', error);
      setSubscribers([]);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  const handleDelete = async (subscriberId: string) => {
    try {
      const response = await api.deleteSubscriber(subscriberId);
      
      if (response.success) {
        setSubscribers(prev => prev.filter(s => s.id !== subscriberId));
        logger.info('Subscriber deleted', { subscriberId });
      }
    } catch (error) {
      logger.error('Error deleting subscriber', error);
    }
  };

  const handleExport = () => {
    const activeEmails = subscribers
      .filter(s => s.status === 'active')
      .map(s => s.email)
      .join('\n');
    
    const blob = new Blob([activeEmails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredSubscribers = useMemo(() => {
    let filtered = [...subscribers];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.email.toLowerCase().includes(query));
    }

    filtered.sort((a, b) => {
      if (sortBy === 'email') {
        return a.email.localeCompare(b.email);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [subscribers, selectedStatus, searchQuery, sortBy]);

  const stats = useMemo(() => {
    const activeCount = subscribers.filter(s => s.status === 'active').length;
    const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;
    
    const last30Days = subscribers.filter(s => {
      const diff = Date.now() - new Date(s.createdAt).getTime();
      return diff < 30 * 24 * 60 * 60 * 1000;
    }).length;

    const last7Days = subscribers.filter(s => {
      const diff = Date.now() - new Date(s.createdAt).getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      total: subscribers.length,
      active: activeCount,
      unsubscribed: unsubscribedCount,
      last30Days,
      last7Days,
    };
  }, [subscribers]);

  if (isLoading || !isAuthenticated) {
    return <Loader fullScreen text="Cargando newsletter..." />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-admin-primary text-glow-white">
              NEWSLETTER
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Gestiona los suscriptores del newsletter
            </p>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={handleExport}
            disabled={stats.active === 0}
            className="flex items-center gap-2 px-6 py-3 bg-admin-primary text-admin-dark rounded-lg font-medium hover:bg-admin-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-admin-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="server" size={20} />
            <span>Exportar Emails</span>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <StatCard
            title="Total"
            value={stats.total}
            variant="simple"
            delay={0.1}
          />
          <StatCard
            title="Activos"
            value={stats.active}
            color="green-400"
            variant="simple"
            delay={0.15}
          />
          <StatCard
            title="Desuscritos"
            value={stats.unsubscribed}
            color="red-400"
            variant="simple"
            delay={0.2}
          />
          <StatCard
            title="Últimos 7d"
            value={stats.last7Days}
            color="blue-400"
            variant="simple"
            delay={0.25}
          />
          <StatCard
            title="Últimos 30d"
            value={stats.last30Days}
            color="purple-400"
            variant="simple"
            delay={0.3}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Icon name="code" size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por email..."
                className="w-full pl-12 pr-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="unsubscribed">Desuscritos</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'email')}
                className="px-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 cursor-pointer"
              >
                <option value="date">Ordenar por Fecha</option>
                <option value="email">Ordenar por Email</option>
              </select>
            </div>
          </div>
        </motion.div>

        {isLoadingSubscribers ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Cargando suscriptores..." />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
          >
            <Icon name="newsletter" size={64} className="text-admin-primary/30 mb-4" />
            <p className="text-text-muted text-lg mb-2">No se encontraron suscriptores</p>
            <p className="text-text-muted text-sm">
              {searchQuery || selectedStatus !== 'all'
                ? 'Intenta ajustar los filtros'
                : 'Los suscriptores aparecerán aquí cuando se suscriban al newsletter'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubscribers.map((subscriber, index) => (
              <SubscriberCard
                key={subscriber.id}
                id={subscriber.id}
                email={subscriber.email}
                status={subscriber.status}
                createdAt={new Date(subscriber.createdAt)}
                ipAddress={subscriber.ipAddress}
                userAgent={subscriber.userAgent}
                delay={index * 0.05}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
