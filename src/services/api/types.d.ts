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
  diamond?: number; // User's token balance
  lastRollCallDate?: string; // Date as ISO string
  rollCallStreak?: number; // Current streak in days
  totalAmountWatchAds?: number; // Number of times user can watch ads today
  lastRefreshTotalWatchAds?: string; // Timestamp as ISO string
  maxWatchAdsPerDay?: number;
  isVip?: boolean;
}

interface Thread {
  id: string;
  image?: string;
  userId: string;
  status: number;
  totalTokensUsed: number;
  isCanInteract: number;
  countToSummary: number;
  threadId: string;
  title: string;
  content: string;
  storyIdea: string;
  character: string;
  narrative: string;
  genre: string;
  createdDate: string;
  modifiedDate: string;
  storyIdea: string;
  character: string;
  narrative: string;
  genre: string;
  createdDate: string;
  modifiedDate: string;
}

interface ThreadsResponse {
  threads: Thread[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface CreateThreadPayload {
  storyIdea: string;
  isCanInteract: number; // 1 | 0
  storyLength: string;
  genreType?: string | null;
  characterPrompt?: string;
  settingPrompt?: string;
  narrative?: string;
}

interface CreateThreadResponse {
  id: string;
  userId: string;
  status: number;
  totalTokensUsed: number;
  isCanInteract: number;
  countToSummary: number;
  threadId: string;
  title: string;
  content: string;
  storyIdea: string;
  character: string;
  narrative: string;
  genre: string;
  createdDate: string;
  modifiedDate: string;
}

interface MessageResponse {
  id: string;
  createdAt: string;
  totalTokens: number;
  content: string;
}

interface GenerateIdeaResponse {
  idea: string;
}
interface Metadata {
  type: string;
  content: string;
}
interface ContentText {
  value: string;
}
interface Content {
  type: string;
  text: ContentText;
}
interface MessageItemInterface {
  id: string;
  object: string;
  created_at: string;
  thread_id: string;
  run_id: string;
  role: string;
  content: Content;
  metadata: Metadata
}

interface ExpandThreadPayload {
  content: string;
  tone: string;
}