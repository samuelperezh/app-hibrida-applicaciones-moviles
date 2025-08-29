import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getUser, saveUser, clearUser, authenticateUser, registerNewUser, updateStoredUserProfile, changeStoredUserPassword } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (data: { username: string; password: string; name: string; email?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
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
    const authenticated = await authenticateUser(username, password);
    if (!authenticated) return false;
    saveUser(authenticated);
    setUser(authenticated);
    return true;
  };

  const register = async (data: { username: string; password: string; name: string; email?: string }): Promise<{ ok: boolean; error?: string }> => {
    const result = await registerNewUser(data);
    if (result.ok && result.user) {
      saveUser(result.user);
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error };
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
      updateStoredUserProfile(user.id, userData);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ ok: boolean; error?: string }> => {
    if (!user) return { ok: false, error: 'Usuario no autenticado' };
    if (newPassword.length < 6) return { ok: false, error: 'La nueva contraseña es muy corta' };
    return changeStoredUserPassword(user.id, currentPassword, newPassword);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    changePassword,
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