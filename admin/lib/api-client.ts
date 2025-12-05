import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import type { ApiResponse } from '@/shared/types';
import { logger } from './logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'admin_token';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      timeout: 10000,
      withCredentials: true, // Enviar cookies httpOnly
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - logging
    this.client.interceptors.request.use(
      (config) => {
        // Las cookies httpOnly se envían automáticamente con withCredentials: true
        // No necesitamos manejar tokens manualmente
        
        // Log API request
        logger.apiRequest(
          config.method?.toUpperCase() || 'GET',
          config.url || '',
          config.data
        );
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - manejo de errores, refresh automático y logging
    this.client.interceptors.response.use(
      (response) => {
        // Log successful response
        logger.apiResponse(
          response.config.method?.toUpperCase() || 'GET',
          response.config.url || '',
          response.status,
          response.data
        );
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        const is401 = error.response?.status === 401;
        const isAuthEndpoint = originalRequest.url?.includes('/auth/');
        
        // Solo loguear errores que no sean 401 en endpoints de auth (es normal no estar autenticado)
        if (!(is401 && isAuthEndpoint)) {
          logger.apiError(
            error.config?.method?.toUpperCase() || 'GET',
            error.config?.url || '',
            error.response?.data || error.message
          );
        }
        
        // Si es 401 y no es el endpoint de refresh, intentar refrescar token
        if (is401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
          originalRequest._retry = true;
          
          try {
            // Intentar refrescar el token
            await this.post('/admin/auth/refresh', {});
            
            // Reintentar la petición original
            return this.client(originalRequest);
          } catch (refreshError) {
            // Si el refresh falla, redirigir al login solo si no estamos ya en login
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          message: error.response?.data?.error?.message || error.message,
          code: error.response?.data?.error?.code || 'NETWORK_ERROR',
          details: error.response?.data?.error?.details,
        },
      };
    }
    return {
      success: false,
      error: {
        message: 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
      },
    };
  }
}

export const apiClient = new ApiClient();

// Admin API methods
export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiClient.post('/admin/auth/login', { email, password }),
  
  logout: () => apiClient.post('/admin/auth/logout', {}),
  
  getMe: () => apiClient.get('/admin/auth/me'),
  
  // Profile
  getProfile: () => apiClient.get('/portfolio/profile'),
  updateProfile: (data: any) => apiClient.put('/portfolio/profile', data),

  // Projects
  getProjects: (params?: any) => apiClient.get('/portfolio/projects', params),
  getProjectBySlug: (slug: string) => apiClient.get(`/portfolio/projects/${slug}`),
  createProject: (data: any) => apiClient.post('/portfolio/projects', data),
  updateProject: (slug: string, data: any) => apiClient.put(`/portfolio/projects/${slug}`, data),
  deleteProject: (slug: string) => apiClient.delete(`/portfolio/projects/${slug}`),

  // Skills
  getSkills: (category?: string) => apiClient.get('/portfolio/skills', category ? { category } : undefined),
  createSkill: (data: any) => apiClient.post('/portfolio/skills', data),
  updateSkill: (id: string, data: any) => apiClient.put(`/portfolio/skills/${id}`, data),
  deleteSkill: (id: string) => apiClient.delete(`/portfolio/skills/${id}`),

  // Contact Messages
  getMessages: (params?: any) => apiClient.get('/admin/messages', params),
  getMessageById: (id: string) => apiClient.get(`/admin/messages/${id}`),
  updateMessageStatus: (id: string, status: string) =>
    apiClient.put(`/admin/messages/${id}/status`, { status }),
  deleteMessage: (id: string) => apiClient.delete(`/admin/messages/${id}`),

  // Newsletter
  getSubscribers: (params?: any) => apiClient.get('/admin/newsletter/subscribers', params),
  deleteSubscriber: (id: string) => apiClient.delete(`/admin/newsletter/subscribers/${id}`),

  // Analytics
  getAnalytics: () => apiClient.get('/portfolio/analytics/summary'),
  getPageViews: (params?: any) => apiClient.get('/admin/analytics/page-views', params),
  getProjectViews: (params?: any) => apiClient.get('/admin/analytics/project-views', params),
};
