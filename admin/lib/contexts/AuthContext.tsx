'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { api } from '@/lib/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'admin_token';
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'cd3d9cecce29ee22d1b785ac943730fceb5799b30ae19e894136d26787c160c2';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar token al cargar
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get(TOKEN_KEY);
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as User;
          setUser(decoded);
        } catch (error) {
          Cookies.remove(TOKEN_KEY);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(email, password);
      
      if (response.success && response.data) {
        const data = response.data as { token: string; user: User };
        const token = data.token;
        
        // Guardar token en cookie (7 días)
        Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
        
        // Decodificar y guardar usuario
        const decoded = jwt.verify(token, JWT_SECRET) as User;
        setUser(decoded);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove(TOKEN_KEY);
    setUser(null);
    router.push('/login');
  };

  const refreshAuth = async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as User;
        setUser(decoded);
      } catch (error) {
        logout();
      }
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
