'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, recaptchaToken?: string | null, recaptchaAction?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación al cargar y en cada cambio de ruta
  useEffect(() => {
    let isMounted = true;

    const initAuth = async (retryCount = 0) => {
      const MAX_RETRIES = 2;
      const RETRY_DELAY_MS = 1000;

      // Skip auth check on login page to avoid unnecessary 401 errors
      if (pathname === '/login') {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      
      try {
        // Llamar al endpoint /me que valida la cookie httpOnly
        const response = await api.getMe();
        
        if (!isMounted) return;
        
        if (response.success && response.data && typeof response.data === 'object' && 'user' in response.data) {
          setUser(response.data.user as User);
        } else {
          setUser(null);
          // Redirect to login if not authenticated and not already on login page
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        
        const axiosError = error as { response?: { status?: number }; code?: string };
        
        // Identificar errores de red que ameritan retry
        const isNetworkError = 
          axiosError?.code === 'ECONNABORTED' ||
          axiosError?.code === 'ERR_NETWORK' ||
          axiosError?.code === 'ETIMEDOUT' ||
          !axiosError?.response; // Sin respuesta del servidor
        
        // Si es error de red y aún quedan reintentos
        if (isNetworkError && retryCount < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * Math.pow(2, retryCount); // Backoff exponencial
          logger.warn(`Auth: Error de red, reintentando (${retryCount + 1}/${MAX_RETRIES}) en ${delay}ms`, error);
          
          setTimeout(() => {
            if (isMounted) {
              initAuth(retryCount + 1);
            }
          }, delay);
          return;
        }
        
        // Si es 401, es normal (no hay sesión)
        if (axiosError?.response?.status !== 401) {
          logger.error('Auth: Error verificando sesión', error);
        }
        
        setUser(null);
        // Redirect to login on auth error (except on login page)
        if (pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        if (isMounted && retryCount === 0) {
          // Solo marcar como no loading en el primer intento
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  const login = async (
    email: string,
    password: string,
    recaptchaToken?: string | null,
    recaptchaAction?: string
  ): Promise<boolean> => {
    try {
      const response = await api.login(email, password, recaptchaToken, recaptchaAction);
      
      if (response.success && response.data && typeof response.data === 'object' && 'user' in response.data) {
        // El backend ya configuró las cookies httpOnly (accessToken y refreshToken)
        // Solo necesitamos guardar el usuario en el estado
        const user = response.data.user as User;
        setUser(user);
        
        // En desarrollo, guardar tokens en localStorage como fallback (cookies httpOnly no funcionan entre puertos)
        if (process.env.NODE_ENV === 'development' && 'accessToken' in response.data && 'refreshToken' in response.data) {
          const tokens = response.data as { accessToken: string; refreshToken: string };
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        
        return true;
      }
      
      return false;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: unknown }; message?: string };
      logger.error('Auth: Error en login', { 
        email, 
        error: axiosError?.response?.data || axiosError?.message 
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      // Llamar al endpoint de logout para revocar el refresh token
      await api.logout();
    } catch (error: unknown) {
      logger.error('Auth: Error al cerrar sesión', error);
    } finally {
      // Limpiar estado local
      setUser(null);
      
      // En desarrollo, limpiar tokens de localStorage
      if (process.env.NODE_ENV === 'development') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      
      router.push('/login');
    }
  };

  const refreshAuth = async (retryCount = 0) => {
    const MAX_RETRIES = 2;
    const RETRY_DELAY_MS = 1000;

    try {
      // Obtener información actualizada del usuario
      const response = await api.getMe();
      
      if (response.success && response.data && typeof response.data === 'object' && 'user' in response.data) {
        setUser(response.data.user as User);
      } else {
        await logout();
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number }; code?: string };
      
      // Identificar errores de red que ameritan retry
      const isNetworkError = 
        axiosError?.code === 'ECONNABORTED' ||
        axiosError?.code === 'ERR_NETWORK' ||
        axiosError?.code === 'ETIMEDOUT' ||
        !axiosError?.response;
      
      // Si es error de red y aún quedan reintentos
      if (isNetworkError && retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
        logger.warn(`Auth: Error de red al refrescar, reintentando (${retryCount + 1}/${MAX_RETRIES}) en ${delay}ms`, error);
        
        setTimeout(() => {
          refreshAuth(retryCount + 1);
        }, delay);
        return;
      }
      
      // Si no es 401, loguear error
      if (axiosError?.response?.status !== 401) {
        logger.error('Auth: Error refrescando usuario', error);
      }
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
