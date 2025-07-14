import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api, { ApiResponse } from '../services/api';
import { LoginResponse } from '../services/api/config';
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
  loginByDevice: () => Promise<string | null>;
};

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setToken: (token: string) => 
        set({ token, isAuthenticated: true }),
      clearToken: () => 
        set({ token: null, isAuthenticated: false }),
      setAuthenticated: (isAuthenticated: boolean) => 
        set({ isAuthenticated }),
      loginByDevice: async (): Promise<string | null> => {
        try {
          // Use Device ID or generate a unique ID if not available
          const deviceId = Device.modelId || `web-${Math.random().toString(36).substring(7)}`;
          const platform = Platform.OS === 'ios' ? 'ios' : 'android';
          
          const response = await api.post<LoginResponse>(
            '/v1/auth/login-by-device',
            { platform, deviceId }
          ) as unknown as ApiResponse<LoginResponse>;
          
          if (response.data?.token) {
            const { token } = response.data;
            get().setToken(token);
            return token;
          }
          
          return null;
        } catch (error) {
          console.error('Login by device failed:', error);
          get().clearToken();
          return null;
        }
      },
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
