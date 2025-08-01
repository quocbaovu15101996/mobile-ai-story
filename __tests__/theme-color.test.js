// Test for theme color utilities
describe('Theme Color Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct color for useThemeColor with props', () => {
    // Mock the Colors constant
    jest.doMock('@/constants/Colors', () => ({
      Colors: {
        light: {
          text: '#11181C',
          background: '#fff',
        },
        dark: {
          text: '#ECEDEE', 
          background: '#151718',
        },
      },
    }));

    const { useThemeColor } = require('../hooks/useThemeColor');
    
    // Test with props provided
    const props = { light: '#custom-light', dark: '#custom-dark' };
    const result = useThemeColor(props, 'text');
    
    // Since theme is hardcoded to 'dark', should return dark prop
    expect(result).toBe('#custom-dark');
  });

  it('should return color from Colors when props not provided', () => {
    // Mock the Colors constant
    jest.doMock('@/constants/Colors', () => ({
      Colors: {
        light: {
          text: '#11181C',
          background: '#fff',
        },
        dark: {
          text: '#ECEDEE', 
          background: '#151718',
        },
      },
    }));

    jest.resetModules();
    const { useThemeColor } = require('../hooks/useThemeColor');
    
    // Test without props
    const result = useThemeColor({}, 'text');
    
    // Should return dark theme color since theme is hardcoded to 'dark'
    expect(result).toBe('#ECEDEE');
  });

  it('should return correct theme colors for useGetThemeColor', () => {
    // Mock the Colors constant
    jest.doMock('@/constants/Colors', () => ({
      Colors: {
        light: {
          text: '#11181C',
          background: '#fff',
        },
        dark: {
          text: '#ECEDEE', 
          background: '#151718',
        },
      },
    }));

    jest.resetModules();
    const { useGetThemeColor } = require('../hooks/useThemeColor');
    
    const lightColors = useGetThemeColor('light');
    const darkColors = useGetThemeColor('dark');
    
    expect(lightColors.text).toBe('#11181C');
    expect(lightColors.background).toBe('#fff');
    expect(darkColors.text).toBe('#ECEDEE');
    expect(darkColors.background).toBe('#151718');
  });
});