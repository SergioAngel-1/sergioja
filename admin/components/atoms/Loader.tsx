interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({ 
  size = 'md', 
  variant = 'spinner',
  text,
  fullScreen = false 
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-6 h-6',
  };

  const renderSpinner = () => (
    <div className={`inline-block animate-spin rounded-full border-2 border-admin-primary/20 border-t-admin-primary ${sizeClasses[size]}`} />
  );

  const renderDots = () => (
    <div className="flex gap-2">
      <div className={`${dotSizes[size]} rounded-full bg-admin-primary animate-pulse`} style={{ animationDelay: '0ms' }} />
      <div className={`${dotSizes[size]} rounded-full bg-admin-primary animate-pulse`} style={{ animationDelay: '150ms' }} />
      <div className={`${dotSizes[size]} rounded-full bg-admin-primary animate-pulse`} style={{ animationDelay: '300ms' }} />
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} rounded-lg bg-admin-primary/20 animate-pulse-glow`} />
  );

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {variant === 'spinner' && renderSpinner()}
      {variant === 'dots' && renderDots()}
      {variant === 'pulse' && renderPulse()}
      
      {text && (
        <p className="text-text-muted text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-admin-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}
