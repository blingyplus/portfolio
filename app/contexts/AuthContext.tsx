// app/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout, isAuthenticated } from '../lib/appwrite';
import type { Models } from 'appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

  const checkAuth = async () => {
    const isAuth = await isAuthenticated();
    if (isAuth && !user) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    return isAuth;
  };

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    await checkAuth();
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};