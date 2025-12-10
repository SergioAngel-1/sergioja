'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loader from '@/components/atoms/Loader';
import Icon from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';
import SubscriberCard from '@/components/molecules/SubscriberCard';
import StatCard from '@/components/molecules/StatCard';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { fluidSizing } from '@/lib/fluidSizing';
import { NewsletterSubscription } from '@/lib/types';

export default function NewsletterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'email'>('date');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
          : (response.data as { subscribers?: NewsletterSubscription[] }).subscribers || [];
        
        setSubscribers(subscribersData as NewsletterSubscription[]);
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
        if (expandedId === subscriberId) {
          setExpandedId(null);
        }
      }
    } catch (error) {
      logger.error('Error deleting subscriber', error);
    }
  };

  const handleToggleExpand = async (subscriberId: string) => {
    const newExpandedId = expandedId === subscriberId ? null : subscriberId;
    setExpandedId(newExpandedId);
    
    // Si se está expandiendo (no colapsando) y no está leído, marcarlo como leído
    if (newExpandedId) {
      const subscriber = subscribers.find(s => s.id === subscriberId);
      if (subscriber && !subscriber.isRead) {
        try {
          await api.markSubscriberAsRead(subscriberId, true);
          // Actualizar el estado local
          setSubscribers(prev => prev.map(s => 
            s.id === subscriberId ? { ...s, isRead: true } : s
          ));
        } catch (error) {
          console.error('Error marking subscriber as read:', error);
        }
      }
    }
  };

  const handleToggleRead = async (subscriberId: string, isRead: boolean) => {
    try {
      await api.markSubscriberAsRead(subscriberId, isRead);
      // Actualizar el estado local
      setSubscribers(prev => prev.map(s => 
        s.id === subscriberId ? { ...s, isRead } : s
      ));
    } catch (error) {
      logger.error('Error toggling read status', error);
      throw error;
    }
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xl }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          style={{ gap: fluidSizing.space.md }}
        >
          <div className="flex-1">
            <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: `clamp(1.75rem, 5vw, 2.5rem)` }}>
              NEWSLETTER
            </h1>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs }}>
              Gestiona los suscriptores del newsletter
            </p>
          </div>

        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-5" style={{ gap: fluidSizing.space.md }}>
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
          style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}
        >
          <div className="flex flex-col" style={{ gap: fluidSizing.space.sm }}>
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Buscar por email..."
              icon="newsletter"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: fluidSizing.space.sm }}>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'active', label: 'Activos' },
                  { value: 'unsubscribed', label: 'Desuscritos' },
                ]}
                label="Estado"
              />

              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value as 'date' | 'email')}
                options={[
                  { value: 'date', label: 'Ordenar por Fecha' },
                  { value: 'email', label: 'Ordenar por Email' },
                ]}
                label="Ordenar"
              />
            </div>
          </div>
        </motion.div>

        {isLoadingSubscribers ? (
          <div className="flex items-center justify-center" style={{ padding: `${fluidSizing.space['2xl']} 0` }}>
            <Loader size="lg" text="Cargando suscriptores..." />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
            style={{ padding: fluidSizing.space['2xl'] }}
          >
            <div style={{ marginBottom: fluidSizing.space.md }}>
              <Icon name="newsletter" size={64} className="text-admin-primary/30" />
            </div>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.lg, marginBottom: fluidSizing.space.sm }}>No se encontraron suscriptores</p>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm }}>
              {searchQuery || selectedStatus !== 'all'
                ? 'Intenta ajustar los filtros'
                : 'Los suscriptores aparecerán aquí cuando se suscriban al newsletter'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start" style={{ gap: fluidSizing.space.lg }}>
            {filteredSubscribers.map((subscriber, index) => (
              <SubscriberCard
                key={subscriber.id}
                id={subscriber.id}
                email={subscriber.email}
                status={subscriber.status}
                source={subscriber.source}
                isRead={subscriber.isRead}
                createdAt={new Date(subscriber.createdAt)}
                ipAddress={subscriber.ipAddress}
                userAgent={subscriber.userAgent}
                delay={index * 0.05}
                onDelete={handleDelete}
                onToggleRead={handleToggleRead}
                isExpanded={expandedId === subscriber.id}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
