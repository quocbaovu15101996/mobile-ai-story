import {
  SUBSCRIPTION_IDS,
  inAppPurchaseService,
  SubscriptionProduct,
} from '@/src/services/inAppPurchase';
import { showErrorToast, showSuccessToast } from '@/src/utils/toast';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function InAppPurchaseScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_IDS.ANNUAL);
  const [subscriptions, setSubscriptions] = useState<SubscriptionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    initializeIAP();

    // Cleanup on unmount
    return () => {
      inAppPurchaseService.cleanup();
    };
  }, []);

  const initializeIAP = async () => {
    try {
      setIsLoading(true);
      const initialized = await inAppPurchaseService.initialize();

      if (initialized) {
        const availableProducts = await inAppPurchaseService.getAvailableProducts();
        setSubscriptions(availableProducts);
        
        // Check if user is already subscribed
        const subscriptionStatus = inAppPurchaseService.isUserSubscribed();
        setIsSubscribed(subscriptionStatus);
        
        if (subscriptionStatus) {
          showSuccessToast('You already have an active subscription!');
        }
      } else {
        showErrorToast('Failed to initialize purchase system');
      }
    } catch (error) {
      console.error('IAP initialization error:', error);
      showErrorToast('Failed to load subscription options');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (isPurchasing) return;

    try {
      setIsPurchasing(true);

      const result = await inAppPurchaseService.purchaseSubscription(selectedPlan);
      
      if (result.success) {
        showSuccessToast('Subscription activated successfully!');
        // Navigate back or to main screen
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Purchase initiation error:', error);
      const errorMessage = error.message || 'Failed to start purchase';
      showErrorToast(errorMessage);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    if (isRestoring) return;

    try {
      setIsRestoring(true);
      const result = await inAppPurchaseService.restorePurchases();
      
      if (result.success && result.customerInfo) {
        const hasActiveSubscription = inAppPurchaseService.isUserSubscribed();
        setIsSubscribed(hasActiveSubscription);
        
        if (hasActiveSubscription) {
          showSuccessToast('Purchases restored successfully!');
          navigation.goBack();
        } else {
          showErrorToast('No active subscriptions found');
        }
      }
    } catch (error: any) {
      console.error('Restore purchases error:', error);
      const errorMessage = error.message || 'Failed to restore purchases';
      showErrorToast(errorMessage);
    } finally {
      setIsRestoring(false);
    }
  };

  const getProductPrice = (subscriptionId: string): string => {
    const subscription = subscriptions.find(
      (s) => s.productId === subscriptionId
    );
    if (!subscription) {
      return subscriptionId === SUBSCRIPTION_IDS.ANNUAL
        ? '999.000 đ'
        : '125.000 đ';
    }

    return subscription.localizedPrice || 
      (subscriptionId === SUBSCRIPTION_IDS.ANNUAL ? '999.000 đ' : '125.000 đ');
  };

  const onClose = () => {
    navigation.goBack();
  };

  const renderItem: ListRenderItem<any> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.planBox,
        selectedPlan === item.subscriptionId && styles.planBoxSelected,
      ]}
      onPress={() => setSelectedPlan(item.subscriptionId)}
      activeOpacity={0.8}
    >
      <View style={styles.planRow}>
        <Text style={styles.planRenew}>{item.label}</Text>
        {item.saveTag && (
          <View style={styles.saveTag}>
            <Text style={styles.saveText}>{item.saveTag}</Text>
          </View>
        )}
      </View>
      <Text style={styles.planPrice}>
        {item.price} <Text style={styles.planPeriod}>{item.period}</Text>
      </Text>
    </TouchableOpacity>
  );

  // Plan data for FlatList
  const plans = [
    {
      label: 'Renews annually',
      price: getProductPrice(SUBSCRIPTION_IDS.ANNUAL),
      period: '/ year',
      saveTag: 'Save 90%',
      selected: selectedPlan === 'year',
      subscriptionId: SUBSCRIPTION_IDS.ANNUAL,
    },
    {
      label: 'Renews weekly',
      price: getProductPrice(SUBSCRIPTION_IDS.WEEKLY),
      period: '/ week',
      saveTag: null,
      selected: selectedPlan === 'week',
      subscriptionId: SUBSCRIPTION_IDS.WEEKLY,
    },
  ];

  const keyExtractor = (item: any) => item.subscriptionId;

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#222" />
          <Text style={styles.loadingText}>
            Loading subscription options...
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          No subscription options available
        </Text>
      </View>
    );
  };

  const renderFooter = () => (
    <View>
      <TouchableOpacity
        style={[
          styles.subscribeBtn,
          (isPurchasing || isSubscribed) && styles.subscribeButtonDisabled,
        ]}
        onPress={handlePurchase}
        disabled={isPurchasing || isSubscribed}
      >
        {isPurchasing ? (
          <>
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.subscribeText}>Processing...</Text>
          </>
        ) : isSubscribed ? (
          <Text style={styles.subscribeText}>Already Subscribed</Text>
        ) : (
          <>
            <Text style={styles.subscribeText}>Subscribe</Text>
            <Ionicons
              name="arrow-forward"
              size={22}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.restoreBtn,
          isRestoring && styles.restoreButtonDisabled,
        ]}
        onPress={handleRestorePurchases}
        disabled={isRestoring}
      >
        {isRestoring ? (
          <>
            <ActivityIndicator
              size="small"
              color="#666"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.restoreText}>Restoring...</Text>
          </>
        ) : (
          <Text style={styles.restoreText}>Restore Purchases</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Ionicons name="close" size={28} color="#222" />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Get Unlimited{'\n'}Access</Text>
        
        {isSubscribed && (
          <View style={styles.subscribedBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.subscribedText}>You have an active subscription!</Text>
          </View>
        )}
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons
              name="infinite"
              size={28}
              color="#222"
              style={styles.featureIcon}
            />
            <View>
              <Text style={styles.featureTitle}>Unlimited Access</Text>
              <Text style={styles.featureDesc}>Endless story creations</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="crown-outline"
              size={28}
              color="#222"
              style={styles.featureIcon}
            />
            <View>
              <Text style={styles.featureTitle}>Advanced AI</Text>
              <Text style={styles.featureDesc}>Smarter AI, richer & more</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome5
              name="wallet"
              size={24}
              color="#222"
              style={styles.featureIcon}
            />
            <View>
              <Text style={styles.featureTitle}>Ad-Free Experience</Text>
              <Text style={styles.featureDesc}>
                Focus on stories, not distractions
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.planBoxWrapper}>
          <FlatList
            data={plans}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            scrollEnabled={false}
            ListFooterComponent={renderFooter}
          />
        </View>

        <Text style={styles.noteText}>
          Payment will be charged to your Google Play account. Subscriptions
          auto-renew at the end of the subscription period unless canceled 24
          hours in advance prior to the end of the current period. Your account
          will be charged for renewal within 24 hours before the end of the
          current period. You can manage and cancel your subscriptions in the
          Google Play store settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
    paddingTop: 16,
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.5,
    lineHeight: 38,
  },
  subscribedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  subscribedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 8,
  },
  featureList: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  featureIcon: {
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  featureDesc: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  planBoxWrapper: {
    marginBottom: 24,
  },
  planBox: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  planBoxSecondary: {
    opacity: 0.6,
  },
  planBoxSelected: {
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  planRenew: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  saveTag: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  saveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  planPeriod: {
    fontSize: 15,
    fontWeight: '400',
    color: '#888',
  },
  subscribeBtn: {
    backgroundColor: '#222',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 18,
  },
  subscribeButtonDisabled: {
    backgroundColor: '#888',
  },
  restoreBtn: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  restoreButtonDisabled: {
    opacity: 0.6,
  },
  restoreText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  subscribeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  noteText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});
