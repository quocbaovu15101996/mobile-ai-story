import CreateThreadBox from '@/components/CreateThreadBox';
import RollCallModal from '@/components/RollCallModal';
import TextApp from '@/components/TextApp';
import { useUserProfile } from '@/src/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { RootStackParamList } from '../_layout';
// import { NotificationService } from '../../src/services/notificationService';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userProfile = useUserProfile();

  // Setup notification listeners and permissions
  // const setupNotifications = useCallback(async () => {
  //   try {
  //     // Request notification permissions
  //     const hasPermission = await NotificationService.requestPermissions();
  //     setNotificationPermission(hasPermission);

  //     if (!hasPermission) {
  //       Alert.alert(
  //         'Notification Permission',
  //         'Please enable notifications to receive story updates and reminders.',
  //         [
  //           { text: 'Cancel', style: 'cancel' },
  //           { text: 'Settings', onPress: () => {
  //             // You could navigate to settings here
  //           }}
  //         ]
  //       );
  //       return;
  //     }

  //     // Get push token for remote notifications
  //     const pushToken = await NotificationService.getPushToken();
  //     console.log('Push token:', pushToken);

  //     // Setup notification listeners
  //     const cleanup = NotificationService.setupNotificationListeners(
  //       (notification) => {
  //         // Handle notification received while app is in foreground
  //         console.log('Notification received in foreground:', notification);
  //         Alert.alert(
  //           notification.request.content.title || 'Notification',
  //           notification.request.content.body || 'You have a new notification',
  //           [{ text: 'OK' }]
  //         );
  //       },
  //       (response) => {
  //         // Handle notification press
  //         console.log('Notification pressed:', response);
  //         NotificationService.handleNotificationAction(response, navigation);
  //       }
  //     );

  //     // Store cleanup function for later use
  //     return cleanup;
  //   } catch (error) {
  //     console.error('Failed to setup notifications:', error);
  //     Alert.alert('Error', 'Failed to setup notifications');
  //   }
  // }, [navigation]);

  useEffect(() => {
    // setupNotifications();

    // Cleanup listeners on unmount
    return () => {
      // Cleanup is handled by the service
    };
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

  // Test notification function - for development purposes
  const testNotification = async () => {
    // try {
    //   await NotificationService.showLocalNotification({
    //     title: 'Test Notification',
    //     body: 'This is a test notification from AI Story app!',
    //     data: { type: 'test', timestamp: Date.now() },
    //   });
    // } catch (error) {
    //   console.error('Failed to show test notification:', error);
    // }
  };

  // Test notifee notification
  const testNotifeeNotification = async () => {
    // try {
    //   await NotificationService.showNotifeeNotification({
    //     title: 'Story Complete!',
    //     body: 'Your AI story has been generated and is ready to read.',
    //     data: { type: 'story_complete', threadId: 'test-123' },
    //   });
    // } catch (error) {
    //   console.error('Failed to show notifee notification:', error);
    // }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TextApp style={styles.appName}>AuraWrite AI</TextApp>
        <View style={styles.headerRight}>
          <Pressable
            style={({ pressed }) => [styles.tokenBox, pressed && { opacity: 0.7 }]}
            onPress={onPressToken}
          >
            <Ionicons name="diamond" size={20} color="#7ee2ff" />
            <TextApp style={styles.tokenValue}>{userProfile?.diamond}</TextApp>
          </Pressable>
          <Pressable
            style={styles.calendarIcon}
            onPress={onPressCalendar}
          >
            <Ionicons name="calendar-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>

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
