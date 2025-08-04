// Define globals that are expected in React Native environment
global.__DEV__ = process.env.NODE_ENV === 'development';

// Mock expo modules
jest.mock('expo-application', () => ({
  getIosIdForVendorAsync: jest.fn(() => Promise.resolve('mock-ios-id')),
  getAndroidId: jest.fn(() => 'mock-android-id'),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  default: {
    manifest: {},
    expoConfig: {},
  },
}));


// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Zustand
jest.mock('zustand', () => ({
  create: jest.fn((fn) => {
    const store = fn((set, get) => ({
      set,
      get,
    }));
    return () => store;
  }),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};