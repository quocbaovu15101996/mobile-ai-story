import { AxiosInstance, AxiosRequestConfig } from 'axios';
import configuredClient from './client';
import { API_CONFIG } from './config';

// API response type
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

// API methods
export interface ApiClient {
  get: <T = any, R = ApiResponse<T>>(url: string, config?: AxiosRequestConfig) => Promise<R>;
  post: <T = any, R = ApiResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>;
  put: <T = any, R = ApiResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>;
  patch: <T = any, R = ApiResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>;
  delete: <T = any, R = ApiResponse<T>>(url: string, config?: AxiosRequestConfig) => Promise<R>;
  setAuthToken: (token: string | null) => void;
  clearAuthToken: () => void;
  getClient: () => AxiosInstance;
}


const api: ApiClient = {
  // GET request
  get: <T = any, R = ApiResponse<T>>(url: string, config: AxiosRequestConfig = {}) =>
    configuredClient.get<T, R>(url, config) as unknown as Promise<R>,

  // POST request
  post: <T = any, R = ApiResponse<T>>(url: string, data: any = {}, config: AxiosRequestConfig = {}) =>
    configuredClient.post<T, R>(url, data, config) as unknown as Promise<R>,

  // PUT request
  put: <T = any, R = ApiResponse<T>>(url: string, data: any = {}, config: AxiosRequestConfig = {}) =>
    configuredClient.put<T, R>(url, data, config) as unknown as Promise<R>,

  // PATCH request
  patch: <T = any, R = ApiResponse<T>>(url: string, data: any = {}, config: AxiosRequestConfig = {}) =>
    configuredClient.patch<T, R>(url, data, config) as unknown as Promise<R>,

  // DELETE request
  delete: <T = any, R = ApiResponse<T>>(url: string, config: AxiosRequestConfig = {}) =>
    configuredClient.delete<T, R>(url, config) as unknown as Promise<R>,

  // Set authentication token
  setAuthToken: (token: string | null) => {
    if (token) {
      configuredClient.defaults.headers.common['Authorization'] = `${API_CONFIG.AUTH_TYPE} ${token}`;
    } else {
      delete configuredClient.defaults.headers.common['Authorization'];
    }
  },

  // Clear authentication token
  clearAuthToken: () => {
    delete configuredClient.defaults.headers.common['Authorization'];
  },

  // Get the underlying axios instance (use with caution)
  getClient: () => configuredClient,
};

export default api;
