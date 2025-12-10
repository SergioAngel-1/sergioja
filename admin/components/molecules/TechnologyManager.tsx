'use client';

import { useState, useEffect } from 'react';
import Icon from '../atoms/Icon';
import TechnologyForm, { TechnologyFormData } from './TechnologyForm';
import { fluidSizing } from '@/lib/fluidSizing';

interface Category {
  name: string;
  label: string;
  active: boolean;
}

interface TechnologyManagerProps {
  technologies: TechnologyFormData[];
  availableSkills: string[];
  categories: Category[];
  onChange: (technologies: TechnologyFormData[]) => void;
  label?: string;
}

export default function TechnologyManager({
  technologies,
  availableSkills,
  categories,
  onChange,
  label = 'Tecnologías',
}: TechnologyManagerProps) {
  const [techInput, setTechInput] = useState('');
  const [showTechForm, setShowTechForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [techFormData, setTechFormData] = useState<TechnologyFormData>({
    name: '',
    category: categories.length > 0 ? categories[0].name : '',
    proficiency: 50,
    yearsOfExperience: 0,
  });

  // Update default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !techFormData.category) {
      setTechFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories, techFormData.category]);

  // Filter suggestions based on input
  useEffect(() => {
    const available = availableSkills.filter(skill => 
      !technologies.find(t => t.name === skill)
    );
    
    if (techInput.trim()) {
      const filtered = available.filter(skill => 
        skill.toLowerCase().includes(techInput.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions(available);
      setShowSuggestions(false);
    }
  }, [techInput, availableSkills, technologies]);

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

  const handleSelectSuggestion = (skillName: string) => {
    const newTech: TechnologyFormData = {
      name: skillName,
      category: categories.length > 0 ? categories[0].name : 'other',
      proficiency: 50,
      yearsOfExperience: 0,
    };
    onChange([...technologies, newTech]);
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
      <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
        {label}
      </label>
      
      {!showTechForm ? (
        <>
          <div className="relative">
            <div className="flex" style={{ gap: fluidSizing.space.sm }}>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onFocus={() => filteredSuggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                className="flex-1 bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
                style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
                placeholder="Buscar o agregar tecnología..."
              />
              <button
                type="button"
                onClick={handleAddTechnology}
                className="bg-admin-primary/20 hover:bg-admin-primary/30 text-admin-primary rounded-lg transition-all duration-200 flex items-center justify-center"
                style={{ padding: fluidSizing.space.sm, minWidth: fluidSizing.size.buttonMd }}
              >
                <Icon name="plus" size={20} />
              </button>
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div 
                className="absolute z-10 w-full bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-lg overflow-hidden"
                style={{ marginTop: fluidSizing.space.xs, maxHeight: '200px', overflowY: 'auto' }}
              >
                {filteredSuggestions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSelectSuggestion(skill)}
                    className="w-full text-left px-4 py-2 hover:bg-admin-primary/20 text-text-primary transition-colors"
                    style={{ fontSize: fluidSizing.text.sm }}
                  >
                    {skill}
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
