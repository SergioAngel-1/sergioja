'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones
const translations = {
  es: {
    // Navbar
    'nav.home': 'INICIO',
    'nav.work': 'TRABAJO',
    'nav.projects': 'PROYECTOS',
    'nav.about': 'ACERCA DE',
    'nav.contact': 'CONTACTO',
    // Common
    'common.previous': 'Anterior',
    'common.next': 'Siguiente',
    'common.page': 'Página',
    'common.of': 'de',
    'common.back': 'Volver',
    'common.cancel': 'Cancelar',
    
    // Home
    'home.title': 'FULL STACK',
    'home.developer': 'DESARROLLADOR',
    'home.automation': 'AUTOMATIZACIÓN',
    'home.engineer': 'ESCALABILIDAD',
    'home.scalability': 'ESCALABILIDAD',
    'home.integration': 'INTEGRACIÓN TECNOLÓGICA',
    'home.portfolioLabel': 'PORTAFOLIO v2.0',
    'home.tagline': 'Creo en la tecnología como una herramienta estratégica para generar valor, optimizar procesos y potenciar la toma de decisiones a través de soluciones escalables, automatizadas y sostenibles.',
    'home.viewProjects': 'Ver Proyectos',
    'home.contact': 'Contactar',
    'home.available': 'Disponible para nuevos proyectos',
    'home.focus': 'Enfoque',
    'home.focusTech': 'Enfoque técnico',
    'home.focusTechSub': 'impacto',
    'home.focusTechShort': 'técnico',
    'home.focusStrategic': 'Enfoque estratégico',
    'home.focusStrategicSub': 'de valor',
    'home.focusStrategicShort': 'estratégico',
    'home.focusHuman': 'Enfoque humano',
    'home.focusHumanSub': 'de propósito',
    'home.focusHumanShort': 'humano',
    
    // Work
    'work.title': 'PROYECTOS',
    'work.description': 'Soluciones que combinan automatización, escalabilidad y estrategia para generar valor real.',
    'work.fullstack': 'desarrollo full-stack',
    'work.uiux': 'UI/UX innovador',
    'work.tech': 'tecnologías de vanguardia',
    'work.total': 'Total Proyectos',
    'work.featured': 'Destacados',
    'work.categories': 'Categorías',
    'work.all': 'Todos',
    'work.filter': 'Filtrar',
    'work.fullstackCat': 'Full-Stack',
    'work.web': 'Web',
    'work.ai': 'IA/ML',
    'work.mobile': 'Móvil',
    'work.loading': 'Cargando proyectos',
    'work.noProjects': 'No se encontraron proyectos en esta categoría.',
    'work.viewAll': 'Ver Todos los Proyectos',
    'work.page': 'Página',
    'work.of': 'de',
    'work.previous': 'Anterior',
    'work.next': 'Siguiente',
    
    // Projects
    'projects.viewNow': 'Ver Ahora',
    'projects.loading': 'Cargando proyecto...',
    'projects.backToProjects': 'Volver a Proyectos',
    'projects.viewDemo': 'Ver Demo',
    'projects.viewCode': 'Ver Código',
    
    // Next Page Button
    'nextpage.home': 'Inicio',
    'nextpage.work': 'Trabajo',
    'nextpage.projects': 'Proyectos',
    'nextpage.about': 'Acerca de',
    'nextpage.contact': 'Contacto',
    'nextpage.next': 'Siguiente',
    
    // About
    'about.title': 'ACERCA DE',
    'about.intro': 'Desarrollo soluciones que combinan ingeniería, automatización y propósito.',
    'about.skills': 'Habilidades',
    'about.proficiency': 'Proficiencia Prom.',
    'about.yearsExp': 'Años Experiencia',
    'about.categories': 'Categorías',
    'about.experience': 'EXPERIENCIA',
    'about.bio1': 'Soy un desarrollador full stack orientado al diseño y la implementación de',
    'about.bio1b': 'sistemas escalables',
    'about.bio1c': 'que integran arquitectura sólida, automatización y rendimiento.',
    'about.bio2': 'Con experiencia en frameworks frontend como React, Next.js y Vue.js, y tecnologías backend como Node.js, NestJS, Laravel y Symfony, construyo soluciones completas basadas en',
    'about.bio2b': 'buenas prácticas',
    'about.bio2c': 'de ingeniería.',
    'about.bio3': 'Mi enfoque se centra en código limpio,',
    'about.bio3b': 'observabilidad',
    'about.bio3c': ', y procesos CI/CD, alineando la tecnología con los objetivos estratégicos de cada proyecto.',
    'about.automation': 'Automatización e IA',
    'about.automationValue': 'Optimizo flujos de trabajo y sistemas mediante bots, RPA e inteligencia artificial aplicada.',
    'about.architecture': 'Arquitectura Escalable',
    'about.architectureValue': 'Diseño soluciones sostenibles que se adaptan al crecimiento y la demanda.',
    'about.integration': 'Integración de Sistemas',
    'about.integrationValue': 'Conecto plataformas y servicios para mejorar la interoperabilidad y la eficiencia.',
    'about.strategy': 'Estrategia Tecnológica',
    'about.strategyValue': 'Alineo las decisiones técnicas con los objetivos de negocio para generar valor real.',
    'about.fullstack': 'Desarrollo Full Stack',
    'about.fullstackValue': 'Construyo experiencias completas, desde el frontend interactivo hasta el backend robusto.',
    'about.skillsTitle': 'HABILIDADES Y EXPERIENCIA',
    'about.all': 'Todas',
    'about.filter': 'Filtrar',
    'about.skillsCount': 'habilidades',
    'about.loading': 'Cargando habilidades',
    
    // Contact
    'contact.title': 'CONTACTO',
    'contact.intro': 'La mejor parte del desarrollo es crear algo que funcione, crezca y genere valor. Hablemos de cómo lograrlo.',
    'contact.amazing': 'increíble',
    'contact.together': 'juntos. Siempre estoy interesado en escuchar sobre',
    'contact.opportunities': 'nuevas oportunidades',
    'contact.sendMessage': 'ENVIAR MENSAJE',
    'contact.name': 'Nombre',
    'contact.email': 'Email',
    'contact.subject': 'Asunto',
    'contact.message': 'Mensaje',
    'contact.namePlaceholder': 'Tu nombre',
    'contact.emailPlaceholder': 'tu.email@ejemplo.com',
    'contact.subjectPlaceholder': 'Consulta de proyecto',
    'contact.messagePlaceholder': 'Cuéntame sobre tu proyecto...',
    'contact.sending': 'ENVIANDO...',
    'contact.send': 'ENVIAR MENSAJE',
    'contact.success': '¡Mensaje enviado exitosamente!',
    'contact.successMsg': 'Te responderé pronto.',
    'contact.error': 'Error al enviar mensaje',
    'contact.emailLabel': 'Email',
    'contact.locationLabel': 'Ubicación',
    'contact.locationValue': 'Chile / Remoto',
    'contact.responseTime': 'Tiempo de Respuesta',
    'contact.responseValue': '24-48 horas',
    'contact.connect': 'CONECTA CONMIGO',
    'contact.available': 'ABIERTO A COLABORACIONES TECNOLÓGICAS',
    'contact.availableMsg': 'Busco participar en proyectos donde la ingeniería y la estrategia se combinen para generar impacto real.',
    
    // Not Found 404
    'notfound.title': 'PÁGINA NO ENCONTRADA',
    'notfound.message': 'La página que buscas ha sido eliminada, movida, o nunca existió en esta dimensión del ciberespacio.',
    'notfound.backHome': 'Volver al Inicio',
    'notfound.viewProjects': 'Ver Proyectos',
    'notfound.errorCodeLabel': 'Código de Error',
    'notfound.errorCode': 'ERR_PÁGINA_NO_ENCONTRADA',
    'notfound.statusLabel': 'Estado',
    
    // Snake Game
    'snake.title': 'Snake',
    'snake.play': 'Jugar Snake',
    'snake.requiresPerformance': 'Requiere modo de alto rendimiento',
    'snake.score': 'Puntuación',
    'snake.high': 'Récord',
    'snake.gameOver': 'JUEGO TERMINADO',
    'snake.paused': 'PAUSADO',
    'snake.playAgain': 'Jugar de Nuevo',
    'snake.pause': 'Pausar',
    'snake.resume': 'Reanudar',
    'snake.reset': 'Reiniciar',
    'snake.controls': 'Controles',
    'snake.controlsTitle': 'Cómo jugar',
    'snake.moveKeys': 'Flechas o WASD para mover',
    'snake.moveKeysMobile': 'Usa los botones para mover',
    'snake.pauseKey': 'Espacio o P para pausar',
    'snake.pauseKeyMobile': 'Toca el botón de pausa',
    'snake.escKey': 'ESC para cerrar',
    'snake.escKeyMobile': 'Toca el botón X para cerrar',
    'snake.comingSoon': 'Próximamente',
    'snake.objective': 'Come la comida roja para crecer. ¡No choques con las paredes o contigo mismo!',
    
    // Dev Tips
    'devTips.title': 'Consejos de Desarrollo',
    'devTips.description': 'Recibe consejos exclusivos, tutoriales y recursos directamente en tu correo.',
    'devTips.benefit1': 'Tips semanales de desarrollo',
    'devTips.benefit2': 'Recursos y herramientas útiles',
    'devTips.benefit3': 'Actualizaciones de proyectos',
    'devTips.emailLabel': 'Correo electrónico',
    'devTips.emailPlaceholder': 'tu@ejemplo.com',
    'devTips.emailRequired': 'El correo es requerido',
    'devTips.emailInvalid': 'Correo inválido',
    'devTips.submitError': 'Error al enviar. Intenta de nuevo.',
    'devTips.subscribe': 'Suscribirse',
    'devTips.submitting': 'Enviando...',
    'devTips.success': '¡Suscripción exitosa! Revisa tu correo.',
    
    // Home Terminal
    'terminal.init': 'init',
    'terminal.systemInit': 'Sistema',
    'terminal.portfolioLoaded': 'Portafolio',
    'terminal.developer': 'Desarrollador',
    'terminal.help': 'help',
    'terminal.helpGames': 'Lanzar juegos interactivos',
    'terminal.helpMatrix': 'Alternar efecto matrix',
    'terminal.helpLanguage': 'Cambiar idioma',
    'terminal.helpStatus': 'Mostrar estado del sistema',
    'terminal.helpPages': 'Ver páginas del portafolio',
    'terminal.pages': 'pages',
    'terminal.status': 'status',
    'terminal.availability': 'Disponibilidad',
    'terminal.online': 'En línea',
    'terminal.stack': 'Stack',
    'terminal.location': 'Ubicación',
    'terminal.uptime': 'Tiempo activo',
    'terminal.years': 'años',
    'terminal.games': 'games',
    'terminal.gamesAvailable': 'Juegos disponibles (requiere modo de alto rendimiento):',
    'terminal.easterEgg': 'Consejo: Intenta escribir \'dev\' para una sorpresa...',
    'terminal.easterEggHint': 'Consejo: Intenta escribir \'dev\' para una sorpresa...',
    'terminal.typeCommand': 'escribe un comando...',
    'terminal.interactiveExperience': 'EXPERIENCIA INTERACTIVA',
    'terminal.commands': 'Comandos',
    'terminal.commandNotFound': 'Comando no encontrado',
    'terminal.tryHelp': 'Escribe \'help\' para ver comandos disponibles',
    
    // Matrix Mode
    'matrix.warning': 'ADVERTENCIA',
    'matrix.systemAlert': 'ALERTA DEL SISTEMA',
    'matrix.message': 'Estás a punto de activar el Modo Matrix. Esto aumentará drásticamente los efectos visuales y animaciones, lo que puede consumir recursos significativos del sistema.',
    'matrix.highCPU': 'Alto uso de CPU',
    'matrix.highGPU': 'Alto uso de GPU',
    'matrix.batteryDrain': 'Consumo elevado de batería',
    'matrix.recommendation': 'Recomendado solo para dispositivos de alto rendimiento',
    'matrix.cancel': 'Cancelar',
    'matrix.activate': 'ACTIVAR',
    'matrix.activated': 'Modo Matrix activado',
    'matrix.deactivated': 'Modo Matrix desactivado',
    
    // Performance Toggle
    'performance.lowMode': 'Modo de bajo rendimiento activado',
    'performance.highMode': 'Modo de alto rendimiento',
    'performance.animationsOff': 'Animaciones desactivadas para mejor rendimiento',
    'performance.animationsOn': 'Todas las animaciones activas',
    'performance.clickToDeactivate': 'Click para desactivar',
    'performance.low': 'Bajo',
    'performance.high': 'Alto',
    'performance.matrix': 'Matrix',
    
    // Terminal Language
    'terminal.language': 'language',
    'terminal.selectLanguage': 'Selecciona tu idioma preferido:',
    'terminal.active': 'Activo',
    'terminal.languageNote': 'El idioma se aplicará en toda la aplicación',
    'terminal.inputPlaceholder': 'escribe un comando...',
  },
  en: {
    // Navbar
    'nav.home': 'HOME',
    'nav.work': 'WORK',
    'nav.projects': 'PROJECTS',
    'nav.about': 'ABOUT',
    'nav.contact': 'CONTACT',
    // Common
    'common.previous': 'Previous',
    'common.next': 'Next',
    'common.page': 'Page',
    'common.of': 'of',
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    
    // Home
    'home.title': 'FULL STACK',
    'home.developer': 'DEVELOPER',
    'home.automation': 'AUTOMATION',
    'home.engineer': 'SCALABILITY',
    'home.scalability': 'SCALABILITY',
    'home.integration': 'TECH INTEGRATION',
    'home.portfolioLabel': 'PORTFOLIO v2.0',
    'home.tagline': 'I believe in technology as a strategic tool to generate value, optimize processes and enhance decision-making through scalable, automated and sustainable solutions.',
    'home.viewProjects': 'View Projects',
    'home.contact': 'Contact',
    'home.available': 'Available for new projects',
    'home.focus': 'Focus',
    'home.focusTech': 'Technical focus',
    'home.focusTechSub': 'impact',
    'home.focusTechShort': 'technical',
    'home.focusStrategic': 'Strategic focus',
    'home.focusStrategicSub': 'value-driven',
    'home.focusStrategicShort': 'strategic',
    'home.focusHuman': 'Human focus',
    'home.focusHumanSub': 'purpose-driven',
    'home.focusHumanShort': 'human',
    
    // Work
    'work.title': 'PROJECTS',
    'work.description': 'Solutions that combine automation, scalability and strategy to generate real value.',
    'work.fullstack': 'full-stack development',
    'work.uiux': 'innovative UI/UX',
    'work.tech': 'cutting-edge technologies',
    'work.total': 'Total Projects',
    'work.featured': 'Featured',
    'work.categories': 'Categories',
    'work.all': 'All',
    'work.filter': 'Filter',
    'work.fullstackCat': 'Full-Stack',
    'work.web': 'Web',
    'work.ai': 'AI/ML',
    'work.mobile': 'Mobile',
    'work.loading': 'Loading projects',
    'work.noProjects': 'No projects found in this category.',
    'work.viewAll': 'View All Projects',
    'work.page': 'Page',
    'work.of': 'of',
    'work.previous': 'Previous',
    'work.next': 'Next',
    
    // Projects
    'projects.viewNow': 'View Now',
    'projects.loading': 'Loading project...',
    'projects.backToProjects': 'Back to Projects',
    'projects.viewDemo': 'View Demo',
    'projects.viewCode': 'View Code',
    
    // Next Page Button
    'nextpage.home': 'Home',
    'nextpage.work': 'Work',
    'nextpage.projects': 'Projects',
    'nextpage.about': 'About',
    'nextpage.contact': 'Contact',
    'nextpage.next': 'Next',
    
    // About
    'about.title': 'ABOUT',
    'about.intro': 'I develop solutions that combine engineering, automation and purpose.',
    'about.skills': 'Skills',
    'about.proficiency': 'Avg. Proficiency',
    'about.yearsExp': 'Years Experience',
    'about.categories': 'Categories',
    'about.experience': 'EXPERIENCE',
    'about.bio1': 'I am a full stack developer focused on designing and implementing',
    'about.bio1b': 'scalable systems',
    'about.bio1c': 'that integrate solid architecture, automation and performance.',
    'about.bio2': 'With experience in frontend frameworks like React, Next.js and Vue.js, and backend technologies like Node.js, NestJS, Laravel and Symfony, I build complete solutions based on',
    'about.bio2b': 'best practices',
    'about.bio2c': 'in engineering.',
    'about.bio3': 'My approach focuses on clean code,',
    'about.bio3b': 'observability',
    'about.bio3c': ', and CI/CD processes, aligning technology with the strategic objectives of each project.',
    'about.automation': 'Automation & AI',
    'about.automationValue': 'I optimize workflows and systems through bots, RPA and applied artificial intelligence.',
    'about.architecture': 'Scalable Architecture',
    'about.architectureValue': 'I design sustainable solutions that adapt to growth and demand.',
    'about.integration': 'Systems Integration',
    'about.integrationValue': 'I connect platforms and services to improve interoperability and efficiency.',
    'about.strategy': 'Technology Strategy',
    'about.strategyValue': 'I align technical decisions with business objectives to generate real value.',
    'about.fullstack': 'Full Stack Development',
    'about.fullstackValue': 'I build complete experiences, from interactive frontend to robust backend.',
    'about.skillsTitle': 'SKILLS AND EXPERIENCE',
    'about.all': 'all',
    'about.filter': 'Filter',
    'about.skillsCount': 'skills',
    'about.loading': 'Loading skills',
    
    // Contact
    'contact.title': 'CONTACT',
    'contact.intro': 'The best part of development is creating something that works, grows and generates value. Let\'s talk about how to achieve it.',
    'contact.amazing': 'amazing',
    'contact.together': 'together. I\'m always interested in hearing about',
    'contact.opportunities': 'new opportunities',
    'contact.sendMessage': 'SEND MESSAGE',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.namePlaceholder': 'Your name',
    'contact.emailPlaceholder': 'your.email@example.com',
    'contact.subjectPlaceholder': 'Project inquiry',
    'contact.messagePlaceholder': 'Tell me about your project...',
    'contact.sending': 'SENDING...',
    'contact.send': 'SEND MESSAGE',
    'contact.success': 'Message sent successfully!',
    'contact.successMsg': 'I\'ll get back to you soon.',
    'contact.error': 'Error sending message',
    'contact.emailLabel': 'Email',
    'contact.locationLabel': 'Location',
    'contact.locationValue': 'Chile / Remote',
    'contact.responseTime': 'Response Time',
    'contact.responseValue': '24-48 hours',
    'contact.connect': 'CONNECT WITH ME',
    'contact.available': 'OPEN TO TECH COLLABORATIONS',
    'contact.availableMsg': 'I seek to participate in projects where engineering and strategy combine to generate real impact.',
    
    // Not Found 404
    'notfound.title': 'PAGE NOT FOUND',
    'notfound.message': 'The page you’re looking for has been removed, moved, or never existed in this dimension of cyberspace.',
    'notfound.backHome': 'Back to Home',
    'notfound.viewProjects': 'View Projects',
    'notfound.errorCodeLabel': 'Error Code',
    'notfound.errorCode': 'ERR_PAGE_NOT_FOUND',
    'notfound.statusLabel': 'Status',
    
    // Snake Game
    'snake.title': 'Snake',
    'snake.play': 'Play Snake',
    'snake.requiresPerformance': 'Requires high performance mode',
    'snake.score': 'Score',
    'snake.high': 'High',
    'snake.gameOver': 'GAME OVER',
    'snake.paused': 'PAUSED',
    'snake.playAgain': 'Play Again',
    'snake.pause': 'Pause',
    'snake.resume': 'Resume',
    'snake.reset': 'Reset',
    'snake.controls': 'Controls',
    'snake.controlsTitle': 'How to Play',
    'snake.moveKeys': 'Arrow keys or WASD to move',
    'snake.moveKeysMobile': 'Use buttons to move',
    'snake.pauseKey': 'Space or P to pause',
    'snake.pauseKeyMobile': 'Tap pause button',
    'snake.escKey': 'ESC to close',
    'snake.escKeyMobile': 'Tap X button to close',
    'snake.comingSoon': 'Coming Soon',
    'snake.objective': 'Eat the red food to grow. Don\'t crash into walls or yourself!',
    
    // Dev Tips
    'devTips.title': 'Dev Tips',
    'devTips.description': 'Receive exclusive tips, tutorials and resources directly in your inbox.',
    'devTips.benefit1': 'Weekly development tips',
    'devTips.benefit2': 'Useful resources and tools',
    'devTips.benefit3': 'Project updates',
    'devTips.emailLabel': 'Email address',
    'devTips.emailPlaceholder': 'you@example.com',
    'devTips.emailRequired': 'Email is required',
    'devTips.emailInvalid': 'Invalid email',
    'devTips.submitError': 'Error submitting. Try again.',
    'devTips.subscribe': 'Subscribe',
    'devTips.submitting': 'Submitting...',
    'devTips.success': 'Successfully subscribed! Check your email.',
    
    // Home Terminal
    'terminal.init': 'init',
    'terminal.systemInit': 'System',
    'terminal.portfolioLoaded': 'Portfolio',
    'terminal.developer': 'Developer',
    'terminal.help': 'help',
    'terminal.helpGames': 'Launch interactive games',
    'terminal.helpMatrix': 'Toggle matrix rain effect',
    'terminal.helpLanguage': 'Change language',
    'terminal.helpStatus': 'Show system status',
    'terminal.helpPages': 'View portfolio pages',
    'terminal.pages': 'pages',
    'terminal.status': 'status',
    'terminal.availability': 'Availability',
    'terminal.online': 'Online',
    'terminal.stack': 'Stack',
    'terminal.location': 'Location',
    'terminal.uptime': 'Uptime',
    'terminal.years': 'years',
    'terminal.games': 'games',
    'terminal.gamesAvailable': 'Available games (requires high performance mode):',
    'terminal.easterEgg': 'Tip: Try typing \'dev\' for a surprise...',
    'terminal.easterEggHint': 'Tip: Try typing \'dev\' for a surprise...',
    'terminal.typeCommand': 'type a command...',
    'terminal.interactiveExperience': 'INTERACTIVE EXPERIENCE',
    'terminal.commands': 'Commands',
    'terminal.commandNotFound': 'Command not found',
    'terminal.tryHelp': 'Type \'help\' to see available commands',
    
    // Matrix Mode
    'matrix.warning': 'WARNING',
    'matrix.systemAlert': 'SYSTEM ALERT',
    'matrix.message': 'You are about to activate Matrix Mode. This will drastically increase visual effects and animations, which may consume significant system resources.',
    'matrix.highCPU': 'High CPU usage',
    'matrix.highGPU': 'High GPU usage',
    'matrix.batteryDrain': 'High battery drain',
    'matrix.recommendation': 'Recommended only for high-performance devices',
    'matrix.cancel': 'Cancel',
    'matrix.activate': 'ACTIVATE',
    'matrix.activated': 'Matrix Mode activated',
    'matrix.deactivated': 'Matrix Mode deactivated',
    
    // Performance Toggle
    'performance.lowMode': 'Low performance mode enabled',
    'performance.highMode': 'High performance mode',
    'performance.animationsOff': 'Animations disabled for better performance',
    'performance.animationsOn': 'All animations active',
    'performance.clickToDeactivate': 'Click to deactivate',
    'performance.low': 'Low',
    'performance.high': 'High',
    'performance.matrix': 'Matrix',
    
    // Terminal Language
    'terminal.language': 'language',
    'terminal.selectLanguage': 'Select your preferred language:',
    'terminal.active': 'Active',
    'terminal.languageNote': 'Language will be applied across the entire application',
    'terminal.inputPlaceholder': 'type a command...',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (mounted) {
      localStorage.setItem('language', newLanguage);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es';
    changeLanguage(newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
