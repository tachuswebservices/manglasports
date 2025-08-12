import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, API_CONFIG } from '@/config/api';

interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyUserRole: (authToken: string) => Promise<boolean>;
  checkAuthStatus: () => Promise<boolean>;
  refreshUserData: () => Promise<boolean>;
  handleTokenExpiration: () => void;
  handleNetworkError: (error: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verify user role from server
  const verifyUserRole = async (authToken: string): Promise<boolean> => {
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.AUTH.VERIFY_ROLE), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      } else {
        // Token is invalid or expired
        console.log('Token verification failed, clearing auth state');
        handleTokenExpiration();
        return false;
      }
    } catch (error) {
      console.error('Role verification failed:', error);
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        handleNetworkError(error);
        return false; // Don't logout on network errors
      }
      // For other errors, logout the user
      handleTokenExpiration();
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          console.log('Found stored token, verifying...');
          setToken(storedToken);
          // Verify token and get user data from server
          const isValid = await verifyUserRole(storedToken);
          if (isValid) {
            console.log('Token verified successfully, user authenticated');
          } else {
            console.log('Token verification failed, user not authenticated');
          }
        } else {
          console.log('No stored token found');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(buildApiUrl(API_CONFIG.AUTH.LOGIN), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.error || 'Login failed');
      (error as any).needsVerification = data.needsVerification;
      throw error;
    }
    
    // Only store token, not user data
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    navigate('/');
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await fetch(buildApiUrl(API_CONFIG.AUTH.SIGNUP), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    // Don't automatically log in after signup - user needs to verify email first
    // The signup page will handle the success message
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Check if token is still valid (useful for protected routes)
  const checkAuthStatus = async () => {
    if (!token) return false;
    return await verifyUserRole(token);
  };

  // Refresh user data from server
  const refreshUserData = async () => {
    if (!token) return false;
    return await verifyUserRole(token);
  };

  // Check if token is expired and handle cleanup
  const handleTokenExpiration = () => {
    console.log('Token expired, logging out user');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Handle network errors gracefully
  const handleNetworkError = (error: any) => {
    console.error('Network error during authentication:', error);
    // Don't logout on network errors, just show error
    // This prevents users from being logged out due to temporary network issues
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      loading, 
      login, 
      signup, 
      logout,
      verifyUserRole,
      checkAuthStatus,
      refreshUserData,
      handleTokenExpiration,
      handleNetworkError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 