
// Subscription IDs
export const SUBSCRIPTION_IDS = {
  WEEKLY: 'com.codezap.ai.story.1w',
  ANNUAL: 'com.codezap.ai.story.12m',
};

export interface InAppPurchasePayload {
  platform: string;
  recipeId: string;
}
