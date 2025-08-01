// Simple test for device utility
describe('Device Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return iOS vendor ID when platform is iOS', async () => {
    // Mock Platform.OS as iOS and expo-application
    jest.doMock('react-native', () => ({
      Platform: { OS: 'ios' },
    }));

    jest.doMock('expo-application', () => ({
      getIosIdForVendorAsync: jest.fn(() => Promise.resolve('test-ios-id')),
      getAndroidId: jest.fn(() => 'test-android-id'),
    }));

    // Import after mocks are set up
    const getDeviceId = require('../utils/devices').default;
    
    const result = await getDeviceId();
    expect(result).toBe('test-ios-id');
  });

  it('should return Android ID when platform is Android', async () => {
    // Mock Platform.OS as Android and expo-application
    jest.doMock('react-native', () => ({
      Platform: { OS: 'android' },
    }));

    jest.doMock('expo-application', () => ({
      getIosIdForVendorAsync: jest.fn(() => Promise.resolve('test-ios-id')),
      getAndroidId: jest.fn(() => 'test-android-id'),
    }));

    // Clear module cache to get fresh imports
    jest.resetModules();
    
    const getDeviceId = require('../utils/devices').default;
    
    const result = await getDeviceId();
    expect(result).toBe('test-android-id');
  });
});