/**
 * Traducciones específicas de Portfolio
 * Estas se combinan con las traducciones base de shared/translations.ts
 */

import { Language } from '../../../shared/translations';

export interface PortfolioTranslations {
  // Navbar
  'nav.home': string;
  'nav.work': string;
  'nav.about': string;
  'nav.contact': string;
  
  // Common
  'common.previous': string;
  'common.next': string;
  'common.page': string;
  'common.of': string;
  'common.back': string;
  'common.cancel': string;
  'common.close': string;
  
  // Home
  'home.title': string;
  'home.developer': string;
  'home.automation': string;
  'home.engineer': string;
  'home.scalability': string;
  'home.integration': string;
  'home.portfolioLabel': string;
  'home.tagline': string;
  'home.viewProjects': string;
  'home.contact': string;
  'home.available': string;
  'home.name': string;
  'home.firstName': string;
  'home.lastName': string;
  'home.focus': string;
  'home.focusTech': string;
  'home.focusTechSub': string;
  'home.focusTechShort': string;
  'home.focusStrategic': string;
  'home.focusStrategicSub': string;
  'home.focusStrategicShort': string;
  'home.focusHuman': string;
  'home.focusHumanSub': string;
  'home.focusHumanShort': string;
  
  // Work
  'work.title': string;
  'work.description': string;
  'work.fullstack': string;
  'work.uiux': string;
  'work.tech': string;
  'work.total': string;
  'work.featured': string;
  'work.categories': string;
  'work.all': string;
  'work.filter': string;
  'work.fullstackCat': string;
  'work.web': string;
  'work.ai': string;
  'work.mobile': string;
  'work.loading': string;
  'work.noProjects': string;
  'work.viewAll': string;
  'work.page': string;
  'work.of': string;
  'work.previous': string;
  'work.next': string;
  
  // Projects
  'projects.viewNow': string;
  'projects.loading': string;
  'projects.backToProjects': string;
  'projects.viewDemo': string;
  'projects.viewCode': string;
  
  // Next Page Button
  'nextpage.home': string;
  'nextpage.work': string;
  'nextpage.projects': string;
  'nextpage.about': string;
  'nextpage.contact': string;
  'nextpage.next': string;
  
  // About
  'about.title': string;
  'about.intro': string;
  'about.skills': string;
  'about.proficiency': string;
  'about.yearsExp': string;
  'about.categories': string;
  'about.experience': string;
  'about.bio1': string;
  'about.bio1b': string;
  'about.bio1c': string;
  'about.bio2': string;
  'about.bio2b': string;
  'about.bio2c': string;
  'about.bio3': string;
  'about.bio3b': string;
  'about.bio3c': string;
  'about.automation': string;
  'about.automationValue': string;
  'about.architecture': string;
  'about.architectureValue': string;
  'about.integration': string;
  'about.integrationValue': string;
  'about.strategy': string;
  'about.strategyValue': string;
  'about.fullstack': string;
  'about.fullstackValue': string;
  'about.skillsTitle': string;
  'about.all': string;
  'about.filter': string;
  'about.skillsCount': string;
  'about.loading': string;
  'about.education': string;
  'about.certifications': string;
  'about.languages': string;
  'about.interests': string;
  'about.downloadCV': string;
  'about.viewLinkedIn': string;
  'about.viewGitHub': string;
  'about.locationValue': string;
  
  // Contact
  'contact.title': string;
  'contact.intro': string;
  'contact.description': string;
  'contact.lets': string;
  'contact.create': string;
  'contact.something': string;
  'contact.amazing': string;
  'contact.together': string;
  'contact.opportunities': string;
  'contact.sendMessage': string;
  'contact.namePlaceholder': string;
  'contact.emailPlaceholder': string;
  'contact.subjectPlaceholder': string;
  'contact.messagePlaceholder': string;
  'contact.successMsg': string;
  'contact.emailLabel': string;
  'contact.locationLabel': string;
  'contact.locationValue': string;
  'contact.responseTime': string;
  'contact.responseValue': string;
  'contact.connect': string;
  'contact.available': string;
  'contact.availableMsg': string;
  
  // Not Found 404
  'notfound.title': string;
  'notfound.subtitle': string;
  'notfound.description': string;
  'notfound.backHome': string;
  'notfound.viewProjects': string;
  'notfound.contact': string;
  
