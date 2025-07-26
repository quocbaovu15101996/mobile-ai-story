# In-App Purchase Setup Instructions

## RevenueCat Configuration Required

The in-app purchase implementation uses RevenueCat as the purchase management service. To complete the setup, you need to:

### 1. Create RevenueCat Account
- Go to [RevenueCat Dashboard](https://app.revenuecat.com)
- Create an account and set up your app

### 2. Configure API Keys
In `src/services/inAppPurchase.ts`, replace the placeholder API keys:

```typescript
// Replace with your RevenueCat iOS API key
await Purchases.configure({ apiKey: 'your_ios_api_key' });

// Replace with your RevenueCat Android API key  
await Purchases.configure({ apiKey: 'your_android_api_key' });
```

### 3. Set Up Products in RevenueCat
- Create products with IDs matching:
  - `com.codezap.ai.story.1w` (Weekly subscription)
  - `com.codezap.ai.story.12m` (Annual subscription)

### 4. Configure Store Connect / Play Console
- Set up the same product IDs in Apple App Store Connect and Google Play Console
- Configure subscription details, pricing, etc.

### 5. Test the Implementation
- Use RevenueCat's sandbox environment for testing
- Test purchase flow, restoration, and error handling

## Features Implemented

✅ **Purchase Flow**
- Initialize RevenueCat SDK
- Fetch available products with real pricing
- Handle subscription purchases
- Backend validation via API

✅ **Restore Purchases**
- Restore previous purchases
- Validate active subscriptions
- Handle restore errors

✅ **Error Handling**
- User-friendly error messages
- Purchase cancellation handling
- Network error recovery

✅ **UI Features**
- Loading states during operations
- Dynamic pricing from store
- Purchase success feedback
- Restore purchases button

## Important Notes

- The implementation is ready to use once RevenueCat keys are configured
- Backend API integration is already set up
- All purchase validations go through your backend API
- Supports both iOS and Android platforms