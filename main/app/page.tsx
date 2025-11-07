'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import HexButton from '@/components/atoms/HexButton';
import Modal from '@/components/molecules/Modal';
import DataStream from '@/components/atoms/DataStream';
import HexagonGrid from '@/components/atoms/HexagonGrid';
import CenteredHero from '@/components/molecules/CenteredHero';

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handlePortfolioClick = () => {
    window.location.href = 'http://localhost:3000';
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 cyber-grid opacity-10 z-0" />
      <div className="absolute inset-0 z-0">
        <HexagonGrid />
      </div>
      
      {/* Data streams */}
      <div className="absolute inset-0 z-0">
        <DataStream position="left" />
        <DataStream position="right" />
      </div>

      {/* Hex Buttons - Botones esquineros */}
      <HexButton
        position="top-left"
        label="NAVEGACIÓN"
        delay={0.2}
        onClick={() => setActiveModal(activeModal === 'navigation' ? null : 'navigation')}
        isActive={activeModal === 'navigation'}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        }
      />

      <HexButton
        position="top-right"
        label="SERVICIOS"
        delay={0.3}
        onClick={() => setActiveModal(activeModal === 'services' ? null : 'services')}
        isActive={activeModal === 'services'}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        }
      />

      <HexButton
        position="bottom-left"
        label="TECH STACK"
        delay={0.4}
        onClick={() => setActiveModal(activeModal === 'tech' ? null : 'tech')}
        isActive={activeModal === 'tech'}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        }
      />

      <HexButton
        position="bottom-right"
        label="CONTACTO"
        delay={0.5}
        onClick={() => setActiveModal(activeModal === 'contact' ? null : 'contact')}
        isActive={activeModal === 'contact'}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      />

      {/* Modales */}
      <Modal
        isOpen={activeModal === 'navigation'}
        onClose={closeModal}
        title="NAVEGACIÓN"
        position="top-left"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        }
      >
        <div className="space-y-1">
          <button
            onClick={() => {
              handlePortfolioClick();
              closeModal();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-white/70 group-hover:text-white transition-all group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-white/80 group-hover:text-white transition-colors">Portfolio</span>
            <svg className="w-3 h-3 ml-auto text-white/50 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-white/70 group-hover:text-white transition-all group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-white/80 group-hover:text-white transition-colors">GitHub</span>
            <svg className="w-3 h-3 ml-auto text-white/50 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-white/70 group-hover:text-white transition-all group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="text-white/80 group-hover:text-white transition-colors">LinkedIn</span>
            <svg className="w-3 h-3 ml-auto text-white/50 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href="mailto:sergiojauregui22@gmail.com"
            className="flex items-center gap-2.5 px-3 py-2.5 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-white/70 group-hover:text-white transition-all group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-white/80 group-hover:text-white transition-colors">Email</span>
            <svg className="w-3 h-3 ml-auto text-white/50 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[10px] text-white/50">SergioJA</span>
            <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
            <span className="text-[10px] text-white/50">2025</span>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'services'}
        onClose={closeModal}
        title="SERVICIOS"
        position="top-right"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        }
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
            <div>
              <div className="font-bold mb-0.5">Desarrollo Full Stack</div>
              <div className="text-[10px] opacity-60">Aplicaciones web modernas y escalables</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
            <div>
              <div className="font-bold mb-0.5">Arquitectura de Software</div>
              <div className="text-[10px] opacity-60">Diseño de sistemas robustos y mantenibles</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
            <div>
              <div className="font-bold mb-0.5">Consultoría Técnica</div>
              <div className="text-[10px] opacity-60">Asesoramiento en tecnología y mejores prácticas</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
            <div>
              <div className="font-bold mb-0.5">UI/UX Design</div>
              <div className="text-[10px] opacity-60">Interfaces intuitivas y experiencias memorables</div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'tech'}
        onClose={closeModal}
        title="TECH STACK"
        position="bottom-left"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-white/5 border border-white/20 hover:border-white/40 transition-colors">
            <div className="font-bold text-[11px]">React</div>
            <div className="text-[9px] opacity-50 mt-0.5">UI Library</div>
          </div>
          <div className="text-center p-2 bg-white/5 border border-white/20 hover:border-white/40 transition-colors">
            <div className="font-bold text-[11px]">Next.js</div>
            <div className="text-[9px] opacity-50 mt-0.5">Framework</div>
          </div>
          <div className="text-center p-2 bg-white/5 border border-white/20 hover:border-white/40 transition-colors">
            <div className="font-bold text-[11px]">Node.js</div>
            <div className="text-[9px] opacity-50 mt-0.5">Runtime</div>
          </div>
          <div className="text-center p-2 bg-white/5 border border-white/20 hover:border-white/40 transition-colors">
            <div className="font-bold text-[11px]">TypeScript</div>
            <div className="text-[9px] opacity-50 mt-0.5">Language</div>
          </div>
          <div className="text-center p-2 bg-white/5 border border-white/20 hover:border-white/40 transition-colors">
            <div className="font-bold text-[11px]">Prisma</div>
            <div className="text-[9px] opacity-50 mt-0.5">ORM</div>
          </div>
          <div className="text-center p-2 bg-white/5 border border-white/20 hover:border-white/40 transition-colors">
            <div className="font-bold text-[11px]">Three.js</div>
            <div className="text-[9px] opacity-50 mt-0.5">3D Graphics</div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'contact'}
        onClose={closeModal}
        title="CONTACTO"
        position="bottom-right"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      >
        <div className="space-y-3">
          <div>
            <div className="text-[10px] opacity-60 mb-1 uppercase tracking-wide">Email</div>
            <a href="mailto:sergio@sergioja.com" className="font-semibold hover:text-white transition-colors">
              sergio@sergioja.com
            </a>
          </div>
          <div>
            <div className="text-[10px] opacity-60 mb-1 uppercase tracking-wide">LinkedIn</div>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-white transition-colors">
              @SergioJA
            </a>
          </div>
          <div>
            <div className="text-[10px] opacity-60 mb-1 uppercase tracking-wide">GitHub</div>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-white transition-colors">
              @SergioAngel
            </a>
          </div>
        </div>
      </Modal>

      {/* Main content */}
      <main className="relative z-20">
        <CenteredHero />
      </main>

      {/* Floating particles - white dots */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: '#FFFFFF',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 15 - 7.5, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Scanline effect - CRT style */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
          backgroundSize: '100% 4px',
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Vignette effect - darker edges */}
      <div className="absolute inset-0 pointer-events-none z-30" 
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)'
        }}
      />
    </div>
  );
}