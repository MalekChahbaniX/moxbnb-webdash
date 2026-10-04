import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

function resolveApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://api.moxbnb.com/api'
    : 'http://localhost:3002/api';
}
// function resolveApiBaseUrl(): string {
//   if (process.env.NEXT_PUBLIC_API_URL) {
//     return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
//   }
//   return process.env.NODE_ENV === 'production'
//     ? 'https://moxbnb-back.onrender.com/api'
//     : 'http://localhost:3002/api';
// }

const API_BASE_URL = resolveApiBaseUrl();

/** Origin without trailing /api — for /uploads and static files */
export function getMediaBaseUrl(): string {
  return API_BASE_URL.replace(/\/api\/?$/, '') || 'http://localhost:3002';
}

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/auth
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: any) => {
    // Get token from localStorage or cookies
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('token') || sessionStorage.getItem('token')
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get(url, config),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put(url, data, config),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch(url, data, config),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete(url, config),
};

export default apiClient;
