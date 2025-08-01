// Test for useColorScheme hook
describe('useColorScheme Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export useColorScheme from react-native', () => {
    // Mock react-native useColorScheme
    const mockUseColorScheme = jest.fn(() => 'dark');
    
    jest.doMock('react-native', () => ({
      useColorScheme: mockUseColorScheme,
    }));

    const { useColorScheme } = require('../hooks/useColorScheme');
    
    const result = useColorScheme();
    
    expect(result).toBe('dark');
    expect(mockUseColorScheme).toHaveBeenCalledTimes(1);
  });

  it('should return light scheme when specified', () => {
    const mockUseColorScheme = jest.fn(() => 'light');
    
    jest.doMock('react-native', () => ({
      useColorScheme: mockUseColorScheme,
    }));

    jest.resetModules();
    const { useColorScheme } = require('../hooks/useColorScheme');
    
    const result = useColorScheme();
    
    expect(result).toBe('light');
  });

  it('should return null when no scheme detected', () => {
    const mockUseColorScheme = jest.fn(() => null);
    
    jest.doMock('react-native', () => ({
      useColorScheme: mockUseColorScheme,
    }));

    jest.resetModules();
    const { useColorScheme } = require('../hooks/useColorScheme');
    
    const result = useColorScheme();
    
    expect(result).toBeNull();
  });
});