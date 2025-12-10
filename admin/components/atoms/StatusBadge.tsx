import Icon from './Icon';

interface StatusBadgeProps {
  status: 'new' | 'read' | 'replied' | 'spam';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    new: {
      label: 'Nuevo',
      icon: 'messages',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30',
      glow: 'shadow-blue-400/20',
    },
    read: {
      label: 'Leído',
      icon: 'eye',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30',
      glow: 'shadow-yellow-400/20',
    },
    replied: {
      label: 'Respondido',
      icon: 'check',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/30',
      glow: 'shadow-green-400/20',
    },
    spam: {
      label: 'Spam',
      icon: 'x',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
      glow: 'shadow-red-400/20',
    },
  };

  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${config.color} ${config.bg} ${config.border} ${sizeClasses}
        transition-all duration-200
      `}
    >
      <Icon name={config.icon} size={iconSize} />
      {config.label}
    </span>
  );
}
