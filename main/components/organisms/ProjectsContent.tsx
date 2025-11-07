'use client';

import { motion } from 'framer-motion';

export default function ProjectsContent() {
  const categories = [
    {
      title: 'Lo que estoy creando',
      description: 'Proyectos activos en desarrollo',
      items: [
        {
          name: 'SergioJA Portfolio',
          problem: 'Necesidad de una presencia digital que refleje mi enfoque técnico y creativo',
          approach: 'Diseño minimalista con Three.js y arquitectura modular',
          learning: 'Integración de 3D en web, optimización de rendimiento'
        }
      ]
    },
    {
      title: 'Experimentos recientes',
      description: 'Exploraciones técnicas y conceptuales',
      items: [
        {
          name: 'Sistema de diseño monocromático',
          problem: 'Crear interfaces impactantes sin depender del color',
          approach: 'Jerarquía visual mediante contraste, tipografía y espaciado',
          learning: 'El poder de la restricción en el diseño'
        }
      ]
    },
    {
      title: 'Colaboraciones abiertas',
      description: 'Proyectos donde puedes contribuir',
      items: [
        {
          name: 'Open Source Contributions',
          problem: 'Mejorar herramientas que uso diariamente',
          approach: 'Identificar pain points y proponer soluciones',
          learning: 'Trabajo colaborativo y code review'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {categories.map((category, catIndex) => (
        <motion.div
          key={catIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
          className="space-y-3"
        >
          {/* Título de categoría */}
          <div className="space-y-1">
            <h3 className="text-white font-bold text-sm">{category.title}</h3>
            <p className="text-white/60 text-xs">{category.description}</p>
            <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
          </div>

          {/* Items */}
          <div className="space-y-3">
            {category.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="group p-3 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 space-y-2"
              >
                <h4 className="text-white font-medium text-sm group-hover:text-white/90">
                  {item.name}
                </h4>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex gap-2">
                    <span className="text-white/40 font-mono">→</span>
                    <div>
                      <span className="text-white/60">Problema: </span>
                      <span className="text-white/80">{item.problem}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="text-white/40 font-mono">→</span>
                    <div>
                      <span className="text-white/60">Enfoque: </span>
                      <span className="text-white/80">{item.approach}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="text-white/40 font-mono">→</span>
                    <div>
                      <span className="text-white/60">Aprendizaje: </span>
                      <span className="text-white/80">{item.learning}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
