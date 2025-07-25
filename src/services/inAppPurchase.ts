import { Platform } from 'react-native';
import {
  endConnection,
  finishTransaction,
  getSubscriptions,
  initConnection,
  Purchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestSubscription,
  Subscription,
} from 'react-native-iap';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import api from './api';

// Subscription IDs
export const SUBSCRIPTION_IDS = {
  WEEKLY: 'com.codezap.ai.story.1w',
  ANNUAL: 'com.codezap.ai.story.12m',
};

export interface InAppPurchasePayload {
  platform: string;
  recipeId: string;
}

class InAppPurchaseService {
  private purchaseUpdateSubscription: any;
  private purchaseErrorSubscription: any;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      const result = await initConnection();
      console.log('IAP connection initialized:', result);
      
      // Set up purchase listeners
      this.setupPurchaseListeners();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize IAP connection:', error);
      this.isInitialized = false;
      return false;
    }
  }

  private setupPurchaseListeners() {
    // Listen for purchase updates
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: Purchase) => {
        console.log('Purchase successful:', purchase);
        await this.handleSuccessfulPurchase(purchase);
      }
    );

    // Listen for purchase errors
    this.purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.error('Purchase error:', error);
        this.handlePurchaseError(error);
      }
    );
  }

  async getAvailableProducts(): Promise<Subscription[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const subscriptions = await getSubscriptions({
        skus: Object.values(SUBSCRIPTION_IDS),
      });

      console.log('Available subscriptions:', subscriptions);
      return subscriptions;
    } catch (error) {
      console.error('Failed to get subscriptions:', error);
      showErrorToast('Failed to load subscription options');
      return [];
    }
  }

  async purchaseSubscription(subscriptionId: string): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Initiating purchase for:', subscriptionId);
      await requestSubscription({ sku: subscriptionId });
    } catch (error) {
      console.error('Failed to initiate purchase:', error);
      showErrorToast('Failed to start purchase process');
    }
  }

  private async handleSuccessfulPurchase(purchase: Purchase): Promise<void> {
    try {
      // Call API to register the purchase
      const payload: InAppPurchasePayload = {
        platform: Platform.OS,
        recipeId: purchase.productId,
      };

      console.log('Sending purchase data to API:', payload);
      
      const response = await api.post('/api/in-app-purchase', payload);
      
      if (response.status === 200) {
        showSuccessToast('Subscription activated successfully!');
        
        // Finish the transaction
        await finishTransaction({ purchase, isConsumable: false });
        
        console.log('Purchase completed and API call successful');
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      console.error('Failed to process purchase:', error);
      showErrorToast('Purchase successful, but activation failed. Please contact support.');
      
      // Still finish the transaction to avoid repeated notifications
      try {
        await finishTransaction({ purchase, isConsumable: false });
      } catch (finishError) {
        console.error('Failed to finish transaction:', finishError);
      }
    }
  }

  private handlePurchaseError(error: PurchaseError): void {
    console.error('Purchase error details:', error);
    
    // Show appropriate error message based on error code
    let errorMessage = 'Purchase failed. Please try again.';
    
    if (error.code === 'E_USER_CANCELLED') {
      errorMessage = 'Purchase was cancelled.';
    } else if (error.code === 'E_NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.code === 'E_SERVICE_ERROR') {
      errorMessage = 'Service unavailable. Please try again later.';
    } else if (error.code === 'E_ALREADY_OWNED') {
      errorMessage = 'You already own this subscription.';
    }
    
    showErrorToast(errorMessage);
  }

  async cleanup(): Promise<void> {
    try {
      // Remove listeners
      if (this.purchaseUpdateSubscription) {
        this.purchaseUpdateSubscription.remove();
        this.purchaseUpdateSubscription = null;
      }
      
      if (this.purchaseErrorSubscription) {
        this.purchaseErrorSubscription.remove();
        this.purchaseErrorSubscription = null;
      }

      // End connection
      await endConnection();
      this.isInitialized = false;
      
      console.log('IAP service cleaned up');
    } catch (error) {
      console.error('Error during IAP cleanup:', error);
    }
  }
}

// Export singleton instance
export const inAppPurchaseService = new InAppPurchaseService();