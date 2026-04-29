import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '../utils/api';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('adminToken');
  });

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('adminToken');
      if (storedToken) {
        try {
          const response = await authAPI.verify(storedToken);
          if (response.valid) {
            setIsAuthenticated(true);
            setToken(storedToken);
            setUser(response.user);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
    };

    if (isAuthenticated && token) {
      verifyToken();
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authAPI.login(username, password);
      
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.user));

      setIsAuthenticated(true);
      setUser(response.user);
      setToken(response.token);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || '登录失败' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
