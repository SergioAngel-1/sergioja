// Shared types between Portfolio frontend and backend

// Re-export alert types
export type { Alert, AlertType, AlertPosition, AlertConfig } from './alertSystem';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Profile Information - Matches Prisma schema
export interface Profile {
  id: string;
  name: string;
  availability: string; // available, busy, unavailable
  location: string;
  email: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  // Campos base del schema de Prisma
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  categories: string[]; // Array de categorías (web, mobile, ai, backend, fullstack)
  featured: boolean;
  demoUrl?: string;
  repoUrl?: string;
  githubUrl?: string; // Alias for repoUrl
  isCodePublic: boolean; // Indica si el código fuente es público
  performanceScore?: number | null;
  accessibilityScore?: number | null;
  seoScore?: number | null;
  publishedAt?: string | null; // Fecha de publicación (null = borrador)
  createdAt: string;
  updatedAt: string;
  
  // Campos derivados/computados (no en BD)
  category?: string; // Primera categoría (retrocompatibilidad)
  technologies?: any[]; // Relación con ProjectTechnology
  tech?: string[]; // Alias para technologies (usado en frontend)
  status?: 'completed' | 'in-progress' | 'planned'; // Derivado de publishedAt
  metrics?: {
    performance: number;
    accessibility: number;
    seo: number;
  }; // Alias para performanceScore, accessibilityScore, seoScore
}

// Technology/Skill - Shared across all projects
export interface Skill {
  id: string;
  name: string;
  category: string; // frontend, backend, devops, design, other
  proficiency: number; // 0-100
  yearsOfExperience: number;
  icon?: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// For form submission (without id and timestamps)
export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Payload extendido para envío desde el frontend con reCAPTCHA Enterprise
export interface ContactSubmissionPayload extends ContactMessage {
  recaptchaToken?: string;
  recaptchaAction?: string;
}

// Payload for newsletter subscription from frontends with optional reCAPTCHA Enterprise
export interface NewsletterSubscriptionPayload {
  email: string;
  recaptchaToken?: string;
  recaptchaAction?: string;
}

// Analytics Summary (derived/computed, not in DB)
export interface AnalyticsSummary {
  totalProjects: number;
  totalSkills: number;
  yearsOfExperience: number;
  completedProjects: number;
  inProgressProjects: number;
}
