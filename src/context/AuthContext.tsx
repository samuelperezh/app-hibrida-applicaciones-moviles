import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getUser, saveUser, clearUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = getUser();
        setUser(savedUser);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate authentication - in a real app, this would validate against a server
    if (username && password) {
      const userData: User = {
        id: Date.now().toString(),
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@panapp.com`,
        createdAt: new Date().toISOString(),
      };

      saveUser(userData);
      setUser(userData);
      return true;
    }

    return false;
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      saveUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};