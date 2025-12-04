// Re-export shared types
export type {
  ApiResponse,
  PaginatedResponse,
  Profile,
  Project,
  Skill,
  ContactMessage,
  ContactFormData,
  AnalyticsSummary,
} from '@/shared/types';

// Admin-specific types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface DashboardStats {
  totalProjects: number;
  totalMessages: number;
  totalSubscribers: number;
  totalViews: number;
  recentMessages: number;
  recentSubscribers: number;
}

export interface MessageWithDetails {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'spam';
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  createdAt: string;
  updatedAt: string;
}

export interface PageView {
  id: string;
  path: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  createdAt: string;
}

export interface ProjectView {
  id: string;
  projectId: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  createdAt: string;
}
