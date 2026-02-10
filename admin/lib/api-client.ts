import axios, { AxiosInstance, AxiosError } from 'axios';
// import Cookies from 'js-cookie'; // Not used with httpOnly cookies
import type { ApiResponse } from '@/shared/types';
import { logger } from './logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// const TOKEN_KEY = 'admin_token'; // Not used with httpOnly cookies

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;

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
        // En desarrollo, usar localStorage como fallback (cookies no funcionan entre puertos)
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
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
        const originalRequest = error.config as typeof error.config & { _retry?: boolean };
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
            // Si ya hay un refresh en progreso, esperar a que termine
            if (this.isRefreshing && this.refreshPromise) {
              logger.info('Waiting for ongoing token refresh...');
              await this.refreshPromise;
              
              // Después del refresh, reintentar con el nuevo token
              if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
                const newToken = localStorage.getItem('accessToken');
                if (newToken && originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
              }
              
              return this.client(originalRequest);
            }
            
            // Marcar que estamos refrescando
            this.isRefreshing = true;
            
            // Crear la promesa de refresh
            this.refreshPromise = (async () => {
              try {
                logger.info('Starting token refresh...');
                
                // Intentar refrescar el token usando axios directamente para evitar interceptor
                const refreshPayload: Record<string, string> = {};
                if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
                  const refreshToken = localStorage.getItem('refreshToken');
                  if (refreshToken) {
                    refreshPayload.refreshToken = refreshToken;
                  }
                }
                
                const refreshResponse = await axios.post(
                  `${API_URL}/api/admin/auth/refresh`,
                  refreshPayload,
                  {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                  }
                );
                
                // En desarrollo, actualizar tokens en localStorage
                if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && refreshResponse.data?.data) {
                  const data = refreshResponse.data.data as { accessToken?: string; refreshToken?: string };
                  if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    logger.info('Access token refreshed successfully');
                  }
                  if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                  }
                  
                  // Actualizar header de la petición original con el nuevo token
                  if (originalRequest.headers && data.accessToken) {
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                  }
                }
                
                return refreshResponse;
              } finally {
                // Limpiar el estado de refresh
                this.isRefreshing = false;
                this.refreshPromise = null;
              }
            })();
            
            // Esperar a que termine el refresh
            await this.refreshPromise;
            
            // Reintentar la petición original
            return this.client(originalRequest);
          } catch (refreshError) {
            // Limpiar el estado de refresh
            this.isRefreshing = false;
            this.refreshPromise = null;
            
            // Si el refresh falla, limpiar tokens y redirigir al login
            logger.error('Token refresh failed, redirecting to login');
            if (typeof window !== 'undefined') {
              if (process.env.NODE_ENV === 'development') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
              }
              if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
              }
            }
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data);
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

  private handleError(error: unknown): ApiResponse<never> {
    if (axios.isAxiosError(error)) {
      // Error de red (sin respuesta del servidor)
      if (!error.response) {
        return {
          success: false,
          error: {
            message: error.code === 'ECONNABORTED' 
              ? 'La solicitud tardó demasiado tiempo. Verifica tu conexión.'
              : 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
            code: 'NETWORK_ERROR',
            details: error.message,
          },
        };
      }

      // Error HTTP del servidor
      const status = error.response.status;
      let message = error.response?.data?.error?.message || error.message;
      let code = error.response?.data?.error?.code || 'SERVER_ERROR';

      // Mensajes específicos por código de estado
      if (status === 401) {
        message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        code = 'UNAUTHORIZED';
      } else if (status === 403) {
        message = 'No tienes permisos para realizar esta acción.';
        code = 'FORBIDDEN';
      } else if (status === 404) {
        message = 'El recurso solicitado no existe.';
        code = 'NOT_FOUND';
      } else if (status === 429) {
        message = 'Demasiadas solicitudes. Por favor, espera un momento.';
        code = 'RATE_LIMIT';
      } else if (status >= 500) {
        message = 'Error del servidor. Por favor, intenta más tarde.';
        code = 'SERVER_ERROR';
      }

      return {
        success: false,
        error: {
          message,
          code,
          details: error.response?.data?.error?.details,
        },
      };
    }

    // Error desconocido
    return {
      success: false,
      error: {
        message: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
        code: 'UNKNOWN_ERROR',
      },
    };
  }
}

export const apiClient = new ApiClient();

