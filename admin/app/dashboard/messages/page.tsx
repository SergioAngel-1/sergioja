'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loader from '@/components/atoms/Loader';
import Icon from '@/components/atoms/Icon';
import MessageCard from '@/components/molecules/MessageCard';
import MessageDetailModal from '@/components/molecules/MessageDetailModal';
import StatCard from '@/components/molecules/StatCard';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { fluidSizing } from '@/lib/fluidSizing';
import { ContactSubmission } from '@/lib/types';

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
    }
  }, [isAuthenticated]);

  const loadMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const response = await api.getMessages();
      
      if (response.success && response.data) {
        const messagesData = Array.isArray(response.data)
          ? response.data
          : (response.data as { messages?: ContactSubmission[] }).messages || [];
        
        setMessages(messagesData as ContactSubmission[]);
        logger.info('Messages loaded successfully', { count: messagesData.length });
      } else {
        logger.error('Failed to load messages', response.error);
        setMessages([]);
      }
    } catch (error) {
      logger.error('Error loading messages', error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleStatusChange = async (messageId: string, newStatus: 'new' | 'read' | 'replied' | 'spam') => {
    try {
      const response = await api.updateMessageStatus(messageId, newStatus);
      
      if (response.success) {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: newStatus } : m));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null);
        }
        logger.info('Message status updated', { messageId, newStatus });
      }
    } catch (error) {
      logger.error('Error updating message status', error);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      const response = await api.deleteMessage(messageId);
      
      if (response.success) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        logger.info('Message deleted', { messageId });
      }
    } catch (error) {
      logger.error('Error deleting message', error);
    }
  };

  const handleMessageClick = async (message: ContactSubmission) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    
    if (message.status === 'new') {
      await handleStatusChange(message.id, 'read');
    }
  };

  const getMessageSource = (subject: string): 'portfolio' | 'landing' => {
    return subject.toLowerCase().includes('landing') ? 'landing' : 'portfolio';
  };

  const filteredMessages = useMemo(() => {
    let filtered = [...messages];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(m => m.status === selectedStatus);
    }

    if (selectedSource !== 'all') {
      const isLanding = selectedSource === 'landing';
      filtered = filtered.filter(m => {
        const source = getMessageSource(m.subject);
        return isLanding ? source === 'landing' : source === 'portfolio';
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.subject.toLowerCase().includes(query) ||
        m.message.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [messages, selectedStatus, selectedSource, searchQuery]);

  const stats = useMemo(() => {
    const newCount = messages.filter(m => m.status === 'new').length;
    const readCount = messages.filter(m => m.status === 'read').length;
    const repliedCount = messages.filter(m => m.status === 'replied').length;
    const spamCount = messages.filter(m => m.status === 'spam').length;

    return { total: messages.length, newCount, readCount, repliedCount, spamCount };
  }, [messages]);

  if (isLoading || !isAuthenticated) {
    return <Loader fullScreen text="Cargando mensajes..." />;
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xl }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: `clamp(1.75rem, 5vw, 2.5rem)` }}>
            MENSAJES
          </h1>
          <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs }}>
            Gestiona los mensajes de contacto
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ gap: fluidSizing.space.md }}>
          <StatCard
            title="Total"
            value={stats.total}
            variant="simple"
            delay={0.1}
          />
          <StatCard
            title="Nuevos"
            value={stats.newCount}
            color="blue-400"
            variant="simple"
            delay={0.15}
          />
          <StatCard
            title="Leídos"
            value={stats.readCount}
            color="yellow-400"
            variant="simple"
            delay={0.2}
          />
          <StatCard
            title="Respondidos"
            value={stats.repliedCount}
            color="green-400"
            variant="simple"
            delay={0.25}
          />
          <StatCard
            title="Spam"
            value={stats.spamCount}
            color="red-400"
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
              placeholder="Buscar mensajes..."
              icon="messages"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: fluidSizing.space.sm }}>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: 'all', label: 'Todos los estados' },
                  { value: 'new', label: 'Nuevos' },
                  { value: 'read', label: 'Leídos' },
                  { value: 'replied', label: 'Respondidos' },
                  { value: 'spam', label: 'Spam' },
                ]}
                label="Estado"
              />

              <Select
                value={selectedSource}
                onChange={setSelectedSource}
                options={[
                  { value: 'all', label: 'Todas las fuentes' },
                  { value: 'portfolio', label: 'Portfolio' },
                  { value: 'landing', label: 'Landing' },
                ]}
                label="Fuente"
              />
            </div>
          </div>
        </motion.div>

        {isLoadingMessages ? (
          <div className="flex items-center justify-center" style={{ padding: `${fluidSizing.space['2xl']} 0` }}>
            <Loader size="lg" text="Cargando mensajes..." />
          </div>
        ) : filteredMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
            style={{ padding: fluidSizing.space['2xl'] }}
          >
            <div style={{ marginBottom: fluidSizing.space.md }}>
              <Icon name="messages" size={64} className="text-admin-primary/30" />
            </div>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.lg, marginBottom: fluidSizing.space.sm }}>No se encontraron mensajes</p>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm }}>
              {searchQuery || selectedStatus !== 'all' || selectedSource !== 'all'
                ? 'Intenta ajustar los filtros'
                : 'Los mensajes aparecerán aquí cuando los usuarios te contacten'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: fluidSizing.space.lg }}>
            {filteredMessages.map((message, index) => (
              <MessageCard
                key={message.id}
                id={message.id}
                name={message.name}
                email={message.email}
                subject={message.subject}
                message={message.message}
                status={message.status}
                createdAt={new Date(message.createdAt)}
                source={getMessageSource(message.subject)}
                delay={index * 0.05}
                onClick={() => handleMessageClick(message)}
              />
            ))}
          </div>
        )}
      </div>

      <MessageDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={selectedMessage ? {
          ...selectedMessage,
          createdAt: new Date(selectedMessage.createdAt)
        } : null}
        source={selectedMessage ? getMessageSource(selectedMessage.subject) : 'portfolio'}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  );
}
