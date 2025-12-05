'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar autenticación al cargar (usando cookies httpOnly del backend)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Llamar al endpoint /me que valida la cookie httpOnly
        const response = await api.getMe();
        
        if (response.success && response.data && typeof response.data === 'object' && 'user' in response.data) {
          setUser(response.data.user as User);
          logger.info('Auth: Usuario autenticado', { userId: (response.data.user as User).id });
        } else {
          setUser(null);
          logger.debug('Auth: No hay sesión activa');
        }
      } catch (error: any) {
        // Si es 401, es normal (no hay sesión), no logueamos como error
        if (error?.response?.status === 401) {
          logger.debug('Auth: No autenticado (sin sesión)');
        } else {
          logger.error('Auth: Error verificando sesión', error);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      logger.info('Auth: Intentando login', { email });
      const response = await api.login(email, password);
      
      if (response.success && response.data && typeof response.data === 'object' && 'user' in response.data) {
        // El backend ya configuró las cookies httpOnly (accessToken y refreshToken)
        // Solo necesitamos guardar el usuario en el estado
        const user = response.data.user as User;
        setUser(user);
        logger.info('Auth: Login exitoso', { userId: user.id, email: user.email });
        return true;
      }
      
      logger.warn('Auth: Login fallido - respuesta inválida');
      return false;
    } catch (error: any) {
      logger.error('Auth: Error en login', { 
        email, 
        error: error?.response?.data || error?.message 
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      logger.info('Auth: Cerrando sesión');
      // Llamar al endpoint de logout para revocar el refresh token
      await api.logout();
      logger.info('Auth: Sesión cerrada exitosamente');
    } catch (error: any) {
      logger.error('Auth: Error al cerrar sesión', error);
    } finally {
      // Limpiar estado local
      setUser(null);
      router.push('/login');
    }
  };

  const refreshAuth = async () => {
    try {
      logger.debug('Auth: Refrescando información de usuario');
      // Obtener información actualizada del usuario
      const response = await api.getMe();
      
      if (response.success && response.data && typeof response.data === 'object' && 'user' in response.data) {
        setUser(response.data.user as User);
        logger.debug('Auth: Usuario actualizado');
      } else {
        logger.warn('Auth: Refresh falló - cerrando sesión');
        await logout();
      }
    } catch (error: any) {
      // Si es 401, la sesión expiró
      if (error?.response?.status === 401) {
        logger.info('Auth: Sesión expirada');
      } else {
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