// Admin API methods
export const api = {
  // Auth
  login: (
    email: string,
    password: string,
    recaptchaToken?: string | null,
    recaptchaAction?: string
  ) => {
    const payload: { email: string; password: string; recaptchaToken?: string; recaptchaAction?: string } = { 
      email, 
      password 
    };
    if (recaptchaToken) {
      payload.recaptchaToken = recaptchaToken;
      if (recaptchaAction) {
        payload.recaptchaAction = recaptchaAction;
      }
    }
    return apiClient.post('/admin/auth/login', payload);
  },
  
  logout: () => apiClient.post('/admin/auth/logout', {}),
  
  getMe: () => apiClient.get('/admin/auth/me'),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/admin/auth/change-password', data),
  
  // Profile
  getProfile: () => apiClient.get('/portfolio/profile'),
  updateProfile: (data: Record<string, unknown>) => apiClient.put('/portfolio/profile', data),

  // Projects
  getProjects: (params?: Record<string, unknown>) => apiClient.get('/admin/projects', params),
  getProjectBySlug: (slug: string) => apiClient.get(`/admin/projects/${slug}`),
  createProject: (data: Record<string, unknown>) => apiClient.post('/admin/projects', data),
  updateProject: (identifier: string, data: Record<string, unknown>) =>
    apiClient.put(`/admin/projects/${identifier}`, data),
  deleteProject: (slug: string) => apiClient.delete(`/admin/projects/${slug}`),
  regenerateProjectSlug: (slug: string, title?: string, manualSlug?: string) => 
    apiClient.post(`/admin/projects/${slug}/regenerate-slug`, { title, manualSlug }),

  checkProjectSlug: (slug: string, excludeSlug?: string) =>
    apiClient.get('/admin/projects/slug/check', {
      slug,
      ...(excludeSlug ? { excludeSlug } : {}),
    }),

  // Skills
  getSkills: (category?: string) => apiClient.get('/portfolio/skills', category ? { category } : undefined),
  createSkill: (data: Record<string, unknown>) => apiClient.post('/portfolio/skills', data),
  updateSkill: (id: string, data: Record<string, unknown>) => apiClient.put(`/portfolio/skills/${id}`, data),
  deleteSkill: (id: string) => apiClient.delete(`/portfolio/skills/${id}`),

  // Contact Messages
  getMessages: (params?: Record<string, unknown>) => apiClient.get('/admin/messages', params),
  getMessageById: (id: string) => apiClient.get(`/admin/messages/${id}`),
  updateMessageStatus: (id: string, status: string) =>
    apiClient.put(`/admin/messages/${id}/status`, { status }),
  deleteMessage: (id: string) => apiClient.delete(`/admin/messages/${id}`),

  // Newsletter
  getSubscribers: (params?: Record<string, unknown>) => apiClient.get('/admin/newsletter/subscribers', params),
  markSubscriberAsRead: (id: string, isRead: boolean = true) => apiClient.patch(`/admin/newsletter/subscribers/${id}`, { isRead }),
  deleteSubscriber: (id: string) => apiClient.delete(`/admin/newsletter/subscribers/${id}`),

  // Analytics
  getAnalytics: () => apiClient.get('/portfolio/analytics/summary'),
  getPageViews: (params?: { timeRange?: string; limit?: number; offset?: number }) =>
    apiClient.get('/admin/analytics/page-views', params),
  getProjectViews: (params?: { timeRange?: string; limit?: number; offset?: number }) =>
    apiClient.get('/admin/analytics/project-views', params),
  getWebVitals: (params?: { timeRange?: string; metric?: string; rating?: string; limit?: number; offset?: number }) =>
    apiClient.get('/admin/analytics/web-vitals', params),
  cleanupWebVitals: (daysOld?: number) =>
    apiClient.post('/admin/analytics/web-vitals/cleanup', { daysOld }),
  deleteAllWebVitals: () =>
    apiClient.delete('/admin/analytics/web-vitals'),
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),

  // Categories
  getProjectCategories: () => apiClient.get('/admin/categories/projects'),
  getTechnologyCategories: () => apiClient.get('/admin/categories/technologies'),
  createCategory: (type: 'projects' | 'technologies', data: Record<string, unknown>) =>
    apiClient.post(`/admin/categories/${type}`, data),
  updateCategory: (type: 'projects' | 'technologies', id: string, data: Record<string, unknown>) =>
    apiClient.put(`/admin/categories/${type}/${id}`, data),
  deleteCategory: (type: 'projects' | 'technologies', id: string) =>
    apiClient.delete(`/admin/categories/${type}/${id}`),

  // Export / Import
  exportFullDatabase: () => apiClient.get('/admin/export/full'),
  importFullDatabase: (data: Record<string, unknown>) => apiClient.post('/admin/export/import', data),

  // Redirects
  getRedirects: (options?: { skipCache?: boolean }) => 
    apiClient.get('/admin/redirects', options?.skipCache ? { cache: 'no-store' } : undefined),
  deleteRedirect: (id: string) => apiClient.delete(`/admin/redirects/${id}`),
  createRedirect: (payload: { oldSlug: string; newSlug: string }) =>
    apiClient.post('/admin/redirects', payload),
};
