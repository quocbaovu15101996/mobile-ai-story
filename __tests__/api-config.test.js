// Test for API configuration
describe('API Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export RESPONSE_CODES with correct values', () => {
    const { RESPONSE_CODES } = require('../src/services/api/config');
    
    expect(RESPONSE_CODES).toHaveProperty('TOKEN_EXPIRED');
    expect(RESPONSE_CODES.TOKEN_EXPIRED).toBe(498);
  });

  it('should export API_CONFIG with correct structure', () => {
    // Mock app.json
    jest.doMock('../app.json', () => ({
      expo: {
        version: '1.0.0',
      },
    }));

    jest.resetModules();
    const { API_CONFIG } = require('../src/services/api/config');
    
    expect(API_CONFIG).toHaveProperty('BASE_URL');
    expect(API_CONFIG).toHaveProperty('TIMEOUT');
    expect(API_CONFIG).toHaveProperty('HEADERS');
    expect(API_CONFIG).toHaveProperty('AUTH_TYPE');
    
    expect(typeof API_CONFIG.BASE_URL).toBe('string');
    expect(API_CONFIG.TIMEOUT).toBe(30000);
    expect(API_CONFIG.AUTH_TYPE).toBe('Bearer');
    expect(API_CONFIG.HEADERS['Content-Type']).toBe('application/json');
    expect(API_CONFIG.HEADERS['Accept']).toBe('application/json');
  });

  it('should export ENDPOINTS with correct structure', () => {
    const { ENDPOINTS } = require('../src/services/api/config');
    
    expect(ENDPOINTS).toHaveProperty('AUTH');
    expect(ENDPOINTS).toHaveProperty('USERS');
    expect(ENDPOINTS).toHaveProperty('THREAD');
    
    expect(ENDPOINTS.AUTH).toHaveProperty('LOGIN_BY_DEVICE');
    expect(ENDPOINTS.USERS).toHaveProperty('PROFILE');
    expect(ENDPOINTS.USERS).toHaveProperty('ROLL_CALL');
    expect(ENDPOINTS.THREAD).toHaveProperty('URL');
    expect(ENDPOINTS.THREAD).toHaveProperty('RUNS');
    
    expect(ENDPOINTS.AUTH.LOGIN_BY_DEVICE).toBe('/v1/auth/login-by-device');
    expect(ENDPOINTS.USERS.PROFILE).toBe('/v1/users/profile');
    expect(ENDPOINTS.THREAD.URL).toBe('/v1/threads');
  });
});