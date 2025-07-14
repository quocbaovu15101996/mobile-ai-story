// Define your store state types here
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  // Add other auth-related state here
}

export interface AppState {
  theme: 'light' | 'dark';
  isFirstLaunch: boolean;
  // Add other app-related state here
}

// Combine all state types
export interface RootState extends AuthState, AppState {
  // Add any additional root state properties here
}
