// Define user profile interface
export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Define your store state types here
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
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
