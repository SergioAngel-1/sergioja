/**
 * Sistema de traducciones compartido y extensible
 * Cada frontend puede extender estas traducciones base con las suyas propias
 */

export type Language = 'es' | 'en';

/**
 * Traducciones base compartidas entre todos los frontends
 */
export interface BaseTranslations {
  // Navigation
  'nav.portfolio': string;
  'nav.portfolioDesc': string;
  'nav.identity': string;
  'nav.projects': string;
  'nav.connection': string;
  'nav.sections': string;
  'nav.language': string;
  'nav.clickToView': string;
  
  // Identity
  'identity.title': string;
  'identity.paragraph1': string;
  'identity.paragraph2': string;
  'identity.available': string;
  
  // Projects
  'projects.featured': string;
  'projects.loading': string;
  'projects.noProjects': string;
  'projects.viewFull': string;
  'projects.viewAll': string;
  'projects.viewDemo': string;
  'projects.github': string;
  'projects.inProgress': string;
  
  // Contact form
  'contact.name': string;
  'contact.email': string;
  'contact.subject': string;
  'contact.message': string;
  'contact.send': string;
  'contact.sending': string;
  'contact.success': string;
  'contact.error': string;
  'contact.recaptchaRequired': string;
  
  // Connection modal
  'connection.title': string;
  'connection.subtitle': string;
  'connection.github': string;
  'connection.githubHandle': string;
  'connection.githubDesc': string;
  'connection.linkedin': string;
  'connection.linkedinHandle': string;
  'connection.linkedinDesc': string;
  'connection.emailLabel': string;
  'connection.emailHandle': string;
  'connection.emailDesc': string;
  'connection.formTitle': string;
  'connection.namePlaceholder': string;
  'connection.emailPlaceholder': string;
  'connection.messagePlaceholder': string;
  'connection.sendButton': string;
  'connection.sendingButton': string;
  'connection.consoleInit': string;
  'connection.consoleWaiting': string;
  'connection.consoleSending': string;
  'connection.consoleSuccess': string;
  'connection.consoleSuccessMsg': string;
  'connection.consoleError': string;
  'connection.consoleErrorRetry': string;
  'connection.consoleNetError': string;
  'connection.consoleNetErrorMsg': string;
  'connection.consoleWaitingResponse': string;
  
  // Alerts
  'alerts.success': string;
  'alerts.error': string;
  'alerts.warning': string;
  'alerts.info': string;
  'alerts.messageSent': string;
  'alerts.messageSentDesc': string;
  'alerts.sendError': string;
  'alerts.connectionError': string;
  'alerts.connectionErrorDesc': string;
  'alerts.validationError': string;
  'alerts.checkForm': string;
  
  // Validations
  'validation.emailRequired': string;
  'validation.emailInvalid': string;
  'validation.emailDomain': string;
  'validation.nameRequired': string;
  'validation.nameInvalid': string;
  'validation.nameMinLength': string;
  'validation.nameMaxLength': string;
  'validation.subjectRequired': string;
  'validation.subjectMinLength': string;
  'validation.subjectMaxLength': string;
  'validation.messageRequired': string;
  'validation.messageMinLength': string;
  'validation.messageMaxLength': string;
}

// Alias para compatibilidad
export type Translations = BaseTranslations;

