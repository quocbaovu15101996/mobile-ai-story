// Test for useSubscription hook structure and exports
describe('useSubscription Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should export useSubscription function', () => {
    // Mock the dependencies first
    jest.doMock('../src/services/inAppPurchase', () => ({
      inAppPurchaseService: {
        initialize: jest.fn(),
        getCustomerInfo: jest.fn(),
        isUserSubscribed: jest.fn(),
      },
    }));

    jest.doMock('react', () => ({
      useState: jest.fn((initial) => [initial, jest.fn()]),
      useEffect: jest.fn(),
    }));

    const module = require('../src/hooks/useSubscription');
    
    expect(typeof module.useSubscription).toBe('function');
  });

  it('should have the correct hook structure when called', () => {
    // Mock React hooks to return expected structure
    const mockSetState = jest.fn();
    const mockUseState = jest.fn()
      .mockReturnValueOnce([false, mockSetState])  // isSubscribed
      .mockReturnValueOnce([true, mockSetState])   // isLoading  
      .mockReturnValueOnce([null, mockSetState]);  // customerInfo

    jest.doMock('react', () => ({
      useState: mockUseState,
      useEffect: jest.fn((fn) => fn()), // Execute immediately
    }));

    jest.doMock('../src/services/inAppPurchase', () => ({
      inAppPurchaseService: {
        initialize: jest.fn().mockResolvedValue(true),
        getCustomerInfo: jest.fn().mockResolvedValue(null),
        isUserSubscribed: jest.fn().mockReturnValue(false),
      },
    }));

    const { useSubscription } = require('../src/hooks/useSubscription');
    const result = useSubscription();
    
    expect(result).toHaveProperty('isSubscribed');
    expect(result).toHaveProperty('isLoading'); 
    expect(result).toHaveProperty('customerInfo');
    expect(result).toHaveProperty('refreshSubscriptionStatus');
    expect(typeof result.refreshSubscriptionStatus).toBe('function');
  });

  it('should call initialize service on hook execution', () => {
    const mockInitialize = jest.fn().mockResolvedValue(true);
    const mockGetCustomerInfo = jest.fn().mockResolvedValue(null);
    const mockIsUserSubscribed = jest.fn().mockReturnValue(false);

    jest.doMock('react', () => ({
      useState: jest.fn((initial) => [initial, jest.fn()]),
      useEffect: jest.fn((fn) => fn()), // Execute immediately
    }));

    jest.doMock('../src/services/inAppPurchase', () => ({
      inAppPurchaseService: {
        initialize: mockInitialize,
        getCustomerInfo: mockGetCustomerInfo,
        isUserSubscribed: mockIsUserSubscribed,
      },
    }));

    const { useSubscription } = require('../src/hooks/useSubscription');
    useSubscription();

    expect(mockInitialize).toHaveBeenCalledTimes(1);
  });
});