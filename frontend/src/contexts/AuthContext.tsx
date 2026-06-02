import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/auth';

// Re-export UserRole for use in this file
export { UserRole };

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<{ requiresOnboarding: boolean }>;
  logout: () => void;
  isLoading: boolean;
  requiresOnboarding: boolean;
  setRequiresOnboarding: (value: boolean) => void;
  completeOnboarding: (data: Record<string, any>) => Promise<void>;
}

interface SignupData {
  email: string;
  username: string;
  password: string;
  role: UserRole;
  license_number?: string;
  license_document_url?: string;
  professional_title?: string;
  specialization?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sona-ai-backend.onrender.com/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresOnboarding, setRequiresOnboarding] = useState(false);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        setRequiresOnboarding(Boolean(userData.requires_onboarding));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const getErrorMessage = async (response: Response, fallback: string) => {
    try {
      const data = await response.json();
      if (typeof data.detail === 'string') return data.detail;
      if (Array.isArray(data.detail)) {
        return data.detail.map((item: any) => item.msg).filter(Boolean).join(', ') || fallback;
      }
      return data.message || fallback;
    } catch {
      return fallback;
    }
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const formData = new URLSearchParams();
    formData.set('username', email);
    formData.set('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Login failed'));
    }

    const authData = await response.json();
    const authToken = authData.access_token;
    const userData: User = {
      ...(authData.user || {}),
      requires_onboarding: false,
    };

    setUser(userData);
    setToken(authToken);
    setRequiresOnboarding(false);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const signup = async (userData: SignupData): Promise<{ requiresOnboarding: boolean }> => {
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }

    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!signupResponse.ok) {
      throw new Error(await getErrorMessage(signupResponse, 'Signup failed'));
    }

    const createdUser = await signupResponse.json();
    const loginFormData = new URLSearchParams();
    loginFormData.set('username', userData.email);
    loginFormData.set('password', userData.password);

    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: loginFormData,
    });

    if (!loginResponse.ok) {
      throw new Error(await getErrorMessage(loginResponse, 'Account created, but automatic sign in failed'));
    }

    const authData = await loginResponse.json();
    const requiresMomOnboarding = userData.role === UserRole.MOM;
    const signedInUser: User = {
      ...(authData.user || createdUser),
      requires_onboarding: requiresMomOnboarding,
    };

    setUser(signedInUser);
    setToken(authData.access_token);
    setRequiresOnboarding(requiresMomOnboarding);
    localStorage.setItem('auth_token', authData.access_token);
    localStorage.setItem('auth_user', JSON.stringify(signedInUser));

    return { requiresOnboarding: requiresMomOnboarding };
  };

  const completeOnboarding = async (data: Record<string, any>) => {
    if (!user || !token) {
      throw new Error('User not authenticated');
    }

    // Update user with questionnaire data
    const updatedUser: User = {
      ...user,
      questionnaire_data: data,
      requires_onboarding: false
    };

    setUser(updatedUser);
    setRequiresOnboarding(false);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    
    console.log('Onboarding completed with data:', data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    requiresOnboarding,
    setRequiresOnboarding,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
