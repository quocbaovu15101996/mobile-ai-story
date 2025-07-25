import { earnTokenByAds, getUserProfile, rollCall } from '@/src/services/api/users';
import { useUserProfile } from '@/src/store/useAuthStore';
import { showErrorToast } from '@/src/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function RollCallModal(props: Props) {
  const { visible, onClose } = props;
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isWatchingAds, setIsWatchingAds] = useState(false);
  const userProfile = useUserProfile();

  const handleCheckIn = async () => {
    if (isCheckingIn) return;

    setIsCheckingIn(true);
    try {
      await rollCall();
      await getUserProfile();
    } catch (error) {
      console.error('Check-in failed:', error);
      showErrorToast('Failed to check in. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleWatchAds = async () => {
    if (isWatchingAds) return;
    setIsWatchingAds(true);
    try {
      await earnTokenByAds();
      await getUserProfile();
    } catch (error) {
      console.error('Watch ads failed:', error);
      showErrorToast('Failed to earn tokens. Please try again.');
    } finally {
      setIsWatchingAds(false);
    }
  };

  return (
    <>
      {visible && <View style={styles.background} />}
      <Modal visible={visible} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={onClose}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Check-In</Text>
              <View style={styles.modalGem}>
                <Ionicons name="diamond" size={20} color="#7ee2ff" />
                <Text style={styles.modalGemText}>{userProfile?.diamond}</Text>
              </View>
            </View>
            {/* Check-in days row */}
            <View style={styles.modalCheckinRow}>
              {[5, 6, 7, 8, 8, 8, 10].map((gem, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.modalCheckinDay,
                    idx === 0 && styles.modalCheckinDayActive,
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
            <TouchableOpacity
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
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalAds,
                isWatchingAds && styles.modalAdsDisabled,
              ]}
              onPress={handleWatchAds}
              disabled={isWatchingAds}
            >
              <Text style={styles.modalAdsText}>
                {isWatchingAds ? 'Watching Ads...' : 'Watch Ads (0/5)'}
                <Text style={{ color: '#7ee2ff' }}>
                  {' '}
                  Watch ads to earn 1 Gems
                </Text>
              </Text>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Ionicons name="diamond" size={18} color="#7ee2ff" />
                <Text style={styles.modalAdsGem}>+1</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    padding: 24,
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
    gap: 4,
    flexWrap: 'wrap',
  },
  modalCheckinDay: {
    padding: 8,
    backgroundColor: '#2d2a4a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  modalCheckinDayActive: {
    borderWidth: 2,
    borderColor: '#7ee2ff',
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
    justifyContent: 'space-between',
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
});
