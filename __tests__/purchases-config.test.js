// Test for purchases configuration
describe('Purchases Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock __DEV__ global
    global.__DEV__ = false;
  });

  it('should export REVENUECAT_CONFIG with correct structure', () => {
    const { REVENUECAT_CONFIG } = require('../src/config/purchases');
    
    expect(REVENUECAT_CONFIG).toHaveProperty('IOS_API_KEY');
    expect(REVENUECAT_CONFIG).toHaveProperty('ANDROID_API_KEY');
    expect(REVENUECAT_CONFIG).toHaveProperty('DEBUG_LOGS_ENABLED');
    expect(REVENUECAT_CONFIG).toHaveProperty('PURCHASE_TIMEOUT');
    
    expect(typeof REVENUECAT_CONFIG.IOS_API_KEY).toBe('string');
    expect(typeof REVENUECAT_CONFIG.ANDROID_API_KEY).toBe('string');
    expect(typeof REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED).toBe('boolean');
    expect(typeof REVENUECAT_CONFIG.PURCHASE_TIMEOUT).toBe('number');
    
    expect(REVENUECAT_CONFIG.PURCHASE_TIMEOUT).toBe(30000);
  });

  it('should export ENTITLEMENTS with correct structure', () => {
    const { ENTITLEMENTS } = require('../src/config/purchases');
    
    expect(ENTITLEMENTS).toHaveProperty('PREMIUM');
    expect(ENTITLEMENTS.PREMIUM).toBe('premium');
  });

  it('should have DEBUG_LOGS_ENABLED as false in test environment', () => {
    // In test environment, __DEV__ should be false
    const { REVENUECAT_CONFIG } = require('../src/config/purchases');
    
    expect(REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED).toBe(false);
  });
});