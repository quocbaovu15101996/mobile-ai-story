

// Define your store state types here
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  // Add other auth-related state here
}

interface AppState {
  theme: 'light' | 'dark';
  isFirstLaunch: boolean;
  // Add other app-related state here
}

// Combine all state types
interface RootState extends AuthState, AppState {
  // Add any additional root state properties here
}

type AuthActions = {
  setToken: (token: string) => void;
  clearToken: () => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  loginByDevice: () => Promise<string | null>;
};

type AuthStore = AuthState & AuthActions;