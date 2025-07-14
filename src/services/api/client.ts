import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from './config';
import { setupInterceptors } from './interceptors';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Set up interceptors
const configuredClient = setupInterceptors(apiClient);

export default configuredClient;
