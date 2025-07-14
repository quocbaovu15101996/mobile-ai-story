import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { AuthState } from './types';

// Custom storage object for expo-secure-store
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await SecureStore.getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

type AuthActions = {
  setToken: (token: string) => void;
  clearToken: () => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
};

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setToken: (token: string) =>
        set({ token, isAuthenticated: true }),
      clearToken: () =>
        set({ token: null, isAuthenticated: false }),
      setAuthenticated: (isAuthenticated: boolean) =>
        set({ isAuthenticated }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthActions = () => ({
  setToken: useAuthStore((state) => state.setToken),
  clearToken: useAuthStore((state) => state.clearToken),
  setAuthenticated: useAuthStore((state) => state.setAuthenticated),
});
