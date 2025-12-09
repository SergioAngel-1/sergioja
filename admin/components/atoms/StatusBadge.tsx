interface StatusBadgeProps {
  status: 'new' | 'read' | 'replied' | 'spam';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    new: {
      label: 'Nuevo',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30',
      glow: 'shadow-blue-400/20',
    },
    read: {
      label: 'Leído',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30',
      glow: 'shadow-yellow-400/20',
    },
    replied: {
      label: 'Respondido',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/30',
      glow: 'shadow-green-400/20',
    },
    spam: {
      label: 'Spam',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
      glow: 'shadow-red-400/20',
    },
  };

  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${config.color} ${config.bg} ${config.border} ${sizeClasses}
        transition-all duration-200
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`} />
      {config.label}
    </span>
  );
}
