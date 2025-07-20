// import * as Notifications from 'expo-notifications';
// import notifee, { AndroidImportance } from '@notifee/react-native';
// import { Platform } from 'react-native';

// // Configure notification behavior
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

// export interface NotificationData {
//   title: string;
//   body: string;
//   data?: Record<string, any>;
// }

// export class NotificationService {
//   private static expoPushToken: string | null = null;

//   /**
//    * Request notification permissions
//    */
//   static async requestPermissions(): Promise<boolean> {
//     if (Platform.OS === 'android') {
//       await notifee.requestPermission();
//     }
    
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
    
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
    
//     return finalStatus === 'granted';
//   }

//   /**
//    * Get push token for remote notifications
//    */
//   static async getPushToken(): Promise<string | null> {
//     if (this.expoPushToken) {
//       return this.expoPushToken;
//     }

//     try {
//       const token = await Notifications.getExpoPushTokenAsync();
//       this.expoPushToken = token.data;
//       return token.data;
//     } catch (error) {
//       console.error('Failed to get push token:', error);
//       return null;
//     }
//   }

//   /**
//    * Show local notification using expo-notifications
//    */
//   static async showLocalNotification(notification: NotificationData): Promise<void> {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: notification.title,
//         body: notification.body,
//         data: notification.data || {},
//       },
//       trigger: null, // Show immediately
//     });
//   }

//   /**
//    * Show local notification using notifee (for more advanced features)
//    */
//   static async showNotifeeNotification(notification: NotificationData): Promise<void> {
//     // Create a channel for Android
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       importance: AndroidImportance.HIGH,
//     });

//     await notifee.displayNotification({
//       title: notification.title,
//       body: notification.body,
//       data: notification.data || {},
//       android: {
//         channelId,
//         importance: AndroidImportance.HIGH,
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   }

//   /**
//    * Setup notification listeners
//    */
//   static setupNotificationListeners(
//     onNotificationReceived?: (notification: Notifications.Notification) => void,
//     onNotificationPressed?: (response: Notifications.NotificationResponse) => void
//   ): () => void {
//     // Listen for notifications received while app is foregrounded
//     const receivedSubscription = Notifications.addNotificationReceivedListener(
//       (notification) => {
//         console.log('Notification received:', notification);
//         onNotificationReceived?.(notification);
//       }
//     );

//     // Listen for user interactions with notifications
//     const responseSubscription = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         console.log('Notification response:', response);
//         onNotificationPressed?.(response);
//       }
//     );

//     // Setup notifee listeners
//     const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
//       console.log('Notifee foreground event:', type, detail);
//       if (type === 1 && detail.notification) { // PRESS event
//         onNotificationPressed?.({
//           notification: detail.notification as any,
//           actionIdentifier: 'default',
//         });
//       }
//     });

//     // Return cleanup function
//     return () => {
//       receivedSubscription.remove();
//       responseSubscription.remove();
//       unsubscribeNotifee();
//     };
//   }

//   /**
//    * Handle notification actions
//    */
//   static handleNotificationAction(
//     response: Notifications.NotificationResponse,
//     navigation?: any
//   ): void {
//     const { notification } = response;
//     const data = notification.request.content.data;

//     console.log('Handling notification action:', data);

//     // Handle different types of notifications based on data
//     if (data?.type === 'story_complete') {
//       navigation?.navigate('ThreadDetail', { id: data.threadId });
//     } else if (data?.type === 'daily_reminder') {
//       navigation?.navigate('Home');
//     } else if (data?.type === 'token_update') {
//       navigation?.navigate('InAppPurchase');
//     }
//     // Add more action types as needed
//   }
// }