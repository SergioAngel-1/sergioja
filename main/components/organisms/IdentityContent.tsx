'use client';

import { motion } from 'framer-motion';

export default function IdentityContent() {
  return (
    <div className="space-y-6">
      {/* Tagline principal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold text-white">
          Explorando el punto donde la tecnología se encuentra con las ideas
        </h3>
        <div className="h-px bg-gradient-to-r from-white/50 via-white/20 to-transparent" />
      </motion.div>

      {/* Visión */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 text-white/80 text-sm leading-relaxed"
      >
        <p>
          Creo en la tecnología como herramienta para materializar ideas que impacten positivamente. 
          Mi enfoque está en crear experiencias digitales que combinen funcionalidad con diseño intencional.
        </p>
        <p>
          Me motiva resolver problemas complejos con soluciones elegantes, siempre buscando el equilibrio 
          entre innovación técnica y experiencia humana.
        </p>
        <p>
          Cada proyecto es una oportunidad para aprender, experimentar y contribuir al ecosistema tecnológico 
          con código limpio y arquitecturas escalables.
        </p>
      </motion.div>

      {/* Avatar/Símbolo visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center py-4"
      >
        <div className="relative">
          {/* Hexágono decorativo */}
          <svg width="80" height="80" viewBox="0 0 100 100" className="opacity-20">
            <polygon
              points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          {/* Iniciales */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">SJ</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
