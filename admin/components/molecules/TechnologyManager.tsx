'use client';

import { useState, useEffect, useMemo } from 'react';
import Icon from '../atoms/Icon';
import TechnologyForm, { TechnologyFormData } from './TechnologyForm';
import { fluidSizing } from '@/lib/fluidSizing';
import { useDebounce } from '@/lib/hooks';

interface Category {
  name: string;
  label: string;
  active: boolean;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
}

interface TechnologyManagerProps {
  technologies: TechnologyFormData[];
  availableSkills: Skill[];
  categories: Category[];
  onChange: (technologies: TechnologyFormData[]) => void;
  label?: string;
  onCreateCategory?: () => void;
}

export default function TechnologyManager({
  technologies,
  availableSkills,
  categories,
  onChange,
  label = 'Tecnologías',
  onCreateCategory,
}: TechnologyManagerProps) {
  const [techInput, setTechInput] = useState('');
  const [showTechForm, setShowTechForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [techFormData, setTechFormData] = useState<TechnologyFormData>({
    name: '',
    category: categories.length > 0 ? categories[0].name : '',
    proficiency: 50,
    yearsOfExperience: 0,
  });

  // Debounce del input para optimizar filtrado (300ms)
  const debouncedTechInput = useDebounce(techInput, 300);

  // Update default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !techFormData.category) {
      setTechFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories, techFormData.category]);

  // Filter suggestions based on debounced input (optimizado con useMemo)
  const filteredSuggestions = useMemo(() => {
    const available = availableSkills.filter(skill => 
      !technologies.find(t => t.name === skill.name)
    );
    
    if (debouncedTechInput.trim()) {
      return available.filter(skill => 
        skill.name.toLowerCase().includes(debouncedTechInput.toLowerCase())
      );
    }
    
    return available;
  }, [debouncedTechInput, availableSkills, technologies]);

  // Mostrar sugerencias cuando hay input y resultados
  useEffect(() => {
    setShowSuggestions(techInput.trim().length > 0 && filteredSuggestions.length > 0);
  }, [techInput, filteredSuggestions]);

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setTechFormData({ 
        ...techFormData, 
        name: techInput.trim(),
        category: categories.length > 0 ? categories[0].name : 'other',
      });
      setShowTechForm(true);
      setTechInput('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (skill: Skill) => {
    // Agregar directamente la tecnología existente sin abrir el formulario
    const techData = {
      name: skill.name,
      category: skill.category || (categories.length > 0 ? categories[0].name : 'other'),
      proficiency: skill.proficiency || 50,
      yearsOfExperience: skill.yearsOfExperience || 0,
    };
    
    if (!technologies.find(t => t.name === techData.name)) {
      onChange([...technologies, techData]);
    }
    
    setTechInput('');
    setShowSuggestions(false);
  };

  const handleSaveTechnology = () => {
    if (techFormData.name && !technologies.find(t => t.name === techFormData.name)) {
      onChange([...technologies, { ...techFormData }]);
      setShowTechForm(false);
      setTechFormData({
        name: '',
        category: categories.length > 0 ? categories[0].name : '',
        proficiency: 50,
        yearsOfExperience: 0,
      });
    }
  };

  const handleCancelTechForm = () => {
    setShowTechForm(false);
    setTechFormData({
      name: '',
      category: categories.length > 0 ? categories[0].name : '',
      proficiency: 50,
      yearsOfExperience: 0,
    });
  };

  const handleRemoveTechnology = (techName: string) => {
    onChange(technologies.filter(t => t.name !== techName));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: fluidSizing.space.sm }}>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs }}>
          {label}
        </label>
        {onCreateCategory && (
          <button
            type="button"
            onClick={onCreateCategory}
            className="bg-admin-primary/20 hover:bg-admin-primary/30 text-admin-primary rounded-lg transition-all duration-200 flex items-center justify-center"
            style={{ padding: fluidSizing.space.sm, minWidth: fluidSizing.size.buttonMd }}
            title="Crear nueva categoría de tecnología"
          >
            <Icon name="plus" size={20} />
          </button>
        )}
      </div>
      
      {!showTechForm ? (
        <>
          <div className="relative">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onFocus={() => {
                // Mostrar sugerencias si hay disponibles, incluso con input vacío
                if (filteredSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
              className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
              placeholder="Buscar o agregar tecnología..."
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div 
                className="absolute z-10 w-full bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-lg overflow-hidden"
                style={{ marginTop: fluidSizing.space.xs, maxHeight: '200px', overflowY: 'auto' }}
              >
                {filteredSuggestions.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(skill)}
                    className="w-full text-left px-4 py-2 hover:bg-admin-primary/20 text-text-primary transition-colors"
                    style={{ fontSize: fluidSizing.text.sm }}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Technology Chips */}
          <div className="flex flex-wrap" style={{ gap: fluidSizing.space.sm, marginTop: fluidSizing.space.sm }}>
            {technologies.map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center bg-admin-primary/10 border border-admin-primary/30 text-admin-primary rounded-lg"
                style={{ gap: fluidSizing.space.xs, padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.sm }}
                title={`${tech.category} | Dominio: ${tech.proficiency}% | Exp: ${tech.yearsOfExperience} años`}
              >
                {tech.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(tech.name)}
                  className="hover:text-admin-error transition-colors"
                >
                  <Icon name="plus" size={14} className="rotate-45" />
                </button>
              </span>
            ))}
          </div>
        </>
      ) : (
        <TechnologyForm
          technology={techFormData}
          categories={categories}
          onChange={setTechFormData}
          onSave={handleSaveTechnology}
          onCancel={handleCancelTechForm}
        />
      )}
    </div>
  );
}
