import { useState, useEffect } from 'react';
import { inAppPurchaseService } from '../services/inAppPurchase';

/**
 * React hook to manage subscription state throughout the app
 */
export const useSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState(null);

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      
      // Initialize if needed
      await inAppPurchaseService.initialize();
      
      // Get customer info
      const info = await inAppPurchaseService.getCustomerInfo();
      setCustomerInfo(info);
      
      // Check subscription status
      const subscribed = inAppPurchaseService.isUserSubscribed();
      setIsSubscribed(subscribed);
      
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const refreshSubscriptionStatus = () => {
    checkSubscriptionStatus();
  };

  return {
    isSubscribed,
    isLoading,
    customerInfo,
    refreshSubscriptionStatus,
  };
};