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

export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline?: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  availability?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  image?: string;
  images?: string[];
  technologies: string[];
  tech: string[]; // Alias para technologies (usado en frontend)
  category: string;
  featured: boolean;
  demoUrl?: string;
  githubUrl?: string;
  repoUrl?: string; // Alias para githubUrl
  status: 'completed' | 'in-progress' | 'planned';
  startDate?: string;
  endDate?: string;
  metrics?: {
    performance: number;
    accessibility: number;
    seo: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience?: number;
  icon?: string;
  color?: string;
  description?: string;
  projects?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  type: 'work' | 'education' | 'project' | 'achievement';
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

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

export interface AnalyticsSummary {
  totalProjects: number;
  totalSkills: number;
  yearsOfExperience: number;
  completedProjects: number;
  inProgressProjects: number;
}
