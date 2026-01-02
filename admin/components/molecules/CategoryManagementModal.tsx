'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from '../atoms/Button';
import CategoryListItem from './CategoryListItem';
import { fluidSizing } from '@/lib/fluidSizing';
import { alerts } from '@/lib/alerts';
import { api } from '@/lib/api-client';

interface Category {
  id?: string;
  name: string;
  label: string;
  color: string;
  icon?: string;
  order: number;
  active: boolean;
}

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'project' | 'technology';
}

export default function CategoryManagementModal({
  isOpen,
  onClose,
  type,
}: CategoryManagementModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Category>({
    name: '',
    label: '',
    color: '#FFFFFF',
    icon: '',
    order: 0,
    active: true,
  });

  // Cargar categorías existentes
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, type]);

  const loadCategories = async () => {
    try {
      const response = type === 'project' 
        ? await api.getProjectCategories()
        : await api.getTechnologyCategories();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
        if (response.error) {
          alerts.error('Error', response.error.message || 'Error al cargar categorías');
        }
      }
    } catch (error) {
      alerts.error('Error', 'Error al cargar categorías');
      setCategories([]);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingCategory(null);
    setFormData({
      name: '',
      label: '',
      color: '#FFFFFF',
      icon: '',
      order: categories.length + 1,
      active: true,
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.label) {
      alerts.error('Campos requeridos', 'El nombre y la etiqueta son obligatorios');
      return;
    }

    try {
      let response;
      
      if (isAddingNew) {
        // Crear nueva categoría
        response = await api.createCategory(type === 'project' ? 'projects' : 'technologies', formData as unknown as Record<string, unknown>);
      } else if (editingCategory && editingCategory.id) {
        // Actualizar categoría existente
        response = await api.updateCategory(
          type === 'project' ? 'projects' : 'technologies',
          editingCategory.id,
          formData as unknown as Record<string, unknown>
        );
      }
      
      if (response?.success) {
        alerts.success('Éxito', isAddingNew ? 'Categoría creada exitosamente' : 'Categoría actualizada exitosamente');
        loadCategories();
      } else if (response?.error) {
        alerts.error('Error', response.error.message || 'Error al guardar categoría');
      }

      setIsAddingNew(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        label: '',
        color: '#00FF00',
        icon: '',
        order: 0,
        active: true,
      });
    } catch (error) {
      alerts.error('Error', 'Error al guardar categoría');
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      label: '',
      color: '#00FF00',
      icon: '',
      order: 0,
      active: true,
    });
  };

  const handleToggleActive = async (category: Category) => {
    if (!category.id) return;

    try {
      const response = await api.updateCategory(
        type === 'project' ? 'projects' : 'technologies',
        category.id,
        { ...category, active: !category.active }
      );
      
      if (response.success) {
        alerts.success('Éxito', `Categoría ${!category.active ? 'activada' : 'desactivada'} exitosamente`);
        loadCategories();
      } else if (response.error) {
        alerts.error('Error', response.error.message || 'Error al cambiar estado de categoría');
      }
    } catch (error) {
      alerts.error('Error', 'Error al cambiar estado de categoría');
    }
  };

  const handleDelete = async (category: Category) => {
    if (!category.id) return;

    alerts.confirm(
      'Eliminar categoría',
      `¿Estás seguro de eliminar la categoría "${category.label}"?`,
      async () => {
        try {
          const response = await api.deleteCategory(
            type === 'project' ? 'projects' : 'technologies',
            category.id!
          );
          
          if (response.success) {
            alerts.success('Éxito', 'Categoría eliminada exitosamente');
            loadCategories();
          } else if (response.error) {
            alerts.error('Error', response.error.message || 'Error al eliminar categoría');
          }
        } catch (error) {
          alerts.error('Error', 'Error al eliminar categoría');
        }
      }
    );
  };

  const title = type === 'project' ? 'Gestionar Categorías de Proyectos' : 'Gestionar Categorías de Tecnologías';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="2xl"
      footer={
        <Button
          type="button"
          onClick={onClose}
          variant="secondary"
          size="md"
          fullWidth
        >
          Cerrar
        </Button>
      }
    >
      <div style={{ padding: fluidSizing.space.lg, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }}>
        {/* Botón agregar nueva categoría */}
        {!isAddingNew && !editingCategory && (
          <Button
            type="button"
            onClick={handleAddNew}
            variant="primary"
            size="md"
            icon="plus"
          >
            Agregar Nueva Categoría
          </Button>
        )}

        {/* Formulario de edición/creación */}
        {(isAddingNew || editingCategory) && (
          <div className="bg-admin-dark-surface border border-admin-primary/30 rounded-lg" style={{ padding: fluidSizing.space.md }}>
            <h3 className="text-admin-primary font-medium" style={{ fontSize: fluidSizing.text.lg, marginBottom: fluidSizing.space.md }}>
              {isAddingNew ? 'Nueva Categoría' : 'Editar Categoría'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
              {/* Name (ID) */}
              <div>
                <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                  ID (nombre técnico) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  disabled={!isAddingNew}
                  className="w-full bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
                  placeholder="web, mobile, ai..."
                />
              </div>

              {/* Label */}
              <div>
                <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                  Etiqueta (nombre visible) *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
                  placeholder="Web, Mobile, IA..."
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                  Color
                </label>
                <div className="flex" style={{ gap: fluidSizing.space.sm }}>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20 rounded-lg border border-admin-primary/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 font-mono"
                    style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.sm }}
                    placeholder="#00FF00"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex" style={{ gap: fluidSizing.space.sm }}>
                <Button
                  type="button"
                  onClick={handleSave}
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={!formData.name || !formData.label}
                >
                  {isAddingNew ? 'Crear' : 'Guardar'}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de categorías - Solo mostrar cuando NO se esté editando/creando */}
        {!isAddingNew && !editingCategory && (
          <div>
            <h3 className="text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.md }}>
              Categorías Existentes ({categories.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
              {categories.map((category) => (
                <CategoryListItem
                  key={category.name}
                  name={category.name}
                  label={category.label}
                  color={category.color}
                  active={category.active}
                  onToggleActive={() => handleToggleActive(category)}
                  onEdit={() => handleEdit(category)}
                  onDelete={() => handleDelete(category)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
