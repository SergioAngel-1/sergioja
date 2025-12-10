// Re-export shared types
export type {
  ApiResponse,
  PaginatedResponse,
  Profile,
  Project,
  ContactMessage,
  ContactFormData,
  AnalyticsSummary,
} from '@/shared/types';

import type { Skill as BaseSkill } from '@/shared/types';

// Extend Skill to include projects relation for admin
export interface Skill extends BaseSkill {
  projects?: { projectId: string }[];
}

// Admin-specific types (from Prisma schema)

// Admin User - Full model from database
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string; // bcrypt hash
  role: 'admin' | 'editor';
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Refresh Token - For JWT authentication
export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  revokedAt?: string | null;
  createdAt: string;
  user?: AdminUser;
}

// Contact Submission - Full model from database
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: 'new' | 'read' | 'replied' | 'spam';
  createdAt: string;
  updatedAt: string;
}

// Newsletter Subscription - Full model from database
export interface NewsletterSubscription {
  id: string;
  email: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: 'active' | 'unsubscribed';
  createdAt: string;
  updatedAt: string;
}

// Project View Analytics - Full model from database
export interface ProjectView {
  id: string;
  projectId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
  createdAt: string;
  project?: import('@/shared/types').Project;
}

// Page View Analytics - Full model from database
export interface PageView {
  id: string;
  path: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
  createdAt: string;
}

// Project Category - Full model from database
export interface ProjectCategory {
  id: string;
  name: string;
  label: string;
  description?: string | null;
  color: string;
  icon?: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Technology Category - Full model from database
export interface TechnologyCategory {
  id: string;
  name: string;
  label: string;
  description?: string | null;
  color: string;
  icon?: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ProjectTechnology - Many-to-Many relation
export interface ProjectTechnology {
  projectId: string;
  technologyId: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
  createdAt: string;
  project?: import('@/shared/types').Project;
  technology?: import('@/shared/types').Skill;
}

// Admin-specific UI types

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface DashboardStats {
  // Campos del endpoint /api/admin/dashboard/stats
  projects: number;
  messages: number;
  subscribers: number;
  visits: number;
  
  // Campos adicionales opcionales
  totalProjects?: number;
  totalMessages?: number;
  totalSubscribers?: number;
  totalViews?: number;
  recentMessages?: number;
  recentSubscribers?: number;
}
