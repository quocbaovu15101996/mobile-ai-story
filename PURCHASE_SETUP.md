# In-App Purchase Setup Instructions

## RevenueCat Configuration Required

The in-app purchase implementation uses RevenueCat as the purchase management service. To complete the setup, you need to:

### 1. Create RevenueCat Account
- Go to [RevenueCat Dashboard](https://app.revenuecat.com)
- Create an account and set up your app

### 2. Configure API Keys
In `src/config/purchases.ts`, replace the placeholder API keys:

```typescript
// Replace with your RevenueCat iOS API key
IOS_API_KEY: 'your_ios_api_key_here',

// Replace with your RevenueCat Android API key  
ANDROID_API_KEY: 'your_android_api_key_here',
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

## UI Preview

The implementation creates a beautiful subscription screen with dynamic states:

![In-App Purchase Screen](https://github.com/user-attachments/assets/247aebf0-3881-4089-8914-311853679c30)

*Screenshot shows the subscribed state with green banner and disabled purchase button*

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
- Subscription status indicators
- Disabled state when already subscribed

✅ **Developer Tools**
- Test helper utilities
- Subscription status hook
- Configuration management
- Debug logging

## Usage Examples

### Using the Subscription Hook

```typescript
import { useSubscription } from '@/src/hooks/useSubscription';

function MyComponent() {
  const { isSubscribed, isLoading, refreshSubscriptionStatus } = useSubscription();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <View>
      {isSubscribed ? (
        <Text>Premium Features Available!</Text>
      ) : (
        <Button title="Subscribe" onPress={() => /* navigate to InAppPurchase */} />
      )}
    </View>
  );
}
```

### Testing the Integration

```typescript
import { testPurchaseIntegration } from '@/src/utils/purchaseTestHelper';

// Call this during development to test your setup
testPurchaseIntegration();
```

## Important Notes

- The implementation is ready to use once RevenueCat keys are configured
- Backend API integration is already set up
- All purchase validations go through your backend API
- Supports both iOS and Android platforms
- Uses entitlements for subscription status checking
- Includes comprehensive error handling and user feedback