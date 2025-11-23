import CreateThreadBox from '@/components/CreateThreadBox';
import { useUserProfile } from '@/src/store/useAuthStore';
import { useNavigation, useTheme } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet
} from 'react-native';
import { RootStackParamList } from '../_layout';
import { HeaderBox } from '@/components/HeaderBox';
import RollCallModal from '@/components/RollCallModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyticsService } from '@/src/services/analyticsService';

export default function HomeScreen() {
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userProfile = useUserProfile();

  useEffect(() => {
    // Track screen view
    analyticsService.logScreenView('Home');
  }, []);

  const onPressToken = () => {
    navigation.navigate('InAppPurchase');
  };

  const onPressCalendar = () => {
    setModalVisible(true);
  };

  const onCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBox
        title='AuraWrite AI'
        diamond={userProfile?.diamond}
        onPressToken={onPressToken}
        onPressCalendar={onPressCalendar}
        isVip={userProfile?.isVip}
      />
      <CreateThreadBox />
      <RollCallModal visible={modalVisible} onClose={onCloseModal} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenBox: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenLabel: {
    fontSize: 12,
  },
  tokenValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7ee2ff',
  },
  calendarIcon: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
  notificationIcon: {
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonsContainer: {
    padding: 20,
    gap: 10,
  },
  testButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
