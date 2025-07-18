# Notification Implementation

This document describes the notification functionality implemented in the mobile AI story app.

## Libraries Used

- **expo-notifications**: For handling push notifications and local notifications in Expo environment
- **@notifee/react-native**: For advanced notification features and better Android support

## Features Implemented

### 1. Permission Management
- Requests notification permissions on app startup
- Shows permission status in the header with a notification icon
- Provides user feedback when permissions are denied

### 2. Notification Types
The app supports different types of notifications:
- **Story Complete**: Notifies when AI story generation is complete
- **Daily Reminder**: Reminds users to create new stories
- **Token Update**: Notifies about token/credit changes

### 3. Notification Handling
- **Receipt**: Handles notifications received while app is in foreground
- **Display**: Shows notifications using both expo-notifications and notifee
- **Actions**: Handles notification tap actions and navigates to appropriate screens

### 4. HomeScreen Integration
The notification logic is integrated into the HomeScreen component:
- Requests permissions on component mount
- Sets up notification listeners
- Displays notification status in header
- Includes test buttons for development

## Usage

### Setting up Notifications
```typescript
import { NotificationService } from '../services/notificationService';

// Request permissions
const hasPermission = await NotificationService.requestPermissions();

// Setup listeners
const cleanup = NotificationService.setupNotificationListeners(
  (notification) => {
    // Handle foreground notification
  },
  (response) => {
    // Handle notification press
  }
);
```

### Showing Notifications
```typescript
// Show local notification
await NotificationService.showLocalNotification({
  title: 'Story Complete!',
  body: 'Your AI story is ready to read',
  data: { type: 'story_complete', threadId: 'abc123' }
});

// Show notifee notification
await NotificationService.showNotifeeNotification({
  title: 'Daily Reminder',
  body: 'Create your daily story!',
  data: { type: 'daily_reminder' }
});
```

## Configuration

The notification permissions are configured in `app.json`:
```json
{
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/images/notification-icon.png",
        "color": "#ffffff",
        "defaultChannel": "default"
      }
    ],
    "@notifee/react-native"
  ]
}
```

## Testing

Test buttons are included in the HomeScreen for development:
- Test Expo Notification: Shows a basic notification using expo-notifications
- Test Notifee Notification: Shows an advanced notification using notifee

## Development Notes

- The test buttons should be removed in production
- Push token is logged for debugging purposes
- Notification permissions are visually indicated in the header
- Error handling is implemented for permission requests and notification display