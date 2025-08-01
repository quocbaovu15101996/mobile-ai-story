// Test for PurchaseTestHelper utility
describe('PurchaseTestHelper Utility', () => {
  let PurchaseTestHelper;
  let mockInAppPurchaseService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Mock the inAppPurchaseService
    mockInAppPurchaseService = {
      initialize: jest.fn(),
      getAvailableProducts: jest.fn(),
      getCustomerInfo: jest.fn(),
      isUserSubscribed: jest.fn(),
    };

    jest.doMock('../src/services/inAppPurchase', () => ({
      inAppPurchaseService: mockInAppPurchaseService,
      SUBSCRIPTION_IDS: {
        WEEKLY: 'com.codezap.ai.story.1w',
        ANNUAL: 'com.codezap.ai.story.12m',
      },
    }));

    // Mock console functions
    global.console.log = jest.fn();

    // Import after mocks are set up
    const module = require('../src/utils/purchaseTestHelper');
    PurchaseTestHelper = module.PurchaseTestHelper;
  });

  describe('testInitialization', () => {
    it('should return true when initialization succeeds', async () => {
      mockInAppPurchaseService.initialize.mockResolvedValue(true);

      const result = await PurchaseTestHelper.testInitialization();

      expect(result).toBe(true);
      expect(mockInAppPurchaseService.initialize).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('🧪 Testing RevenueCat initialization...');
      expect(console.log).toHaveBeenCalledWith('✅ RevenueCat initialized successfully');
    });

    it('should return false when initialization fails', async () => {
      mockInAppPurchaseService.initialize.mockResolvedValue(false);

      const result = await PurchaseTestHelper.testInitialization();

      expect(result).toBe(false);
      expect(console.log).toHaveBeenCalledWith('❌ RevenueCat initialization failed');
    });

    it('should handle initialization errors', async () => {
      const error = new Error('Init failed');
      mockInAppPurchaseService.initialize.mockRejectedValue(error);

      const result = await PurchaseTestHelper.testInitialization();

      expect(result).toBe(false);
      expect(console.log).toHaveBeenCalledWith('❌ RevenueCat initialization error:', error);
    });
  });

  describe('testProductFetching', () => {
    it('should successfully fetch and log products', async () => {
      const mockProducts = [
        {
          productId: 'com.codezap.ai.story.1w',
          localizedPrice: '$4.99',
          localizedTitle: 'Weekly Subscription',
        },
        {
          productId: 'com.codezap.ai.story.12m',
          localizedPrice: '$39.99',
          localizedTitle: 'Annual Subscription',
        },
      ];

      mockInAppPurchaseService.getAvailableProducts.mockResolvedValue(mockProducts);

      await PurchaseTestHelper.testProductFetching();

      expect(mockInAppPurchaseService.getAvailableProducts).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('🧪 Testing product fetching...');
      expect(console.log).toHaveBeenCalledWith('✅ Products fetched successfully:', 2);
      expect(console.log).toHaveBeenCalledWith('✅ Weekly subscription product found');
      expect(console.log).toHaveBeenCalledWith('✅ Annual subscription product found');
    });

    it('should handle product fetching errors', async () => {
      const error = new Error('Failed to fetch products');
      mockInAppPurchaseService.getAvailableProducts.mockRejectedValue(error);

      await PurchaseTestHelper.testProductFetching();

      expect(console.log).toHaveBeenCalledWith('❌ Product fetching error:', error);
    });
  });

  describe('testCustomerInfo', () => {
    it('should successfully get customer info', async () => {
      const mockCustomerInfo = {
        originalAppUserId: 'user123',
        firstSeen: '2023-01-01',
        entitlements: { active: {} },
        activeSubscriptions: [],
      };

      mockInAppPurchaseService.getCustomerInfo.mockResolvedValue(mockCustomerInfo);
      mockInAppPurchaseService.isUserSubscribed.mockReturnValue(false);

      await PurchaseTestHelper.testCustomerInfo();

      expect(mockInAppPurchaseService.getCustomerInfo).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('✅ Customer info retrieved successfully');
      expect(console.log).toHaveBeenCalledWith('👤 Customer ID:', 'user123');
      expect(console.log).toHaveBeenCalledWith('💳 Is subscribed:', false);
    });

    it('should handle null customer info', async () => {
      mockInAppPurchaseService.getCustomerInfo.mockResolvedValue(null);

      await PurchaseTestHelper.testCustomerInfo();

      expect(console.log).toHaveBeenCalledWith('❌ Failed to get customer info');
    });
  });

  describe('runAllTests', () => {
    it('should run all tests when initialization succeeds', async () => {
      mockInAppPurchaseService.initialize.mockResolvedValue(true);
      mockInAppPurchaseService.getAvailableProducts.mockResolvedValue([]);
      mockInAppPurchaseService.getCustomerInfo.mockResolvedValue(null);

      await PurchaseTestHelper.runAllTests();

      expect(console.log).toHaveBeenCalledWith('🚀 Starting Purchase Integration Tests...\n');
      expect(console.log).toHaveBeenCalledWith('✅ All tests completed!');
    });

    it('should stop tests when initialization fails', async () => {
      mockInAppPurchaseService.initialize.mockResolvedValue(false);

      await PurchaseTestHelper.runAllTests();

      expect(console.log).toHaveBeenCalledWith('❌ Cannot continue tests - initialization failed');
    });
  });
});