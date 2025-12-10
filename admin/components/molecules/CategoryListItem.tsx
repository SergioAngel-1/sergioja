'use client';

import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

interface CategoryListItemProps {
  name: string;
  label: string;
  color: string;
  active: boolean;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CategoryListItem({
  name,
  label,
  color,
  active,
  onToggleActive,
  onEdit,
  onDelete,
}: CategoryListItemProps) {
  return (
    <div
      className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg flex items-center justify-between hover:border-admin-primary/50 transition-all duration-200"
      style={{ padding: fluidSizing.space.md }}
    >
      <div className="flex items-center flex-1" style={{ gap: fluidSizing.space.md }}>
        {/* Color indicator */}
        <div
          className="rounded-full flex-shrink-0"
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: color,
          }}
        />
        
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
            <span className="text-text-primary font-medium" style={{ fontSize: fluidSizing.text.base }}>
              {label}
            </span>
            {!active && (
              <span className="bg-admin-warning/20 text-admin-warning rounded" style={{ padding: `2px ${fluidSizing.space.xs}`, fontSize: fluidSizing.text.xs }}>
                Inactiva
              </span>
            )}
          </div>
          <span className="text-text-muted font-mono" style={{ fontSize: fluidSizing.text.xs }}>
            {name}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
        <button
          onClick={onToggleActive}
          className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-muted hover:text-admin-primary hover:border-admin-primary/50 transition-all duration-200 flex items-center justify-center"
          style={{ width: '36px', height: '36px' }}
          title={active ? 'Desactivar' : 'Activar'}
        >
          <Icon name={active ? 'eye' : 'eye'} size={16} />
        </button>
        <button
          onClick={onEdit}
          className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-admin-primary hover:bg-admin-primary/10 hover:border-admin-primary/50 transition-all duration-200 flex items-center justify-center"
          style={{ width: '36px', height: '36px' }}
          title="Editar"
        >
          <Icon name="edit" size={16} />
        </button>
        <button
          onClick={onDelete}
          className="bg-admin-dark-elevated border border-admin-error/20 rounded-lg text-admin-error hover:bg-admin-error/10 hover:border-admin-error/50 transition-all duration-200 flex items-center justify-center"
          style={{ width: '36px', height: '36px' }}
          title="Eliminar"
        >
          <Icon name="x" size={16} />
        </button>
      </div>
    </div>
  );
}
