// Centralized type definitions for API-related interfaces

interface LoginResponse {
  type: string;
  token: string;
}

interface UserProfile {
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

interface Thread {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface ThreadsResponse {
  threads: Thread[];
  total: number;
  page: number;
  limit: number;
}

interface CreateThreadPayload {
  storyIdea: string;
  storyLength: string;
  genreType?: string | null;
  characterPrompt?: string;
  settingPrompt?: string;
  narrative?: string;
}
