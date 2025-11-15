import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiResponse, PaginatedResponse, ContactSubmissionPayload, NewsletterSubscriptionPayload } from '../../shared/types';
import { logger } from './logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/portfolio`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.apiRequest(
          config.method?.toUpperCase() || 'GET',
          config.url || '',
          config.data
        );
        return config;
      },
      (error) => {
        logger.error('API Request Error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.apiResponse(
          response.config.method?.toUpperCase() || 'GET',
          response.config.url || '',
          response.status,
          response.data
        );
        return response;
      },
      (error: AxiosError) => {
        const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
        const url = error.config?.url || 'unknown';

        if (error.response) {
          // Server responded with error status
          logger.apiError(method, url, {
            status: error.response.status,
            data: error.response.data,
          });
        } else if (error.request) {
          // Request made but no response received
          logger.apiError(method, url, {
            message: 'Network Error - No response received',
            error: error.message,
          });
        } else {
          // Error setting up request
          logger.apiError(method, url, {
            message: 'Request Setup Error',
            error: error.message,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Specific API methods
export const api = {
  // Profile
  getProfile: () => apiClient.get('/profile'),

  // Projects
  getProjects: (params?: { tech?: string; category?: string; featured?: boolean; page?: number; limit?: number }) =>
    apiClient.get('/projects', params),
  getProjectBySlug: (slug: string) => apiClient.get(`/projects/${slug}`),

  // Skills
  getSkills: (category?: string) => apiClient.get('/skills', category ? { category } : undefined),
  getSkillProjects: (skillId: string) => apiClient.get(`/skills/${skillId}/projects`),

  // Timeline
  getTimeline: (type?: string) => apiClient.get('/timeline', type ? { type } : undefined),

  // Contact (con reCAPTCHA Enterprise)
  submitContact: (data: ContactSubmissionPayload) => apiClient.post('/contact', data),
  // Newsletter (shared endpoint)
  subscribeNewsletter: (data: NewsletterSubscriptionPayload) => apiClient.post('/newsletter/subscribe', data),

  // Analytics
  getAnalytics: () => apiClient.get('/analytics/summary'),
};
