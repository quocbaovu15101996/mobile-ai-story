import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { API_CONFIG, RESPONSE_CODES } from './config';

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
  // Request interceptor
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const { token } = useAuthStore.getState();
      
      if (token) {
        config.headers.Authorization = `${API_CONFIG.AUTH_TYPE} ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      // If error is 498 (Token Expired), try to refresh token
      if (
        error.response?.status === RESPONSE_CODES.TOKEN_EXPIRED &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `${API_CONFIG.AUTH_TYPE} ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { loginByDevice } = useAuthStore.getState();
          const newToken = await loginByDevice();
          
          if (newToken) {
            originalRequest.headers.Authorization = `${API_CONFIG.AUTH_TYPE} ${newToken}`;
            processQueue(null, newToken);
            return instance(originalRequest);
          }
          
          throw new Error('Failed to refresh token');
        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().clearToken();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};
