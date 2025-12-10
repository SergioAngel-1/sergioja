'use client';

import { fluidSizing } from '@/lib/fluidSizing';

interface ProjectScoresFieldsProps {
  performanceScore: number | null;
  accessibilityScore: number | null;
  seoScore: number | null;
  onPerformanceScoreChange: (score: number | null) => void;
  onAccessibilityScoreChange: (score: number | null) => void;
  onSeoScoreChange: (score: number | null) => void;
}

export default function ProjectScoresFields({
  performanceScore,
  accessibilityScore,
  seoScore,
  onPerformanceScoreChange,
  onAccessibilityScoreChange,
  onSeoScoreChange,
}: ProjectScoresFieldsProps) {
  const handleScoreChange = (
    value: string,
    onChange: (score: number | null) => void
  ) => {
    if (value === '') {
      onChange(null);
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onChange(numValue);
    }
  };

  return (
    <div>
      <label 
        className="block text-text-muted font-medium uppercase tracking-wider" 
        style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}
      >
        Puntajes de Calidad (0-100)
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: fluidSizing.space.md }}>
        {/* Performance Score */}
        <div>
          <label 
            htmlFor="performanceScore" 
            className="block text-text-secondary" 
            style={{ fontSize: fluidSizing.text.sm, marginBottom: fluidSizing.space.xs }}
          >
            Performance
          </label>
          <input
            type="number"
            id="performanceScore"
            min="0"
            max="100"
            value={performanceScore ?? ''}
            onChange={(e) => handleScoreChange(e.target.value, onPerformanceScoreChange)}
            placeholder="0-100"
            className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-admin-primary transition-colors"
            style={{ 
              padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, 
              fontSize: fluidSizing.text.base 
            }}
          />
        </div>

        {/* Accessibility Score */}
        <div>
          <label 
            htmlFor="accessibilityScore" 
            className="block text-text-secondary" 
            style={{ fontSize: fluidSizing.text.sm, marginBottom: fluidSizing.space.xs }}
          >
            Accesibilidad
          </label>
          <input
            type="number"
            id="accessibilityScore"
            min="0"
            max="100"
            value={accessibilityScore ?? ''}
            onChange={(e) => handleScoreChange(e.target.value, onAccessibilityScoreChange)}
            placeholder="0-100"
            className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-admin-primary transition-colors"
            style={{ 
              padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, 
              fontSize: fluidSizing.text.base 
            }}
          />
        </div>

        {/* SEO Score */}
        <div>
          <label 
            htmlFor="seoScore" 
            className="block text-text-secondary" 
            style={{ fontSize: fluidSizing.text.sm, marginBottom: fluidSizing.space.xs }}
          >
            SEO
          </label>
          <input
            type="number"
            id="seoScore"
            min="0"
            max="100"
            value={seoScore ?? ''}
            onChange={(e) => handleScoreChange(e.target.value, onSeoScoreChange)}
            placeholder="0-100"
            className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-admin-primary transition-colors"
            style={{ 
              padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, 
              fontSize: fluidSizing.text.base 
            }}
          />
        </div>
      </div>
      
      <p 
        className="text-text-muted" 
        style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}
      >
        Opcional: Puntajes de rendimiento, accesibilidad y SEO (basados en Lighthouse o similar)
      </p>
    </div>
  );
}
