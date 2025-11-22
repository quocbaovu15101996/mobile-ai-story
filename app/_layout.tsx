import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import SplashScreen from '@/components/SplashScreen';
// import { useColorScheme } from '@/hooks/useColorScheme';
import { initializeFirebase } from '@/config/firebase-config';
import { useAuthStore } from '@/src/store/useAuthStore';
import { MobileAds } from 'react-native-google-mobile-ads';
import { analyticsService } from '@/src/services/analyticsService';

if (__DEV__) {
  require("../src/config/ReactotronConfig");
};

export type RootStackParamList = {
  InAppPurchase: undefined;
  ThreadDetail: { threadId: string, isCreate: boolean };
};

const DefaultDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    backgroundGray: 'rbg(20,20,20)',
  },
}

const DefaultLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    backgroundGray: 'rbg(20,20,20)',
  },
}
export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);
  const { loginByDevice, userProfile } = useAuthStore();

  useEffect(() => {
    initializeFirebase();
    const initializeAuth = async () => {
      try {
        // Attempt auto-login using device credentials
        await loginByDevice();
      } catch (error) {
        console.error('Auto-login failed:', error);
      } finally {
        // Show splash screen for at least 2 seconds for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    const initializeAds = async () => {
      await MobileAds().initialize();
    };

    initializeAds();
    initializeAuth();

  }, [loginByDevice]);

  // Set user ID for analytics when user profile is available
  useEffect(() => {
    if (userProfile?.id) {
      analyticsService.setUserId(userProfile.id.toString());
      analyticsService.setUserProperty('is_vip', userProfile.isVip ? 'true' : 'false');
    }
  }, [userProfile]);

  if (!loaded || isLoading) {
    return <SplashScreen />;
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
