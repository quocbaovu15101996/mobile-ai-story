
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  PurchasesStoreProduct,
  PURCHASES_ERROR_CODE,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { inAppPurchaseApi } from './api/inAppPurchase';
import { REVENUECAT_CONFIG, ENTITLEMENTS } from '../config/purchases';

// Subscription IDs
export const SUBSCRIPTION_IDS = {
  WEEKLY: 'com.codezap.ai.story.1w',
  ANNUAL: 'com.codezap.ai.story.12m',
};

export interface InAppPurchasePayload {
  platform: string;
  recipeId: string;
}

export interface SubscriptionProduct {
  productId: string;
  localizedPrice: string;
  price: number;
  currencyCode: string;
  localizedTitle: string;
  localizedDescription: string;
  platform: 'ios' | 'android';
  subscriptionOfferDetails?: any;
}

class InAppPurchaseService {
  private isInitialized = false;
  private customerInfo: CustomerInfo | null = null;

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        return true;
      }

      // Set debug logging level
      if (REVENUECAT_CONFIG.DEBUG_LOGS_ENABLED) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Configure Purchases SDK
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: REVENUECAT_CONFIG.IOS_API_KEY });
      } else if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: REVENUECAT_CONFIG.ANDROID_API_KEY });
      }

      // Get initial customer info
      this.customerInfo = await Purchases.getCustomerInfo();
      this.isInitialized = true;

      console.log('RevenueCat initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      return false;
    }
  }

  async getAvailableProducts(): Promise<SubscriptionProduct[]> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize purchase service');
        }
      }

      // Get offerings from RevenueCat
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering) {
        console.warn('No current offering available');
        return [];
      }

      const products: SubscriptionProduct[] = [];

      // Convert packages to our format
      currentOffering.availablePackages.forEach((pkg: PurchasesPackage) => {
        const product = pkg.product;
        products.push({
          productId: product.identifier,
          localizedPrice: product.priceString,
          price: product.price,
          currencyCode: product.currencyCode,
          localizedTitle: product.title,
          localizedDescription: product.description,
          platform: Platform.OS as 'ios' | 'android',
          subscriptionOfferDetails: (product as any).subscriptionOfferDetails,
        });
      });

      return products;
    } catch (error) {
      console.error('Failed to fetch available products:', error);
      throw error;
    }
  }

  async purchaseSubscription(subscriptionId: string): Promise<{ success: boolean; customerInfo?: CustomerInfo }> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize purchase service');
        }
      }

      // Get offerings
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering) {
        throw new Error('No current offering available');
      }

      // Find the package for the subscription
      const packageToPurchase = currentOffering.availablePackages.find(
        (pkg: PurchasesPackage) => pkg.product.identifier === subscriptionId
      );

      if (!packageToPurchase) {
        throw new Error(`Subscription package not found: ${subscriptionId}`);
      }

      // Make the purchase
      const purchaserInfo = await Purchases.purchasePackage(packageToPurchase);
      this.customerInfo = purchaserInfo.customerInfo;

      // Verify the purchase with backend
      const payload: InAppPurchasePayload = {
        platform: Platform.OS,
        recipeId: subscriptionId,
      };

      await inAppPurchaseApi.submitPurchase(payload);

      return {
        success: true,
        customerInfo: purchaserInfo.customerInfo,
      };
    } catch (error: any) {
      console.error('Purchase failed:', error);

      // Handle specific purchase errors
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED) {
        throw new Error('Purchase was cancelled');
      } else if (error.code === PURCHASES_ERROR_CODE.USER_CANCELLED) {
        throw new Error('Purchase was cancelled by user');
      } else if (error.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING) {
        throw new Error('Payment is pending approval');
      } else if (error.code === PURCHASES_ERROR_CODE.PRODUCT_NOT_AVAILABLE_FOR_PURCHASE) {
        throw new Error('Product is not available for purchase');
      } else {
        throw new Error(error.message || 'Purchase failed');
      }
    }
  }

  async restorePurchases(): Promise<{ success: boolean; customerInfo?: CustomerInfo }> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize purchase service');
        }
      }

      const customerInfo = await Purchases.restorePurchases();
      this.customerInfo = customerInfo;

      return {
        success: true,
        customerInfo,
      };
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return null;
        }
      }

      const customerInfo = await Purchases.getCustomerInfo();
      this.customerInfo = customerInfo;
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  isUserSubscribed(): boolean {
    if (!this.customerInfo) {
      return false;
    }

    // Check if user has the premium entitlement active
    return !!this.customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
  }

  hasActiveSubscription(subscriptionId?: string): boolean {
    if (!this.customerInfo) {
      return false;
    }

    if (subscriptionId) {
      // Check for specific subscription in active purchases
      return !!this.customerInfo.activeSubscriptions.includes(subscriptionId);
    }

    // Check for any active subscription
    return this.isUserSubscribed();
  }

  cleanup(): void {
    this.isInitialized = false;
    this.customerInfo = null;
  }
}

// Export singleton instance
export const inAppPurchaseService = new InAppPurchaseService();