  // Performance
  'performance.lowMode': string;
  'performance.highMode': string;
  'performance.animationsOff': string;
  'performance.animationsOn': string;
  'performance.clickToDeactivate': string;
  'performance.low': string;
  'performance.high': string;
  'performance.matrix': string;
  
  // Terminal Language
  'terminal.language': string;
  'terminal.selectLanguage': string;
  'terminal.active': string;
  'terminal.languageNote': string;
  'terminal.inputPlaceholder': string;
  
  // Terminal Commands
  'terminal.init': string;
  'terminal.systemInit': string;
  'terminal.portfolioLoaded': string;
  'terminal.developer': string;
  'terminal.status': string;
  'terminal.availability': string;
  'terminal.online': string;
  'terminal.stack': string;
  'terminal.location': string;
  'terminal.uptime': string;
  'terminal.years': string;
  'terminal.projects': string;
  'terminal.games': string;
  'terminal.helpProjects': string;
  'terminal.helpGames': string;
  'terminal.helpMatrix': string;
  'terminal.helpLanguage': string;
  'terminal.helpStatus': string;
  'terminal.gamesAvailable': string;
  'terminal.interactiveExperience': string;
  'terminal.easterEgg': string;
  'terminal.easterEggHint': string;
  'terminal.commandNotFound': string;
  'terminal.typeCommand': string;

  // Snake (Game modal labels)
  'snake.controlsTitle': string;
  'snake.pause': string;
  'snake.resume': string;
  'snake.reset': string;
  'snake.score': string;
  'snake.moveKeys': string;
  'snake.moveKeysMobile': string;
  'snake.pauseKey': string;
  'snake.pauseKeyMobile': string;
  'snake.escKey': string;
  'snake.escKeyMobile': string;
  'snake.requiresPerformance': string;
  'snake.comingSoon': string;
  'snake.gameOver': string;
  'snake.playAgain': string;
  'snake.paused': string;

  // Tetris
  'tetris.level': string;
  'tetris.lines': string;
  'tetris.moveKeys': string;
  'tetris.moveKeysMobile': string;
}

