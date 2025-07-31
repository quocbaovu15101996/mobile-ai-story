import TextApp from '@/components/TextApp';
import { useGetThemeColor } from '@/hooks/useThemeColor';
import { SCREEN_WIDTH } from '@/src/utils';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const appJson = require('../../app.json');

interface ItemProps {
  icon: any;
  iconRight?: any;
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
}

const SettingItem: React.FC<ItemProps> = ({ icon, iconRight, onPress, title, style }) => (
  <Pressable onPress={onPress} style={[styles.itemBox, style]}>
    <View style={styles.itemContent}>
      {icon}
      <TextApp style={styles.rowText}>{title}</TextApp>
    </View>
    {iconRight}
  </Pressable>
);

export default function SettingScreen() {
  const { colors } = useTheme();
  const themeColors = useGetThemeColor('dark');

  const handleUpgrade = () => {
    router.push('/InAppPurchase');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Check out AI Story - Create amazing stories with AI! Download it now.',
        title: 'AI Story App',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRate = () => {
    const storeUrl =
      'https://play.google.com/store/apps/details?id=com.codezap.ai.story';
    Linking.openURL(storeUrl).catch(() => {
      Alert.alert('Error', 'Unable to open app store');
    });
  };

  const handleContact = () => {
    Linking.openURL(
      'mailto:support@aistory.com?subject=AI Story Support'
    ).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handleTerms = () => {
    Linking.openURL('https://aistory.com/terms').catch(() => {
      Alert.alert('Error', 'Unable to open terms and conditions');
    });
  };

  const handlePrivacy = () => {
    Linking.openURL('https://aistory.com/privacy').catch(() => {
      Alert.alert('Error', 'Unable to open privacy policy');
    });
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement data clearing logic
            Alert.alert('Success', 'App data has been cleared.');
          },
        },
      ]
    );
  };

  const handleRestorePurchase = () => {
    // TODO: Implement restore purchase logic
    Alert.alert(
      'Restore Purchase',
      'Purchase restoration is not implemented yet.'
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Upgrade Premium */}
        <Pressable style={styles.premiumCard} onPress={handleUpgrade}>
          <TextApp style={styles.premiumTitle}>AuraWrite Pro+</TextApp>
        </Pressable>

        {/* General */}
        <TextApp style={styles.sectionTitle}>General</TextApp>
        <View style={styles.sectionCard}>
          <SettingItem
            icon={
              <MaterialCommunityIcons
                name="share-variant"
                size={22}
                color={themeColors.text}
              />
            }
            iconRight={
              <Ionicons name="arrow-forward" size={22} color={themeColors.text} />
            }
            onPress={handleShare}
            title="Share AuraWrite AI"
            style={{ backgroundColor: themeColors.backgroundGray }}
          />
          <SettingItem
            icon={
              <MaterialIcons name="star-rate" size={22} color={themeColors.text} />
            }
            iconRight={
              <Ionicons name="arrow-forward" size={22} color={themeColors.text} />
            }
            onPress={handleRate}
            title="Give AuraWrite AI 5 stars"
            style={{ backgroundColor: themeColors.backgroundGray }}
          />
          <SettingItem
            icon={
              <MaterialIcons name="alternate-email" size={22} color={themeColors.text} />
            }
            iconRight={
              <Ionicons name="arrow-forward" size={22} color={themeColors.text} />
            }
            onPress={handleContact}
            title="Contact us"
            style={{ backgroundColor: themeColors.backgroundGray }}
          />
        </View>
        {/* Terms & Privacy */}
        <TextApp style={styles.sectionTitle}>Terms & Privacy</TextApp>
        <View style={styles.sectionCard}>
          <SettingItem
            icon={
              <MaterialIcons name="description" size={22} color={themeColors.text} />
            }
            iconRight={
              <Ionicons name="arrow-forward" size={22} color={themeColors.text} />
            }
            onPress={handleTerms}
            title="Terms and Conditions"
            style={{ backgroundColor: themeColors.backgroundGray }}
          />
          <SettingItem
            icon={
              <MaterialCommunityIcons
                name="shield-check"
                size={22}
                color={themeColors.text}
              />
            }
            iconRight={
              <Ionicons name="arrow-forward" size={22} color={themeColors.text} />
            }
            onPress={handlePrivacy}
            title="Privacy Policy"
            style={{ backgroundColor: themeColors.backgroundGray }}
          />

          <SettingItem
            icon={
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={themeColors.text}
              />
            }
            iconRight={
              <TextApp style={styles.versionText}>{appJson?.expo?.version}</TextApp>
            }
            onPress={handlePrivacy}
            title="App version"
            style={{ backgroundColor: themeColors.backgroundGray }}
          />
        </View>
        <Pressable style={styles.clearBtn} onPress={handleClearData}>
          <TextApp style={styles.clearBtnText}>Clear data</TextApp>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  premiumCard: {
    backgroundColor: '#232136',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  premiumFeature: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  subscribeBtn: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  subscribeBtnText: {
    color: '#232136',
    fontWeight: 'bold',
    fontSize: 18,
  },
  restoreText: {
    color: '#bdbdc7',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 2,
  },
  sectionCard: {
    gap: 8,
    paddingBottom: 24,
  },
  itemBox: {
    flex: 1,
    width: SCREEN_WIDTH - 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 36,
  },
  versionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  clearBtn: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 12,
    borderColor: '#ff4d4f',
  },
  clearBtnText: {
    color: '#ff4d4f',
    fontWeight: 'bold',
    fontSize: 18,
  },
  premiumFeatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
});
