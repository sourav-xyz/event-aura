"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api/config';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe() as { success: boolean; user: User };
      if (response.success) {
        setUser(response.user);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password }) as { success: boolean; user: User };
    if (response.success) {
      setUser(response.user);
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    const response = await authAPI.register(data) as { success: boolean; user: User };
    if (response.success) {
      setUser(response.user);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
