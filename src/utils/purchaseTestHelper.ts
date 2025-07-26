import { inAppPurchaseService, SUBSCRIPTION_IDS } from '../services/inAppPurchase';

/**
 * Development utility to test in-app purchase functionality
 * Use this in development to verify your RevenueCat integration
 */
export class PurchaseTestHelper {
  
  /**
   * Test RevenueCat initialization
   */
  static async testInitialization(): Promise<boolean> {
    console.log('🧪 Testing RevenueCat initialization...');
    
    try {
      const result = await inAppPurchaseService.initialize();
      if (result) {
        console.log('✅ RevenueCat initialized successfully');
        return true;
      } else {
        console.log('❌ RevenueCat initialization failed');
        return false;
      }
    } catch (error) {
      console.log('❌ RevenueCat initialization error:', error);
      return false;
    }
  }

  /**
   * Test product fetching
   */
  static async testProductFetching(): Promise<void> {
    console.log('🧪 Testing product fetching...');
    
    try {
      const products = await inAppPurchaseService.getAvailableProducts();
      console.log('✅ Products fetched successfully:', products.length);
      
      products.forEach((product, index) => {
        console.log(`📦 Product ${index + 1}:`, {
          id: product.productId,
          price: product.localizedPrice,
          title: product.localizedTitle,
        });
      });
      
      // Check if our expected products are available
      const weeklyProduct = products.find(p => p.productId === SUBSCRIPTION_IDS.WEEKLY);
      const annualProduct = products.find(p => p.productId === SUBSCRIPTION_IDS.ANNUAL);
      
      if (weeklyProduct) {
        console.log('✅ Weekly subscription product found');
      } else {
        console.log('⚠️  Weekly subscription product not found');
      }
      
      if (annualProduct) {
        console.log('✅ Annual subscription product found');
      } else {
        console.log('⚠️  Annual subscription product not found');
      }
      
    } catch (error) {
      console.log('❌ Product fetching error:', error);
    }
  }

  /**
   * Test customer info retrieval
   */
  static async testCustomerInfo(): Promise<void> {
    console.log('🧪 Testing customer info...');
    
    try {
      const customerInfo = await inAppPurchaseService.getCustomerInfo();
      if (customerInfo) {
        console.log('✅ Customer info retrieved successfully');
        console.log('👤 Customer ID:', customerInfo.originalAppUserId);
        console.log('📅 First seen:', customerInfo.firstSeen);
        console.log('🔑 Active entitlements:', Object.keys(customerInfo.entitlements.active));
        console.log('📱 Active subscriptions:', customerInfo.activeSubscriptions);
        
        const isSubscribed = inAppPurchaseService.isUserSubscribed();
        console.log('💳 Is subscribed:', isSubscribed);
      } else {
        console.log('❌ Failed to get customer info');
      }
    } catch (error) {
      console.log('❌ Customer info error:', error);
    }
  }

  /**
   * Run all tests
   */
  static async runAllTests(): Promise<void> {
    console.log('🚀 Starting Purchase Integration Tests...\n');
    
    const initSuccess = await this.testInitialization();
    console.log('\n');
    
    if (initSuccess) {
      await this.testProductFetching();
      console.log('\n');
      
      await this.testCustomerInfo();
      console.log('\n');
      
      console.log('✅ All tests completed!');
      console.log('💡 If you see any warnings or errors, check your RevenueCat configuration.');
    } else {
      console.log('❌ Cannot continue tests - initialization failed');
      console.log('💡 Please check your RevenueCat API keys in src/config/purchases.ts');
    }
  }
}

/**
 * Quick test function to call from your app during development
 * Example usage in your component:
 * 
 * import { testPurchaseIntegration } from '@/src/utils/purchaseTestHelper';
 * 
 * // In your component or during app startup
 * testPurchaseIntegration();
 */
export const testPurchaseIntegration = () => {
  PurchaseTestHelper.runAllTests();
};