// Simple test for screen dimensions
describe('Screen Dimensions Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export SCREEN_WIDTH and SCREEN_HEIGHT from Dimensions', () => {
    // Mock Dimensions
    jest.doMock('react-native', () => ({
      Dimensions: {
        get: jest.fn(() => ({ width: 375, height: 812 })),
      },
    }));

    // Import after mock is set up
    const { SCREEN_WIDTH, SCREEN_HEIGHT } = require('../utils/index');
    
    expect(SCREEN_WIDTH).toBe(375);
    expect(SCREEN_HEIGHT).toBe(812);
  });

  it('should handle different screen dimensions', () => {
    // Mock different dimensions
    jest.doMock('react-native', () => ({
      Dimensions: {
        get: jest.fn(() => ({ width: 414, height: 896 })),
      },
    }));

    // Clear module cache and import fresh
    jest.resetModules();
    const { SCREEN_WIDTH, SCREEN_HEIGHT } = require('../utils/index');
    
    expect(SCREEN_WIDTH).toBe(414);
    expect(SCREEN_HEIGHT).toBe(896);
  });
});