export const portfolioTranslations: Record<Language, PortfolioTranslations> = {
  es: {
    // Navbar
    'nav.home': 'INICIO',
    'nav.work': 'TRABAJO',
    'nav.about': 'ACERCA DE',
    'nav.contact': 'CONTACTO',
    
    // Common
    'common.previous': 'Anterior',
    'common.next': 'Siguiente',
    'common.page': 'Página',
    'common.of': 'de',
    'common.back': 'Volver',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    
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
    'home.name': 'SERGIO JÁUREGUI',
    'home.firstName': 'SERGIO',
    'home.lastName': 'JÁUREGUI',
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
    'about.education': 'Educación',
    'about.certifications': 'Certificaciones',
    'about.languages': 'Idiomas',
    'about.interests': 'Intereses',
    'about.downloadCV': 'Descargar CV',
    'about.viewLinkedIn': 'Ver LinkedIn',
    'about.viewGitHub': 'Ver GitHub',
    'about.locationValue': 'Chile / Remoto',
    
    // Contact
    'contact.title': 'CONTACTO',
    'contact.intro': 'Desarrollo soluciones que combinan ingeniería, automatización y propósito.',
    'contact.description': 'La mejor parte del desarrollo es crear algo que funcione, crezca y genere valor. Hablemos de cómo lograrlo.',
    'contact.lets': 'Creemos',
    'contact.create': 'algo',
    'contact.something': 'algo',
    'contact.amazing': 'increíble',
    'contact.together': 'juntos. Siempre estoy interesado en escuchar sobre',
    'contact.opportunities': 'nuevas oportunidades',
    'contact.sendMessage': 'ENVIAR MENSAJE',
    'contact.namePlaceholder': 'Tu nombre',
    'contact.emailPlaceholder': 'tu.email@ejemplo.com',
    'contact.subjectPlaceholder': 'Consulta de proyecto',
    'contact.messagePlaceholder': 'Cuéntame sobre tu proyecto...',
    'contact.successMsg': 'Gracias por contactarme. Te responderé lo antes posible.',
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
    'notfound.subtitle': '404',
    'notfound.description': 'La página que buscas no existe o ha sido movida.',
    'notfound.backHome': 'Volver al Inicio',
    'notfound.viewProjects': 'Ver Proyectos',
    'notfound.contact': 'Contactar',
    
    // Performance
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
    
    // Terminal Commands
    'terminal.init': 'init',
    'terminal.systemInit': 'Sistema inicializado',
    'terminal.portfolioLoaded': 'Portfolio cargado',
    'terminal.developer': 'Sergio Jáuregui',
    'terminal.status': 'status',
    'terminal.availability': 'Disponibilidad',
    'terminal.online': 'En línea',
    'terminal.stack': 'Stack',
    'terminal.location': 'Ubicación',
    'terminal.uptime': 'Experiencia',
    'terminal.years': 'años',
    'terminal.projects': 'projects',
    'terminal.games': 'games',
    'terminal.helpProjects': 'Navegar a proyectos',
    'terminal.helpGames': 'Juegos interactivos',
    'terminal.helpMatrix': 'Activar modo Matrix',
    'terminal.helpLanguage': 'Cambiar idioma',
    'terminal.helpStatus': 'Ver estado del sistema',
    'terminal.gamesAvailable': 'Juegos disponibles:',
    'terminal.interactiveExperience': 'EXPERIENCIA INTERACTIVA',
    'terminal.easterEgg': 'Psst... hay un easter egg escondido aquí 👀',
    'terminal.easterEggHint': 'Tip: Prueba escribir "help" para ver comandos disponibles',
    'terminal.commandNotFound': 'Comando no encontrado. Escribe "help" para ver comandos disponibles.',
    'terminal.typeCommand': 'escribe un comando...',

    // Snake (Game modal labels)
    'snake.controlsTitle': 'Controles',
    'snake.pause': 'Pausa',
    'snake.resume': 'Reanudar',
    'snake.reset': 'Reiniciar',
    'snake.score': 'Puntaje',
    'snake.moveKeys': 'Flechas ← → ↑ ↓ para mover',
    'snake.moveKeysMobile': 'Desliza para mover',
    'snake.pauseKey': 'P para pausar / reanudar',
    'snake.pauseKeyMobile': 'Toca el ícono para pausar / reanudar',
    'snake.escKey': 'Esc para salir',
    'snake.escKeyMobile': 'Cierra para salir',
    'snake.requiresPerformance': 'Requiere modo de alto rendimiento',
    'snake.comingSoon': 'Pronto',
    'snake.gameOver': 'GAME OVER',
    'snake.playAgain': 'Jugar de nuevo',
    'snake.paused': 'PAUSADO',

    // Tetris
    'tetris.level': 'Nivel',
    'tetris.lines': 'Líneas',
    'tetris.moveKeys': 'Flechas ← → ↓ para mover, ↑ para rotar',
    'tetris.moveKeysMobile': 'Desliza para mover, toca para rotar',
  },
  en: {
    // Navbar
    'nav.home': 'HOME',
    'nav.work': 'WORK',
    'nav.about': 'ABOUT',
    'nav.contact': 'CONTACT',
    
    // Common
    'common.previous': 'Previous',
    'common.next': 'Next',
    'common.page': 'Page',
    'common.of': 'of',
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    
    // Home
    'home.title': 'FULL STACK',
    'home.developer': 'DEVELOPER',
    'home.automation': 'AUTOMATION',
    'home.engineer': 'SCALABILITY',
    'home.scalability': 'SCALABILITY',
    'home.integration': 'TECH INTEGRATION',
    'home.portfolioLabel': 'PORTFOLIO v2.0',
    'home.tagline': 'I believe in technology as a strategic tool to generate value, optimize processes, and enhance decision-making through scalable, automated, and sustainable solutions.',
    'home.viewProjects': 'View Projects',
    'home.contact': 'Contact',
    'home.available': 'Available for new projects',
    'home.name': 'SERGIO JÁUREGUI',
    'home.firstName': 'SERGIO',
    'home.lastName': 'JÁUREGUI',
    'home.focus': 'Focus',
    'home.focusTech': 'Technical focus',
    'home.focusTechSub': 'impact',
    'home.focusTechShort': 'technical',
    'home.focusStrategic': 'Strategic focus',
    'home.focusStrategicSub': 'value',
    'home.focusStrategicShort': 'strategic',
    'home.focusHuman': 'Human focus',
    'home.focusHumanSub': 'purpose',
    'home.focusHumanShort': 'human',
    
    // Work
    'work.title': 'PROJECTS',
    'work.description': 'Solutions that combine automation, scalability, and strategy to generate real value.',
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
    'about.intro': 'I develop solutions that combine engineering, automation, and purpose.',
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
    'about.all': 'All',
    'about.filter': 'Filter',
    'about.skillsCount': 'skills',
    'about.loading': 'Loading skills',
    'about.education': 'Education',
    'about.certifications': 'Certifications',
    'about.languages': 'Languages',
    'about.interests': 'Interests',
    'about.downloadCV': 'Download CV',
    'about.viewLinkedIn': 'View LinkedIn',
    'about.viewGitHub': 'View GitHub',
    'about.locationValue': 'Chile / Remote',
    
    // Contact
    'contact.title': 'CONTACT',
    'contact.intro': 'I develop solutions that combine engineering, automation and purpose.',
    'contact.description': 'The best part of development is creating something that works, grows and generates value. Let\'s talk about how to achieve it.',
    'contact.lets': 'Let\'s create',
    'contact.create': 'something',
    'contact.something': 'something',
    'contact.amazing': 'amazing',
    'contact.together': 'together. I\'m always interested in hearing about',
    'contact.opportunities': 'new opportunities',
    'contact.sendMessage': 'SEND MESSAGE',
    'contact.namePlaceholder': 'Your name',
    'contact.emailPlaceholder': 'your.email@example.com',
    'contact.subjectPlaceholder': 'Project inquiry',
    'contact.messagePlaceholder': 'Tell me about your project...',
    'contact.successMsg': 'Thank you for contacting me. I\'ll get back to you as soon as possible.',
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
    'notfound.subtitle': '404',
    'notfound.description': 'The page you are looking for does not exist or has been moved.',
    'notfound.backHome': 'Back to Home',
    'notfound.viewProjects': 'View Projects',
    'notfound.contact': 'Contact',
    
    // Performance
    'performance.lowMode': 'Low performance mode activated',
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
    'terminal.languageNote': 'Language will be applied throughout the application',
    'terminal.inputPlaceholder': 'type a command...',
    
    // Terminal Commands
    'terminal.init': 'init',
    'terminal.systemInit': 'System initialized',
    'terminal.portfolioLoaded': 'Portfolio loaded',
    'terminal.developer': 'Sergio Jáuregui',
    'terminal.status': 'status',
    'terminal.availability': 'Availability',
    'terminal.online': 'Online',
    'terminal.stack': 'Stack',
    'terminal.location': 'Location',
    'terminal.uptime': 'Experience',
    'terminal.years': 'years',
    'terminal.projects': 'projects',
    'terminal.games': 'games',
    'terminal.helpProjects': 'Navigate to projects',
    'terminal.helpGames': 'Interactive games',
    'terminal.helpMatrix': 'Activate Matrix mode',
    'terminal.helpLanguage': 'Change language',
    'terminal.helpStatus': 'View system status',
    'terminal.gamesAvailable': 'Available games:',
    'terminal.interactiveExperience': 'INTERACTIVE EXPERIENCE',
    'terminal.easterEgg': 'Psst... there\'s an easter egg hidden here 👀',
    'terminal.easterEggHint': 'Tip: Try typing "help" to see available commands',
    'terminal.commandNotFound': 'Command not found. Type "help" to see available commands.',
    'terminal.typeCommand': 'type a command...',

    // Snake (Game modal labels)
    'snake.controlsTitle': 'Controls',
    'snake.pause': 'Pause',
    'snake.resume': 'Resume',
    'snake.reset': 'Reset',
    'snake.score': 'Score',
    'snake.moveKeys': 'Arrow keys ← → ↑ ↓ to move',
    'snake.moveKeysMobile': 'Swipe to move',
    'snake.pauseKey': 'P to pause / resume',
    'snake.pauseKeyMobile': 'Tap icon to pause / resume',
    'snake.escKey': 'Esc to exit',
    'snake.escKeyMobile': 'Close to exit',
    'snake.requiresPerformance': 'Requires high performance mode',
    'snake.comingSoon': 'Coming soon',
    'snake.gameOver': 'GAME OVER',
    'snake.playAgain': 'Play Again',
    'snake.paused': 'PAUSED',

    // Tetris
    'tetris.level': 'Level',
    'tetris.lines': 'Lines',
    'tetris.moveKeys': 'Arrow keys ← → ↓ to move, ↑ to rotate',
    'tetris.moveKeysMobile': 'Swipe to move, tap to rotate',
  },
};
