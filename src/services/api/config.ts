// API response codes
export const RESPONSE_CODES = {
  TOKEN_EXPIRED: 498,
};

const appJson = require('../../../app.json');

// Base API configuration
export const API_CONFIG = {
  // BASE_URL: 'https://viable-jointly-hen.ngrok-free.app',
  // BASE_URL: 'http://192.168.200.34:8080',
  BASE_URL: 'http://192.168.0.100:8080',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': appJson?.expo?.version,
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
    RUNS: '/runs',
    CONTINUE: '/continue',
    EXPAND: '/expand',
    ERASE: '/erase',
    REWRITE: '/rewrite',
  },
};

// Types are now defined globally in src/services/api/types.d.ts
// No need to import interfaces from config.ts
