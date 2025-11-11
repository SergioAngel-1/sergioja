/**
 * Validaciones compartidas para formularios de contacto
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorKey?: string; // Key para traducción
}

export type TranslateFunction = (key: string) => string;

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return {
      isValid: false,
      error: `${fieldName} es requerido`
    };
  }
  return { isValid: true };
};

/**
 * Valida formato de email con mensajes específicos según el error
 */
export const validateEmail = (email: string, t?: TranslateFunction): ValidationResult => {
  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return {
      isValid: false,
      error: t ? t('validation.emailRequired') : 'El email es requerido',
      errorKey: 'validation.emailRequired'
    };
  }

  // Validar que contenga @
  if (!trimmedEmail.includes('@')) {
    return {
      isValid: false,
      error: t ? t('validation.emailInvalid') : 'Ingresa un correo válido (debe incluir "@")',
      errorKey: 'validation.emailInvalid'
    };
  }

  // Validar estructura básica antes y después del @
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return {
      isValid: false,
      error: t ? t('validation.emailInvalid') : 'Ingresa un correo válido',
      errorKey: 'validation.emailInvalid'
    };
  }

  const [localPart, domain] = parts;

  // Validar que el dominio tenga al menos un punto
  if (!domain.includes('.')) {
    return {
      isValid: false,
      error: t ? t('validation.emailDomain') : 'El dominio debe incluir un punto (ej: gmail.com)',
      errorKey: 'validation.emailDomain'
    };
  }

  // Validar que haya texto después del último punto
  const domainParts = domain.split('.');
  const lastPart = domainParts[domainParts.length - 1];
  if (!lastPart || lastPart.length < 2) {
    return {
      isValid: false,
      error: t ? t('validation.emailDomain') : 'El dominio debe tener una extensión válida (ej: .com, .es)',
      errorKey: 'validation.emailDomain'
    };
  }

  // Validar caracteres permitidos (básico)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: t ? t('validation.emailInvalid') : 'Ingresa un correo válido',
      errorKey: 'validation.emailInvalid'
    };
  }

  return { isValid: true };
};

/**
 * Valida longitud mínima
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): ValidationResult => {
  const trimmedValue = value.trim();
  
  if (trimmedValue.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} debe tener al menos ${minLength} caracteres`
    };
  }
  
  return { isValid: true };
};

/**
 * Valida longitud máxima
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): ValidationResult => {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} no puede exceder ${maxLength} caracteres`
    };
  }
  
  return { isValid: true };
};

/**
 * Valida nombre (solo letras, espacios y algunos caracteres especiales)
 */
export const validateName = (name: string, t?: TranslateFunction): ValidationResult => {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return {
      isValid: false,
      error: t ? t('validation.nameRequired') : 'El nombre es requerido',
      errorKey: 'validation.nameRequired'
    };
  }

  // Permitir letras, espacios, acentos, ñ, guiones y apóstrofes
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: t ? t('validation.nameInvalid') : 'El nombre solo puede contener letras y espacios',
      errorKey: 'validation.nameInvalid'
    };
  }

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: t ? t('validation.nameMinLength') : 'El nombre debe tener al menos 2 caracteres',
      errorKey: 'validation.nameMinLength'
    };
  }

  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: t ? t('validation.nameMaxLength') : 'El nombre no puede exceder 100 caracteres',
      errorKey: 'validation.nameMaxLength'
    };
  }

  return { isValid: true };
};

/**
 * Valida asunto
 */
export const validateSubject = (subject: string, t?: TranslateFunction): ValidationResult => {
  const trimmedSubject = subject.trim();
  
  if (!trimmedSubject) {
    return {
      isValid: false,
      error: t ? t('validation.subjectRequired') : 'El asunto es requerido',
      errorKey: 'validation.subjectRequired'
    };
  }

  if (trimmedSubject.length < 3) {
    return {
      isValid: false,
      error: t ? t('validation.subjectMinLength') : 'El asunto debe tener al menos 3 caracteres',
      errorKey: 'validation.subjectMinLength'
    };
  }

  if (trimmedSubject.length > 200) {
    return {
      isValid: false,
      error: t ? t('validation.subjectMaxLength') : 'El asunto no puede exceder 200 caracteres',
      errorKey: 'validation.subjectMaxLength'
    };
  }

  return { isValid: true };
};

/**
 * Valida mensaje
 */
export const validateMessage = (message: string, t?: TranslateFunction): ValidationResult => {
  const trimmedMessage = message.trim();
  
  if (!trimmedMessage) {
    return {
      isValid: false,
      error: t ? t('validation.messageRequired') : 'El mensaje es requerido',
      errorKey: 'validation.messageRequired'
    };
  }

  if (trimmedMessage.length < 10) {
    return {
      isValid: false,
      error: t ? t('validation.messageMinLength') : 'El mensaje debe tener al menos 10 caracteres',
      errorKey: 'validation.messageMinLength'
    };
  }

  if (trimmedMessage.length > 2000) {
    return {
      isValid: false,
      error: t ? t('validation.messageMaxLength') : 'El mensaje no puede exceder 2000 caracteres',
      errorKey: 'validation.messageMaxLength'
    };
  }

  return { isValid: true };
};

/**
 * Valida formulario de contacto completo
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormValidation {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    general?: string;
  };
}

export const validateContactForm = (formData: ContactFormData, t?: TranslateFunction): ContactFormValidation => {
  const errors: ContactFormValidation['errors'] = {};
  
  // Validar nombre
  const nameValidation = validateName(formData.name, t);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }
  
  // Validar email
  const emailValidation = validateEmail(formData.email, t);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Validar asunto
  const subjectValidation = validateSubject(formData.subject, t);
  if (!subjectValidation.isValid) {
    errors.subject = subjectValidation.error;
  }
  
  // Validar mensaje
  const messageValidation = validateMessage(formData.message, t);
  if (!messageValidation.isValid) {
    errors.message = messageValidation.error;
  }
  
  const isValid = Object.keys(errors).length === 0;
  
  return {
    isValid,
    errors
  };
};

/**
 * Sanitiza input de usuario (previene XSS básico)
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .slice(0, 2000); // Limitar longitud máxima
};

/**
 * Sanitiza todos los campos del formulario
 */
export const sanitizeContactForm = (formData: ContactFormData): ContactFormData => {
  return {
    name: sanitizeInput(formData.name).slice(0, 100),
    email: sanitizeInput(formData.email).slice(0, 255),
    subject: sanitizeInput(formData.subject).slice(0, 200),
    message: sanitizeInput(formData.message).slice(0, 2000)
  };
};
