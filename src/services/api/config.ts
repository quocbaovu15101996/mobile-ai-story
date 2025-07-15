// API response codes
export const RESPONSE_CODES = {
  TOKEN_EXPIRED: 498,
};

// Base API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  AUTH_TYPE: 'Bearer',
};

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN_BY_DEVICE: '/v1/auth/login-by-device',
  },
  USERS: {
    PROFILE: '/v1/users/profile',
  },
  THREAD: {
    GET_HISTORY: '/v1/threads',
  },
};

// Types are now defined globally in src/services/api/types.d.ts
// No need to import interfaces from config.ts
