import type { ApiResponse, Profile, Project, ContactSubmissionPayload, NewsletterSubscriptionPayload } from './types';
import { logger } from '@/lib/logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_URL}/api/portfolio`;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    try {
      logger.apiRequest('GET', url.toString(), params);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      logger.apiResponse('GET', url.toString(), response.status);
      return await response.json();
    } catch (error) {
      logger.apiError('GET', url.toString(), error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'FETCH_ERROR',
        },
      };
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const fullUrl = `${this.baseURL}${endpoint}`;
      logger.apiRequest('POST', fullUrl, data);
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      logger.apiResponse('POST', fullUrl, response.status);
      return await response.json();
    } catch (error) {
      logger.apiError('POST', `${this.baseURL}${endpoint}`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'FETCH_ERROR',
        },
      };
    }
  }
}

const apiClient = new ApiClient();

// Specific API methods for main landing
export const api = {
  // Profile - for Identity modal
  getProfile: () => apiClient.get<Profile>('/profile'),

  // Projects - for Projects modal (only featured)
  getFeaturedProjects: () => apiClient.get<Project[]>('/projects', { featured: true, limit: 6 }),

  // Contact - for Connection modal (con reCAPTCHA Enterprise)
  submitContact: (data: ContactSubmissionPayload) => apiClient.post('/contact', data),
  // Newsletter - shared endpoint
  subscribeNewsletter: (data: NewsletterSubscriptionPayload) => apiClient.post('/newsletter/subscribe', data),
};
