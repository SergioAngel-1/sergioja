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
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - añadir token y logging
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
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

    // Response interceptor - manejo de errores y logging
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
      (error: AxiosError) => {
        // Log API error
        logger.apiError(
          error.config?.method?.toUpperCase() || 'GET',
          error.config?.url || '',
          error.response?.data || error.message
        );
        
        if (error.response?.status === 401) {
          // Token inválido o expirado
          Cookies.remove(TOKEN_KEY);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
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
