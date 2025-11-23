import analytics from '@react-native-firebase/analytics';

/**
 * Firebase Analytics Service
 * Centralized service for tracking user events and screen views
 */

class AnalyticsService {
  private analytics = analytics();

  /**
   * Track a custom event
   */
  async logEvent(eventName: string, parameters?: { [key: string]: any }) {
    try {
      await this.analytics.logEvent(eventName, parameters);
      if (__DEV__) {
        console.log(`[Analytics] Event: ${eventName}`, parameters);
      }
    } catch (error) {
      console.error(`[Analytics] Error logging event ${eventName}:`, error);
    }
  }

  /**
   * Track screen view
   * Uses logEvent instead of deprecated logScreenView
   */
  async logScreenView(screenName: string, screenClass?: string) {
    try {
      await this.analytics.logEvent('screen_view', {
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
      if (__DEV__) {
        console.log(`[Analytics] Screen View: ${screenName}`);
      }
    } catch (error) {
      console.error(`[Analytics] Error logging screen view ${screenName}:`, error);
    }
  }

  /**
   * Set user properties
   */
  async setUserProperty(name: string, value: string) {
    try {
      await this.analytics.setUserProperty(name, value);
      if (__DEV__) {
        console.log(`[Analytics] User Property: ${name} = ${value}`);
      }
    } catch (error) {
      console.error(`[Analytics] Error setting user property ${name}:`, error);
    }
  }

  /**
   * Set user ID
   */
  async setUserId(userId: string | null) {
    try {
      await this.analytics.setUserId(userId); 
      if (__DEV__) {
        console.log(`[Analytics] User ID: ${userId}`);
      }
    } catch (error) {
      console.error(`[Analytics] Error setting user ID:`, error);
    }
  }

  // ==================== Story Creation Events ====================

  /**
   * Track when user starts creating a story
   */
  async logStoryCreationStart() {
    await this.logEvent('story_creation_start');
  }

  /**
   * Track when user generates a story idea suggestion
   */
  async logStoryIdeaSuggestion() {
    await this.logEvent('story_idea_suggestion');
  }

  /**
   * Track when user generates a story
   */
  async logStoryGenerated(params: {
    storyType: 'endless' | 'story';
    storyLength?: string;
    genre?: string;
    hasCharacters: boolean;
    hasSetting: boolean;
    narrative: string;
    isVip: boolean;
  }) {
    await this.logEvent('story_generated', {
      story_type: params.storyType,
      story_length: params.storyLength || 'N/A',
      genre: params.genre || 'none',
      has_characters: params.hasCharacters,
      has_setting: params.hasSetting,
      narrative: params.narrative,
      is_vip: params.isVip,
    });
  }

  // ==================== Story Interaction Events ====================

  /**
   * Track when user views a thread/story
   */
  async logThreadViewed(threadId: string, isCreate: boolean) {
    await this.logEvent('thread_viewed', {
      thread_id: threadId,
      is_create: isCreate,
    });
  }

  /**
   * Track when user continues a story
   */
  async logStoryContinue(threadId: string, isVip: boolean) {
    await this.logEvent('story_continue', {
      thread_id: threadId,
      is_vip: isVip,
    });
  }

  /**
   * Track when user expands a story
   */
  async logStoryExpand(threadId: string, tone: string, isVip: boolean) {
    await this.logEvent('story_expand', {
      thread_id: threadId,
      tone: tone,
      is_vip: isVip,
    });
  }

  /**
   * Track when user rewrites a message
   */
  async logMessageRewrite(threadId: string, isVip: boolean) {
    await this.logEvent('message_rewrite', {
      thread_id: threadId,
      is_vip: isVip,
    });
  }

  /**
   * Track when user deletes a message
   */
  async logMessageDelete(threadId: string) {
    await this.logEvent('message_delete', {
      thread_id: threadId,
    });
  }

  /**
   * Track when user deletes a thread
   */
  async logThreadDelete(threadId: string) {
    await this.logEvent('thread_delete', {
      thread_id: threadId,
    });
  }

  /**
   * Track when user exports a thread to PDF
   */
  async logThreadExport(threadId: string) {
    await this.logEvent('thread_export', {
      thread_id: threadId,
    });
  }

  // ==================== Purchase Events ====================

  /**
   * Track when user views the purchase screen
   */
  async logPurchaseScreenViewed() {
    await this.logEvent('purchase_screen_viewed');
  }

  /**
   * Track when user selects a subscription plan
   */
  async logSubscriptionPlanSelected(planId: string, price: number) {
    await this.logEvent('subscription_plan_selected', {
      plan_id: planId,
      price: price,
    });
  }

  /**
   * Track when user initiates a purchase
   */
  async logPurchaseInitiated(planId: string, price: number) {
    await this.logEvent('purchase_initiated', {
      plan_id: planId,
      price: price,
    });
  }

  /**
   * Track successful purchase
   */
  async logPurchaseSuccess(planId: string, price: number, platform: 'ios' | 'android') {
    await this.logEvent('purchase_success', {
      plan_id: planId,
      price: price,
      platform: platform,
      currency: 'USD', // Adjust based on your pricing
    });
  }

  /**
   * Track purchase error
   */
  async logPurchaseError(planId: string, error: string) {
    await this.logEvent('purchase_error', {
      plan_id: planId,
      error: error,
    });
  }

  /**
   * Track restore purchases action
   */
  async logRestorePurchases() {
    await this.logEvent('restore_purchases');
  }

  /**
   * Track restore purchases success
   */
  async logRestorePurchasesSuccess() {
    await this.logEvent('restore_purchases_success');
  }

  // ==================== Roll Call Events ====================

  /**
   * Track when user opens roll call modal
   */
  async logRollCallModalOpened() {
    await this.logEvent('roll_call_modal_opened');
  }

  /**
   * Track when user checks in
   */
  async logRollCallCheckIn(streak: number) {
    await this.logEvent('roll_call_check_in', {
      streak: streak,
    });
  }

  /**
   * Track when user watches ads for diamonds
   */
  async logWatchAdsForDiamonds(adsWatchedToday: number) {
    await this.logEvent('watch_ads_for_diamonds', {
      ads_watched_today: adsWatchedToday,
    });
  }

  /**
   * Track when user earns diamonds from ads
   */
  async logEarnDiamondsFromAds(diamondsEarned: number) {
    await this.logEvent('earn_diamonds_from_ads', {
      diamonds_earned: diamondsEarned,
    });
  }

  // ==================== Settings Events ====================

  /**
   * Track when user shares the app
   */
  async logAppShare() {
    await this.logEvent('app_share');
  }

  /**
   * Track when user rates the app
   */
  async logAppRate() {
    await this.logEvent('app_rate');
  }

  /**
   * Track when user contacts support
   */
  async logContactSupport() {
    await this.logEvent('contact_support');
  }

  /**
   * Track when user views terms and conditions
   */
  async logTermsViewed() {
    await this.logEvent('terms_viewed');
  }

  /**
   * Track when user views privacy policy
   */
  async logPrivacyPolicyViewed() {
    await this.logEvent('privacy_policy_viewed');
  }

  /**
   * Track when user clears app data
   */
  async logClearData() {
    await this.logEvent('clear_data');
  }

  /**
   * Track when user navigates to upgrade premium
   */
  async logUpgradePremiumClicked() {
    await this.logEvent('upgrade_premium_clicked');
  }

  // ==================== Navigation Events ====================

  /**
   * Track when user navigates to history screen
   */
  async logHistoryScreenViewed() {
    await this.logEvent('history_screen_viewed');
  }

  /**
   * Track when user refreshes history
   */
  async logHistoryRefreshed() {
    await this.logEvent('history_refreshed');
  }

  /**
   * Track when user loads more history items
   */
  async logHistoryLoadMore(page: number) {
    await this.logEvent('history_load_more', {
      page: page,
    });
  }

  // ==================== Ad Events ====================

  /**
   * Track when interstitial ad is shown
   */
  async logInterstitialAdShown(adUnitId: string) {
    await this.logEvent('interstitial_ad_shown', {
      ad_unit_id: adUnitId,
    });
  }

  /**
   * Track when rewarded ad is shown
   */
  async logRewardedAdShown(adUnitId: string) {
    await this.logEvent('rewarded_ad_shown', {
      ad_unit_id: adUnitId,
    });
  }

  /**
   * Track when rewarded ad reward is earned
   */
  async logRewardedAdRewardEarned(adUnitId: string) {
    await this.logEvent('rewarded_ad_reward_earned', {
      ad_unit_id: adUnitId,
    });
  }

  /**
   * Track when ad fails to load
   */
  async logAdLoadError(adType: 'interstitial' | 'rewarded', error: string) {
    await this.logEvent('ad_load_error', {
      ad_type: adType,
      error: error,
    });
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;

