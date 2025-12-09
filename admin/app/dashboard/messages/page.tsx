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
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'spam';
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
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
          : (response.data as any).messages || [];
        
        setMessages(messagesData as Message[]);
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

  const handleMessageClick = async (message: Message) => {
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
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-admin-primary text-glow-white">
            MENSAJES DE CONTACTO
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Gestiona los mensajes recibidos desde Portfolio y Landing
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
                placeholder="Buscar mensajes..."
                className="w-full pl-12 pr-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="new">Nuevos</option>
                <option value="read">Leídos</option>
                <option value="replied">Respondidos</option>
                <option value="spam">Spam</option>
              </select>

              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 cursor-pointer"
              >
                <option value="all">Todas las fuentes</option>
                <option value="portfolio">Portfolio</option>
                <option value="landing">Landing</option>
              </select>
            </div>
          </div>
        </motion.div>

        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Cargando mensajes..." />
          </div>
        ) : filteredMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
          >
            <Icon name="messages" size={64} className="text-admin-primary/30 mb-4" />
            <p className="text-text-muted text-lg mb-2">No se encontraron mensajes</p>
            <p className="text-text-muted text-sm">
              {searchQuery || selectedStatus !== 'all' || selectedSource !== 'all'
                ? 'Intenta ajustar los filtros'
                : 'Los mensajes aparecerán aquí cuando los usuarios te contacten'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
