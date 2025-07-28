import TextApp from '@/components/TextApp';
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
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const packageJson = require('../../package.json');

interface ItemProps {
  icon: any;
  onPress: () => void;
  title: string;
}

const SettingItem: React.FC<ItemProps> = ({ icon, onPress, title }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    {icon}
    <TextApp style={styles.rowText}>{title}</TextApp>
  </TouchableOpacity>
);

export default function SettingScreen() {
  const { colors } = useTheme();

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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ height: StatusBar.currentHeight }} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Upgrade Premium */}
        <View style={styles.premiumCard}>
          <TextApp style={styles.premiumTitle}>Upgrade Premium</TextApp>
          <View style={styles.premiumFeatureContainer}>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <TextApp style={styles.premiumFeature}> Ad-Free Experience</TextApp>
          </View>
          <View style={styles.premiumFeatureContainer}>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <TextApp style={styles.premiumFeature}>
              {' '}
              Unlimited story generations
            </TextApp>
          </View>
          <View style={styles.premiumFeatureContainer}>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <TextApp style={styles.premiumFeature}>
              {' '}
              Advanced AI Creativity
            </TextApp>
          </View>
          <TouchableOpacity style={styles.subscribeBtn} onPress={handleUpgrade}>
            <TextApp style={styles.subscribeBtnText}>
              Subscribe{' '}
              <Ionicons name="arrow-forward" size={18} color="#232136" />
            </TextApp>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 8 }}
            onPress={handleRestorePurchase}
          >
            <TextApp style={styles.restoreText}>Restore purchase</TextApp>
          </TouchableOpacity>
        </View>

        {/* General */}
        <TextApp style={styles.sectionTitle}>General</TextApp>
        <View style={styles.sectionCard}>
          <SettingItem
            icon={
              <MaterialCommunityIcons
                name="share-variant"
                size={22}
                color="#232136"
              />
            }
            onPress={handleShare}
            title="Share AI Story"
          />
          <View style={styles.divider} />
          <SettingItem
            icon={
              <MaterialIcons name="star-rate" size={22} color="#232136" />
            }
            onPress={handleRate}
            title="Give AI Story 5 stars"
          />
          <View style={styles.divider} />
          <SettingItem
            icon={
              <MaterialIcons name="alternate-email" size={22} color="#232136" />
            }
            onPress={handleContact}
            title="Contact us"
          />
        </View>

        {/* Terms & Privacy */}
        <TextApp style={styles.sectionTitle}>Terms & Privacy</TextApp>
        <View style={styles.sectionCard}>
          <SettingItem
            icon={
              <MaterialIcons name="description" size={22} color="#232136" />
            }
            onPress={handleTerms}
            title="Terms and Conditions"
          />
          <View style={styles.divider} />
          <SettingItem
            icon={
              <MaterialCommunityIcons
                name="shield-check"
                size={22}
                color="#232136"
              />
            }
            onPress={handlePrivacy}
            title="Privacy Policy"
          />
          <View style={styles.divider} />
          <View style={styles.row}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#232136"
            />
            <TextApp style={styles.rowText}>App version</TextApp>
            <TextApp style={styles.versionText}>{packageJson.version}</TextApp>
          </View>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearData}>
          <TextApp style={styles.clearBtnText}>Clear data</TextApp>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  rowText: {
    fontSize: 16,
    color: '#232136',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 36,
  },
  versionText: {
    fontSize: 15,
    color: '#bdbdc7',
    marginRight: 8,
    fontWeight: '500',
  },
  clearBtn: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
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
