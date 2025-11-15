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
  'nav.purpose': string;
  'nav.connection': string;
  'nav.navigation': string;
  'nav.sections': string;
  'nav.language': string;
  'nav.clickToView': string;
  'nav.clickToChangeLanguage': string;
  
  // Identity
  'identity.title': string;
  'identity.paragraph1': string;
  'identity.paragraph2': string;
  'identity.available': string;
  'purpose.title': string;
  'purpose.paragraph1': string;
  'purpose.paragraph2': string;
  
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
  
  // reCAPTCHA disclaimer
  'recaptcha.disclaimer': string;
  'recaptcha.privacy': string;
  'recaptcha.terms': string;
  
  // Matrix mode
  'matrix.warning': string;
  'matrix.systemAlert': string;
  'matrix.message': string;
  'matrix.highCPU': string;
  'matrix.highGPU': string;
  'matrix.batteryDrain': string;
  'matrix.recommendation': string;
  'matrix.cancel': string;
  'matrix.activate': string;
  
  // Dev Tips Modal
  'devTips.title': string;
  'devTips.description': string;
  'devTips.benefit1': string;
  'devTips.benefit2': string;
  'devTips.benefit3': string;
  'devTips.emailLabel': string;
  'devTips.emailPlaceholder': string;
  'devTips.emailRequired': string;
  'devTips.emailInvalid': string;
  'devTips.submitError': string;
  'devTips.submitting': string;
  'devTips.subscribe': string;
  'devTips.success': string;
  
  // Common
  'common.cancel': string;

  // Gyroscope
  'gyro.movePhone': string;
  'gyro.enable': string;
  'newsletter.label': string;
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
    'nav.purpose': 'Propósito',
    'nav.navigation': 'Navegación',
    'nav.connection': 'Conexión',
    'nav.sections': 'SECCIONES',
    'nav.language': 'IDIOMA',
    'nav.clickToView': 'Haz clic para ver cada sección',
    'nav.clickToChangeLanguage': 'Haz clic para cambiar de idioma',
    
    // Identity
    'identity.title': 'Ser el puente entre ideas abstractas y realidades digitales.',
    'identity.paragraph1': 'Como explorador en la intersección de tecnología e innovación, valoro la simplicidad en medio de la complejidad, priorizando soluciones intuitivas que respeten al usuario y generen resultados.',
    'identity.paragraph2': 'Mi esencia se define por una curiosidad incesante que me impulsa a desafiar límites. Siempre guiado por el deseo de inspirar a otros a materializar conceptos audaces que transformen sus necesidades.',
    'identity.available': 'Creemos algo grande.',
    
    'purpose.title': 'Impulsar un futuro donde la tecnología eleve la humanidad.',
    'purpose.paragraph1': 'Creo en la tecnología como catalizador para ideas que generen impacto positivo a escala global. Mi enfoque radica en fusionar innovación técnica con diseño empático, creando soluciones que resuelvan problemas complejos de manera sostenible y accesible.',
    'purpose.paragraph2': 'Me motiva el equilibrio entre funcionalidad y experiencia humana, anticipando necesidades futuras para construir un ecosistema digital que inspire cambio',
    
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
    'connection.emailHandle': 'contact@sergioja.com',
    'connection.emailDesc': 'Contacto directo',
    'connection.formTitle': 'Envíame un mensaje',
    'connection.namePlaceholder': 'Nombre',
    'connection.emailPlaceholder': 'Email',
    'connection.messagePlaceholder': 'Tu mensaje...',
    'connection.sendButton': 'ENVIAR MENSAJE',
    'connection.sendingButton': 'ENVIANDO...',
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
    
    // reCAPTCHA disclaimer
    'recaptcha.disclaimer': 'Este sitio está protegido por reCAPTCHA y se aplican la',
    'recaptcha.privacy': 'Política de Privacidad',
    'recaptcha.terms': 'Términos de Servicio',
    
    // Matrix mode
    'matrix.warning': 'ALERTA: MODO MATRIX',
    'matrix.systemAlert': 'Alerta del sistema',
    'matrix.message': 'El modo Matrix es visualmente intensivo y puede afectar el rendimiento de tu dispositivo, especialmente en móviles y laptops.',
    'matrix.highCPU': 'Uso elevado de CPU',
    'matrix.highGPU': 'Uso elevado de GPU',
    'matrix.batteryDrain': 'Mayor consumo de batería',
    'matrix.recommendation': 'Recomendación: úsalo solo si tu dispositivo es potente.',
    'matrix.cancel': 'Cancelar',
    'matrix.activate': 'Activar Matrix',
    
    // Dev Tips Modal
    'devTips.title': 'Dev Tips',
    'devTips.description': 'Recibe tips de desarrollo, mejores prácticas y recursos directamente en tu inbox.',
    'devTips.benefit1': 'Tips semanales de desarrollo',
    'devTips.benefit2': 'Recursos y herramientas útiles',
    'devTips.benefit3': 'Actualizaciones de proyectos',
    'devTips.emailLabel': 'Email',
    'devTips.emailPlaceholder': 'tu@email.com',
    'devTips.emailRequired': 'El email es requerido',
    'devTips.emailInvalid': 'Email inválido',
    'devTips.submitError': 'Error al suscribirse. Intenta de nuevo.',
    'devTips.submitting': 'Enviando...',
    'devTips.subscribe': 'Suscribirse',
    'devTips.success': '¡Suscripción completada!',
    
    // Common
    'common.cancel': 'Cancelar',

    // Gyroscope
    'gyro.movePhone': 'Mueve tu móvil',
    'gyro.enable': 'ACTIVAR GIROSCOPIO',
    'newsletter.label': 'Newsletter',
  },
  en: {
    // Navigation
    'nav.portfolio': 'Portfolio',
    'nav.portfolioDesc': 'View complete works and projects',
    'nav.identity': 'Identity',
    'nav.projects': 'Projects',
    'nav.purpose': 'Purpose',
    'nav.navigation': 'Navigation',
    'nav.connection': 'Connection',
    'nav.sections': 'SECTIONS',
    'nav.language': 'LANGUAGE',
    'nav.clickToView': 'Click to view each section',
    'nav.clickToChangeLanguage': 'Click to change language',
    
    // Identity
    'identity.title': 'The bridge between abstract ideas and digital realities.',
    'identity.paragraph1': 'As an explorer at the intersection of technology and innovation, I value simplicity amid complexity, prioritizing intuitive solutions that respect the user and drive results.',
    'identity.paragraph2': 'My essence is defined by relentless curiosity that pushes me to challenge limits. Always guided by the desire to inspire others to bring bold concepts to life that transform their needs into reality.',
    'identity.available': 'Let\'s build something great.',
    
    'purpose.title': 'Driving a future where technology elevates humanity.',
    'purpose.paragraph1': 'I believe in technology as a catalyst for ideas that create positive, global-scale impact. My focus is on blending technical innovation with empathetic design to build solutions that solve complex problems sustainably and accessibly.',
    'purpose.paragraph2': 'I am motivated by the balance between functionality and human experience, anticipating future needs to build a digital ecosystem that inspires change',
    
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
    'connection.emailHandle': 'contact@sergioja.com',
    'connection.emailDesc': 'Direct contact',
    'connection.formTitle': 'Send me a message',
    'connection.namePlaceholder': 'Name',
    'connection.emailPlaceholder': 'Email',
    'connection.messagePlaceholder': 'Your message...',
    'connection.sendButton': 'SEND MESSAGE',
    'connection.sendingButton': 'SENDING...',
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
    
    // reCAPTCHA disclaimer
    'recaptcha.disclaimer': 'This site is protected by reCAPTCHA and the Google',
    'recaptcha.privacy': 'Privacy Policy',
    'recaptcha.terms': 'Terms of Service',
    
    // Matrix mode
    'matrix.warning': 'ALERT: MATRIX MODE',
    'matrix.systemAlert': 'System alert',
    'matrix.message': 'Matrix mode is visually intensive and may affect your device performance, especially on mobile and laptops.',
    'matrix.highCPU': 'High CPU usage',
    'matrix.highGPU': 'High GPU usage',
    'matrix.batteryDrain': 'Battery drain',
    'matrix.recommendation': 'Recommendation: use only on capable hardware.',
    'matrix.cancel': 'Cancel',
    'matrix.activate': 'Activate Matrix',
    
    // Dev Tips Modal
    'devTips.title': 'Dev Tips',
    'devTips.description': 'Get development tips, best practices, and resources directly in your inbox.',
    'devTips.benefit1': 'Weekly development tips',
    'devTips.benefit2': 'Useful resources and tools',
    'devTips.benefit3': 'Project updates',
    'devTips.emailLabel': 'Email',
    'devTips.emailPlaceholder': 'your@email.com',
    'devTips.emailRequired': 'Email is required',
    'devTips.emailInvalid': 'Invalid email',
    'devTips.submitError': 'Error subscribing. Please try again.',
    'devTips.submitting': 'Submitting...',
    'devTips.subscribe': 'Subscribe',
    'devTips.success': 'Subscription completed!',
    
    // Common
    'common.cancel': 'Cancel',

    // Gyroscope
    'gyro.movePhone': 'Move your phone',
    'gyro.enable': 'ENABLE GYROSCOPE',
    'newsletter.label': 'Newsletter',
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
  if (!extendedTranslations) {
    return translations as Record<Language, BaseTranslations & T>;
  }
  
  return {
    es: { ...translations.es, ...(extendedTranslations.es || {}) },
    en: { ...translations.en, ...(extendedTranslations.en || {}) },
  };
}
