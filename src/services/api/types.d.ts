// Centralized type definitions for API-related interfaces

export interface LoginResponse {
  type: string;
  token: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  password?: string;
  name?: string;
  status?: number;
  email?: string;
  isMailVerified?: string;
  phoneNumber?: string;
  isPhoneNumberVerified?: string;
  platform?: string;
  deviceId?: string;
  lastRefreshAmount?: string; // Timestamp as ISO string
  appleId?: string;
  googleId?: string;
  facebookId?: string;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string; // Timestamp as ISO string
  modifiedDate?: string; // Timestamp as ISO string
  vipPackageId?: string;
  vipPackageCode?: string;
  tokenBalance?: number; // User's token balance
  lastRollCallDate?: string; // Date as ISO string
  rollCallStreak?: number; // Current streak in days
  weeklyRollCallDays?: Set<string>; // Days user has rolled this week
  totalAmountWatchAds?: number; // Number of times user can watch ads today
  lastRefreshTotalWatchAds?: string; // Timestamp as ISO string
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  context?: string[]; // Array of context items for thread detail
}

export interface ThreadsResponse {
  threads: Thread[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CreateThreadPayload {
  storyIdea: string;
  storyLength: string;
  genreType?: string | null;
  characterPrompt?: string;
  settingPrompt?: string;
  narrative?: string;
}

export interface CreateThreadResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