export const translations: Record<Language, Translations> = {
  es: {
    // Navigation
    'nav.portfolio': 'Portfolio',
    'nav.portfolioDesc': 'Ver trabajos y proyectos completos',
    'nav.identity': 'Identidad',
    'nav.projects': 'Proyectos',
    'nav.connection': 'Conexión',
    'nav.sections': 'SECCIONES',
    'nav.language': 'IDIOMA',
    'nav.clickToView': 'Haz clic para ver cada sección',
    
    // Identity
    'identity.title': 'Explorando el punto donde la tecnología se encuentra con las ideas',
    'identity.paragraph1': 'Creo en la tecnología como herramienta para materializar ideas que impacten positivamente. Mi enfoque está en crear experiencias digitales que combinen funcionalidad con diseño intencional.',
    'identity.paragraph2': 'Me motiva resolver problemas complejos con soluciones elegantes, siempre buscando el equilibrio entre innovación técnica y experiencia humana.',
    'identity.available': 'Disponible para nuevos proyectos',
    
    // Projects
    'projects.featured': 'Proyectos Destacados',
    'projects.loading': 'Cargando proyectos...',
    'projects.noProjects': 'No hay proyectos disponibles en este momento.',
    'projects.viewFull': 'Ver portafolio completo →',
    'projects.viewAll': 'Ver todos los proyectos →',
    'projects.viewDemo': 'Ver demo →',
    'projects.github': 'GitHub →',
    'projects.inProgress': 'EN DESARROLLO',
    
    // Contact form
    'contact.name': 'Nombre',
    'contact.email': 'Email',
    'contact.subject': 'Asunto',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar',
    'contact.sending': 'Enviando...',
    'contact.success': '¡Mensaje enviado!',
    'contact.error': 'Error al enviar',
    'contact.recaptchaRequired': 'Por favor completa el reCAPTCHA',
    
    // Connection modal
    'connection.title': 'Busco aprender de otros creadores, ingenieros y diseñadores',
    'connection.subtitle': 'Si tienes ideas, proyectos o simplemente quieres intercambiar perspectivas sobre tecnología y diseño, conectemos.',
    'connection.github': 'GitHub',
    'connection.githubHandle': '@SergioJA',
    'connection.githubDesc': 'Código y proyectos',
    'connection.linkedin': 'LinkedIn',
    'connection.linkedinHandle': 'Sergio Jáuregui',
    'connection.linkedinDesc': 'Red profesional',
    'connection.emailLabel': 'Email',
    'connection.emailHandle': 'sergio@example.com',
    'connection.emailDesc': 'Contacto directo',
    'connection.formTitle': '$ contact.send()',
    'connection.namePlaceholder': 'Nombre',
    'connection.emailPlaceholder': 'Email',
    'connection.messagePlaceholder': 'Tu mensaje...',
    'connection.sendButton': '[ENVIAR MENSAJE]',
    'connection.sendingButton': '[ENVIANDO...]',
    'connection.consoleInit': '> Sistema de conexión iniciado...',
    'connection.consoleWaiting': '> Esperando tu mensaje...',
    'connection.consoleSending': '> Enviando mensaje de',
    'connection.consoleSuccess': '> ✓ Mensaje enviado correctamente',
    'connection.consoleSuccessMsg': '> Te responderé pronto. Gracias por conectar.',
    'connection.consoleError': '> ✗ Error:',
    'connection.consoleErrorRetry': '> Intenta de nuevo o contáctame por email directo',
    'connection.consoleNetError': '> ✗ Error de red. Verifica tu conexión',
    'connection.consoleNetErrorMsg': '> O contáctame directamente por email',
    'connection.consoleWaitingResponse': 'Esperando respuesta...',
    
    // Alerts
    'alerts.success': '¡Éxito!',
    'alerts.error': 'Error',
    'alerts.warning': 'Advertencia',
    'alerts.info': 'Información',
    'alerts.messageSent': '¡Mensaje enviado!',
    'alerts.messageSentDesc': 'Te responderé lo antes posible. Revisa tu email para la confirmación.',
    'alerts.sendError': 'Error al enviar',
    'alerts.connectionError': 'Error de conexión',
    'alerts.connectionErrorDesc': 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
    'alerts.validationError': 'Error de validación',
    'alerts.checkForm': 'Por favor verifica los campos del formulario',
    
    // Validations
    'validation.emailRequired': 'El email es requerido',
    'validation.emailInvalid': 'Ingresa un correo válido',
    'validation.emailDomain': 'El dominio debe incluir un punto (ej: gmail.com)',
    'validation.nameRequired': 'El nombre es requerido',
    'validation.nameInvalid': 'El nombre solo puede contener letras y espacios',
    'validation.nameMinLength': 'El nombre debe tener al menos 2 caracteres',
    'validation.nameMaxLength': 'El nombre no puede exceder 100 caracteres',
    'validation.subjectRequired': 'El asunto es requerido',
    'validation.subjectMinLength': 'El asunto debe tener al menos 3 caracteres',
    'validation.subjectMaxLength': 'El asunto no puede exceder 200 caracteres',
    'validation.messageRequired': 'El mensaje es requerido',
    'validation.messageMinLength': 'El mensaje debe tener al menos 10 caracteres',
    'validation.messageMaxLength': 'El mensaje no puede exceder 2000 caracteres',
  },
  en: {
    // Navigation
    'nav.portfolio': 'Portfolio',
    'nav.portfolioDesc': 'View complete works and projects',
    'nav.identity': 'Identity',
    'nav.projects': 'Projects',
    'nav.connection': 'Connection',
    'nav.sections': 'SECTIONS',
    'nav.language': 'LANGUAGE',
    'nav.clickToView': 'Click to view each section',
    
    // Identity
    'identity.title': 'Exploring where technology meets ideas',
    'identity.paragraph1': 'I believe in technology as a tool to materialize ideas that have a positive impact. My focus is on creating digital experiences that combine functionality with intentional design.',
    'identity.paragraph2': 'I am motivated by solving complex problems with elegant solutions, always seeking balance between technical innovation and human experience.',
    'identity.available': 'Available for new projects',
    
    // Projects
    'projects.featured': 'Featured Projects',
    'projects.loading': 'Loading projects...',
    'projects.noProjects': 'No projects available at the moment.',
    'projects.viewFull': 'View full portfolio →',
    'projects.viewAll': 'View all projects →',
    'projects.viewDemo': 'View demo →',
    'projects.github': 'GitHub →',
    'projects.inProgress': 'IN PROGRESS',
    
    // Contact form
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent!',
    'contact.error': 'Error sending',
    'contact.recaptchaRequired': 'Please complete the reCAPTCHA',
    
    // Connection modal
    'connection.title': 'Looking to learn from other creators, engineers and designers',
    'connection.subtitle': 'If you have ideas, projects or just want to exchange perspectives on technology and design, let\'s connect.',
    'connection.github': 'GitHub',
    'connection.githubHandle': '@SergioJA',
    'connection.githubDesc': 'Code and projects',
    'connection.linkedin': 'LinkedIn',
    'connection.linkedinHandle': 'Sergio Jáuregui',
    'connection.linkedinDesc': 'Professional network',
    'connection.emailLabel': 'Email',
    'connection.emailHandle': 'sergio@example.com',
    'connection.emailDesc': 'Direct contact',
    'connection.formTitle': '$ contact.send()',
    'connection.namePlaceholder': 'Name',
    'connection.emailPlaceholder': 'Email',
    'connection.messagePlaceholder': 'Your message...',
    'connection.sendButton': '[SEND MESSAGE]',
    'connection.sendingButton': '[SENDING...]',
    'connection.consoleInit': '> Connection system initialized...',
    'connection.consoleWaiting': '> Waiting for your message...',
    'connection.consoleSending': '> Sending message from',
    'connection.consoleSuccess': '> ✓ Message sent successfully',
    'connection.consoleSuccessMsg': '> I\'ll get back to you soon. Thanks for connecting.',
    'connection.consoleError': '> ✗ Error:',
    'connection.consoleErrorRetry': '> Try again or contact me directly via email',
    'connection.consoleNetError': '> ✗ Network error. Check your connection',
    'connection.consoleNetErrorMsg': '> Or contact me directly via email',
    'connection.consoleWaitingResponse': 'Waiting for response...',
    
    // Alerts
    'alerts.success': 'Success!',
    'alerts.error': 'Error',
    'alerts.warning': 'Warning',
    'alerts.info': 'Information',
    'alerts.messageSent': 'Message sent!',
    'alerts.messageSentDesc': 'I\'ll get back to you soon. Check your email for confirmation.',
    'alerts.sendError': 'Send error',
    'alerts.connectionError': 'Connection error',
    'alerts.connectionErrorDesc': 'Could not connect to server. Check your internet connection.',
    'alerts.validationError': 'Validation error',
    'alerts.checkForm': 'Please check the form fields',
    
    // Validations
    'validation.emailRequired': 'Email is required',
    'validation.emailInvalid': 'Enter a valid email',
    'validation.emailDomain': 'Domain must include a dot (e.g., gmail.com)',
    'validation.nameRequired': 'Name is required',
    'validation.nameInvalid': 'Name can only contain letters and spaces',
    'validation.nameMinLength': 'Name must be at least 2 characters',
    'validation.nameMaxLength': 'Name cannot exceed 100 characters',
    'validation.subjectRequired': 'Subject is required',
    'validation.subjectMinLength': 'Subject must be at least 3 characters',
    'validation.subjectMaxLength': 'Subject cannot exceed 200 characters',
    'validation.messageRequired': 'Message is required',
    'validation.messageMinLength': 'Message must be at least 10 characters',
    'validation.messageMaxLength': 'Message cannot exceed 2000 characters',
  },
};

/**
 * Función de traducción base
 */
export function translate(key: keyof BaseTranslations, language: Language = 'es'): string {
  return translations[language][key] || key;
}

/**
 * Función para crear un traductor extendido que combina traducciones base con específicas del frontend
 */
export function createExtendedTranslator<T extends Record<string, any>>(
  language: Language,
  extendedTranslations: Record<Language, T>
) {
  return (key: string): string => {
    // Primero buscar en traducciones extendidas
    const extended = extendedTranslations[language]?.[key];
    if (extended !== undefined) return extended;
    
    // Luego buscar en traducciones base
    const base = translations[language]?.[key as keyof BaseTranslations];
    if (base !== undefined) return base;
    
    // Fallback: retornar la key
    return key;
  };
}

/**
 * Función para combinar traducciones base con extendidas
 */
export function mergeTranslations<T extends Record<string, any>>(
  extendedTranslations: Record<Language, T>
): Record<Language, BaseTranslations & T> {
  return {
    es: { ...translations.es, ...extendedTranslations.es },
    en: { ...translations.en, ...extendedTranslations.en },
  };
}
