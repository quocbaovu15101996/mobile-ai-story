import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import SplashScreen from '@/components/SplashScreen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/src/store/useAuthStore';

export type RootStackParamList = {
  InAppPurchase: undefined;
  ThreadDetail: { threadId: string };
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);
  const { loginByDevice } = useAuthStore();

  useEffect(() => {
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
        }, 2000);
      }
    };

    if (loaded) {
      initializeAuth();
    }
  }, [loaded, loginByDevice]);

  if (!loaded || isLoading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
