// API response codes
export const RESPONSE_CODES = {
  TOKEN_EXPIRED: 498,
};

// Base API configuration
export const API_CONFIG = {
  BASE_URL: 'https://viable-jointly-hen.ngrok-free.app',
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
    ROLL_CALL: '/v1/users/roll-call',
    EARN_TOKEN_BY_ADS: '/v1/users/earn-token-by-ads',
  },
  THREAD: {
    URL: '/v1/threads',
    RUN: '/run',
  },
};

// Types are now defined globally in src/services/api/types.d.ts
// No need to import interfaces from config.ts
