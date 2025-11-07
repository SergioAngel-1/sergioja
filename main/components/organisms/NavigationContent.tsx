'use client';

interface NavigationContentProps {
  onNavigate?: (modal: string) => void;
}

export default function NavigationContent({ onNavigate }: NavigationContentProps) {
  const handlePortfolioClick = () => {
    window.location.href = 'http://localhost:3000';
  };

  const handleSecondaryClick = (modal: string) => {
    if (onNavigate) {
      onNavigate(modal);
    }
  };

  const secondaryLinks = [
    { label: 'Identidad', modal: 'identity' },
    { label: 'Proyectos', modal: 'projects' },
    { label: 'Conexión', modal: 'connection' },
  ];

  return (
    <div className="space-y-4">
      {/* Opción principal: Portfolio */}
      <button
        onClick={handlePortfolioClick}
        className="group w-full flex items-center gap-4 p-4 rounded-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300"
      >
        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-white font-bold text-base">Portfolio</h3>
          <p className="text-white/60 text-xs mt-0.5">Ver trabajos y proyectos completos</p>
        </div>
        <svg className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-black px-2 text-white/40 font-mono">SECCIONES</span>
        </div>
      </div>

      {/* Enlaces secundarios */}
      <div className="grid grid-cols-3 gap-2">
        {secondaryLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => handleSecondaryClick(link.modal)}
            className="group flex flex-col items-center gap-1.5 p-2 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
          >
            <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
            <span className="text-white/70 group-hover:text-white text-[10px] font-medium text-center leading-tight">
              {link.label}
            </span>
          </button>
        ))}
      </div>

      {/* Nota informativa */}
      <div className="pt-2 border-t border-white/10">
        <p className="text-white/40 text-[10px] text-center leading-relaxed">
          Haz clic para ver cada sección
        </p>
      </div>
    </div>
  );
}
