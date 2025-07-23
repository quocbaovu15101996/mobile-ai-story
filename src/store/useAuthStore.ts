import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { loginByDevice } from '../services/api/auth';
import { UserProfile } from '../services/api/types';
import { getUserProfile } from '../services/api/users';
import getDeviceId from '../utils/devices';
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
  setUserProfile: (profile: UserProfile | null) => void;
  loginByDevice: () => Promise<string | null>;
};

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  userProfile: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setToken: (token: string) =>
        set({ token, isAuthenticated: true }),
      clearToken: () =>
        set({ token: null, isAuthenticated: false, userProfile: null }),
      setAuthenticated: (isAuthenticated: boolean) =>
        set({ isAuthenticated }),
      setUserProfile: (userProfile: UserProfile | null) =>
        set({ userProfile }),
      loginByDevice: async (): Promise<string | null> => {
        try {
          // Use Device ID or generate a unique ID if not available
          const deviceId = await getDeviceId();
          if (!deviceId) {
            return null;
          }
          const response = await loginByDevice({ platform: Platform.OS, deviceId });

          if (response.data?.token) {
            const { token } = response.data;
            get().setToken(token);

            // After successful login, fetch user profile
            try {
              const profileResponse = await getUserProfile();
              if (profileResponse.data) {
                get().setUserProfile(profileResponse.data);
              }
            } catch (profileError) {
              console.error('Failed to fetch user profile:', profileError);
              // Don't fail the login if profile fetch fails
            }

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
        userProfile: state.userProfile,
      }),
    }
  )
);

// Selector hooks
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserProfile = () => useAuthStore((state) => state.userProfile);
export const useAuthActions = () => ({
  setToken: useAuthStore((state) => state.setToken),
  clearToken: useAuthStore((state) => state.clearToken),
  setAuthenticated: useAuthStore((state) => state.setAuthenticated),
  setUserProfile: useAuthStore((state) => state.setUserProfile),
});
