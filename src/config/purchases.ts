// RevenueCat Configuration
export const REVENUECAT_CONFIG = {
  // Replace these with your actual RevenueCat API keys from the dashboard
  IOS_API_KEY: 'your_ios_api_key_here',
  ANDROID_API_KEY: 'your_android_api_key_here',
  
  // Enable debug logging in development
  DEBUG_LOGS_ENABLED: __DEV__,
  
  // Timeout for purchase operations (in ms)
  PURCHASE_TIMEOUT: 30000,
};

// Entitlement identifiers (configure these in RevenueCat dashboard)
export const ENTITLEMENTS = {
  PREMIUM: 'premium',
};