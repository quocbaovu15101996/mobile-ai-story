import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

// import { useColorScheme } from '@/hooks/useColorScheme';
import { initializeFirebase } from '@/config/firebase-config';
import { analyticsService } from '@/src/services/analyticsService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { MobileAds } from 'react-native-google-mobile-ads';

if (__DEV__) {
  require('../src/config/ReactotronConfig');
}

export type RootStackParamList = {
  InAppPurchase: undefined;
  ThreadDetail: { threadId: string; isCreate: boolean };
};

const DefaultDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    backgroundGray: 'rbg(20,20,20)',
  },
};

const DefaultLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    backgroundGray: 'rbg(20,20,20)',
  },
};
export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);
  const { loginByDevice, userProfile } = useAuthStore();

  // Keep the native splash screen visible while we load resources
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    initializeFirebase();
    const initializeAuth = async () => {
      await loginByDevice();
      setIsLoading(false);
    };

    const initializeAds = async () => {
      await MobileAds().initialize();
    };

    initializeAds();
    initializeAuth();
  }, [loginByDevice]);

  // Hide the native splash screen when fonts are loaded and initialization is complete
  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  // Set user ID for analytics when user profile is available
  useEffect(() => {
    if (userProfile?.id) {
      analyticsService.setUserId(userProfile.id.toString());
      analyticsService.setUserProperty(
        'is_vip',
        userProfile.isVip?.toString() || 'false'
      );
    }
  }, [userProfile]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <ThemeProvider
      // value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      value={DefaultDarkTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="InAppPurchase" options={{ headerShown: false }} />
        <Stack.Screen name="ThreadDetail" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
