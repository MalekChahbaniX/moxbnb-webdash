import { api } from '@/lib/api';

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'GUEST' | 'CLIENT' | 'HOST' | 'PROVIDER' | 'ADMIN';
  // Provider specific fields
  serviceTypes?: string[];
  companyName?: string;
  specialization?: string;
  experience?: string;
  // Host specific fields
  propertyTypes?: string[];
  address?: string;
  city?: string;
  description?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    token?: string;
    refreshToken?: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      isVerified?: boolean;
      avatar?: string;
    };
  };
}

// Authentication service
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (response.data.success && response.data.data?.token) {
        // Store tokens in localStorage
        localStorage.setItem('token', response.data.data.token);
        if (response.data.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
        
        // Store user data
        if (response.data.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      
      if (response.data.success && response.data.data?.token) {
        // Store tokens in localStorage
        localStorage.setItem('token', response.data.data.token);
        if (response.data.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
        
        // Store user data
        if (response.data.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/verify-email', { token });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Email verification failed';
      throw new Error(errorMessage);
    }
  },

  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/resend-verification', { email });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Could not resend verification email';
      throw new Error(errorMessage);
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get current user');
    }
  },

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<AuthResponse>('/auth/refresh-token', {
        refreshToken,
      });

      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        if (response.data.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
      }

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Token refresh failed';
      throw new Error(errorMessage);
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  },

  // Get stored user data
  getUser(): any {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },
};

export default authService;
