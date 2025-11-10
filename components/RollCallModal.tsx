import { ADMOB_ADS } from '@/config/admob-config';
import { earnTokenByAds, getUserProfile, rollCall } from '@/src/services/api/users';
import { useAuthStore } from '@/src/store/useAuthStore';
import { SCREEN_WIDTH } from '@/src/utils';
import { showErrorToast } from '@/src/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AdEventType, RewardedAdEventType, RewardedInterstitialAd } from 'react-native-google-mobile-ads';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MAX_WATCH_ADS_PER_DAY = 5;

const ITEM_WIDTH = (SCREEN_WIDTH - 64) / 4;

export default function RollCallModal({ visible, onClose }: Props) {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { setUserProfile, userProfile } = useAuthStore();
  const [loadingAds, setLoadingAds] = useState<boolean>(false);

  console.log('userProfile ', userProfile);
  const rewardInterstitial = useRef<RewardedInterstitialAd | null>(null);

  const handleUpdateProfile = async () => {
    const response = await getUserProfile();
    if (response && response.data) {
      setUserProfile(response.data);
    }
  };

  const handleCheckIn = async () => {
    if (isCheckingIn) return;

    setIsCheckingIn(true);
    try {
      await rollCall();
      await handleUpdateProfile();
    } catch (error) {
      console.error('Check-in failed:', error);
      showErrorToast('Failed to check in. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleEarnDiamond = async () => {
    try {
      await earnTokenByAds();
      await handleUpdateProfile();
    } catch (error) {
      console.error('Watch ads failed:', error);
      showErrorToast('Failed to earn tokens. Please try again.');
    }
  };

  const handleWatchAds = async () => {
    if (loadingAds) {
      return;
    }
    rewardInterstitial.current?.load();
    setLoadingAds(true);
  };

  useEffect(() => {
    rewardInterstitial.current = RewardedInterstitialAd.createForAdRequest(ADMOB_ADS.CREATE_STORY_REWARD_INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: true,
    });
    if (!rewardInterstitial.current) return;
    // Event listener for when the ad is loaded
    const unsubscribeLoaded = rewardInterstitial.current.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewardInterstitial.current?.show();
      setLoadingAds(false);
    });

    // Event listener for when the ad is closed
    const unsubscribeEarnedReward = rewardInterstitial.current.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (event) => {
      console.log('AdEventType.EARNED_REWARD', event);
      handleEarnDiamond();
    });

    const unsubscribeClosed = rewardInterstitial.current.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('AdEventType.CLOSED');
    });
    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarnedReward();
      unsubscribeClosed();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disabledWatchAds = loadingAds || userProfile?.totalAmountWatchAds === 0;

  const currentStreak = (userProfile?.rollCallStreak || 1) - 1;
  return (
    <>
      {visible && <View style={styles.background} />}
      <Modal visible={visible} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={onClose}>
          <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Check-In</Text>
              <View style={styles.modalGem}>
                <Ionicons name="diamond" size={20} color="#7ee2ff" />
                <Text style={styles.modalGemText}>{userProfile?.diamond}</Text>
              </View>
            </View>
            {/* Check-in days row */}
            <View style={styles.modalCheckinRow}>
              {[3, 4, 5, 5, 5, 6, 10].map((gem, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.modalCheckinDay,
                    idx < currentStreak && styles.modalCheckinDayPass,
                    idx === currentStreak && styles.modalCheckinDayActive,
                    idx === 6 && { width: ITEM_WIDTH * 2 }
                  ]}
                >
                  <Text style={styles.modalCheckinDayText}>Day {idx + 1}</Text>
                  <View style={styles.modalCheckinDayIconContainer}>
                    <Ionicons
                      name="diamond"
                      size={18}
                      color="#7ee2ff"
                      style={styles.modalCheckinDayIcon}
                    />
                    <Text style={styles.modalCheckinDayGem}>{gem}</Text>
                  </View>
                  <Text style={styles.modalCheckinDayText2}>
                    {idx === 0 ? 'Check-In' : 'Unopened'}
                  </Text>
                </View>
              ))}
            </View>
            <Pressable
              style={[
                styles.modalCheckinBtn,
                isCheckingIn && styles.modalCheckinBtnDisabled,
              ]}
              onPress={handleCheckIn}
              disabled={isCheckingIn}
            >
              <Text style={styles.modalCheckinBtnText}>
                {isCheckingIn ? 'Checking In...' : 'Check-In'}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.modalAds,
                disabledWatchAds && styles.btnDisabled,
              ]}
              onPress={handleWatchAds}
              disabled={disabledWatchAds}
            >
              <Text style={styles.modalAdsText}>
                {loadingAds ? 'Watching Ads...' : `Watch Ads (${MAX_WATCH_ADS_PER_DAY - (userProfile?.totalAmountWatchAds || 0)}/${MAX_WATCH_ADS_PER_DAY})`}
                <Text style={{ color: '#7ee2ff' }}>
                  {'  '}Watch ads to earn{' '}
                </Text>
              </Text>
              <View
                style={styles.modalAdsGemContainer}
              >
                <Ionicons name="diamond" size={18} color="#7ee2ff" />
                <Text style={styles.modalAdsGem}>+10</Text>
              </View>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#232136',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalGem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2d2a4a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modalGemText: {
    color: '#7ee2ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCheckinRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    flexWrap: 'wrap',
  },
  modalCheckinDay: {
    padding: 8,
    backgroundColor: '#2d2a4a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: ITEM_WIDTH
  },
  modalCheckinDayActive: {
    borderWidth: 2,
    borderColor: '#7ee2ff',
  },
  modalCheckinDayPass: {
    backgroundColor: '#434253ff',
  },
  modalCheckinDayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalCheckinDayGem: {
    color: '#7ee2ff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  modalCheckinBtn: {
    marginTop: 32,
    backgroundColor: '#7ee2ff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCheckinBtnDisabled: {
    backgroundColor: '#4a5568',
    opacity: 0.6,
  },
  modalCheckinBtnText: {
    color: '#232136',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalAds: {
    marginTop: 24,
    backgroundColor: '#2d2a4a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAdsDisabled: {
    backgroundColor: '#1a1829',
    opacity: 0.6,
  },
  modalAdsText: {
    color: '#fff',
    fontSize: 15,
  },
  modalAdsGem: {
    color: '#7ee2ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCheckinDayIcon: {
    marginTop: 4,
  },
  modalCheckinDayIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalCheckinDayText2: {
    color: '#aaa',
    fontSize: 10,
    marginTop: 2,
  },
  modalAdsGemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
