import BenefitBox from '@/components/inappPurchase/BenefitBox';
import PurchaseItem from '@/components/inappPurchase/PurchaseItem';
import { ModalLoading } from '@/components/ModalLoading';
import {
  PurchaseSuccessInterface,
  useInAppPurchase,
} from '@/src/hooks/useInAppPurchase';
import { inAppPurchaseApi } from '@/src/services/api/inAppPurchase';
import { getUserProfile } from '@/src/services/api/users';
import { useAuthStore } from '@/src/store';
import { isIos, isNullOrEmpty, SUBSCRIPTION_IDS } from '@/src/utils';
import { showErrorToast } from '@/src/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useTheme } from '@react-navigation/native';
import {
  getAvailablePurchases,
  ProductPurchaseAndroid,
  PurchaseError,
  requestPurchase,
  SubscriptionProduct,
} from 'expo-iap';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InAppPurchaseScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const clickedRef = React.useRef<boolean>(false);
  const [stateScreen, setStateScreen] = React.useState<{
    selectedPlanId: string;
    offerToken: string;
    loading: boolean;
    loadingRestore: boolean;
  }>({
    selectedPlanId: SUBSCRIPTION_IDS[0],
    offerToken: '',
    loading: false,
    loadingRestore: false,
  });
  const { setUserProfile } = useAuthStore();

  const handleUpdateProfile = async () => {
    const response = await getUserProfile();
    if (response && response.data) {
      setUserProfile(response.data);
    }
  };

  const onPurchaseSuccess = async (purchase: PurchaseSuccessInterface) => {
    console.log('Purchase success', purchase);
    setStateScreen((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const receipt = (
        isIos ? purchase?.transactionReceipt : purchase?.purchaseTokenAndroid
      ) as string;
      const response = await inAppPurchaseApi.submitPurchase({
        platform: isIos ? 'ios' : 'android',
        subscriptionId: stateScreen.selectedPlanId,
        transactionId: purchase?.transactionId || '',
        purchaseToken: purchase?.purchaseTokenAndroid || '',
        receipt: receipt,
      });
      if (response?.status === 200) {
        await handleUpdateProfile();
        navigation.goBack();
      }
    } catch (error) {
      console.error('Purchase error', error);
      showErrorToast('Failed to purchase. Please try again.');
    } finally {
      setStateScreen((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const onPurchaseError = (error?: PurchaseError) => {
    console.log('Purchase error', error);
  };

  const { subscriptions, loadingSubs } = useInAppPurchase(
    onPurchaseSuccess,
    onPurchaseError,
    clickedRef.current
  );

  const onPressSubscribe = async () => {
    clickedRef.current = true;
    setStateScreen((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      await requestPurchase({
        request: {
          ios: { sku: stateScreen.selectedPlanId },
          android: {
            skus: [stateScreen.selectedPlanId],
            subscriptionOffers: [
              {
                sku: stateScreen.selectedPlanId,
                offerToken: stateScreen.offerToken,
              },
            ],
          },
        },
        type: 'subs',
      });
    } catch (error) {
      if (error instanceof PurchaseError) {
        console.error({ message: `[${error.code}]: ${error.message}`, error });
      } else {
        console.error({ message: 'handleBuySubscription', error });
      }
      setStateScreen((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const onClose = () => {
    navigation.goBack();
  };

  const onPressItem = (item: SubscriptionProduct & any) => {
    setStateScreen((prevState) => ({
      ...prevState,
      selectedPlanId: item.id,
      offerToken: item.subscriptionOfferDetails?.[0]?.offerToken || '',
    }));
  };

  const renderItem: ListRenderItem<any> = ({ item }) => (
    <PurchaseItem
      item={item}
      selectedPlanId={stateScreen.selectedPlanId}
      onPress={onPressItem}
    />
  );

  const handleRestorePurchases = async () => {
    setStateScreen((prevState) => ({
      ...prevState,
      loadingRestore: true,
    }));
    const subscription: ProductPurchaseAndroid[] =
      await getAvailablePurchases();
    console.log('handleRestorePurchases', subscription);
    try {
      await inAppPurchaseApi.restorePurchase({
        platform: isIos ? 'ios' : 'android',
        subscriptionId: subscription?.[0]?.id || '',
        transactionId: subscription?.[0]?.transactionId || '',
        purchaseToken: subscription?.[0]?.purchaseTokenAndroid || '',
        receipt: subscription?.[0]?.transactionReceipt || '',
      });
      await handleUpdateProfile();
      navigation.goBack();
    } catch (error) {
      console.error('Restore purchase error', error);
      showErrorToast('Failed to restore purchases. Please try again.');
    } finally {
      setStateScreen((prevState) => ({
        ...prevState,
        loadingRestore: false,
      }));
    }
  };

  useEffect(() => {
    if (!loadingSubs) {
      const selectPlan = subscriptions.find(
        (item) => item.id === SUBSCRIPTION_IDS[0]
      );
      const subscriptionOfferDetails = selectPlan?.subscriptionOfferDetails;

      setStateScreen((prevState) => ({
        ...prevState,
        selectedPlanId: selectPlan?.id,
        offerToken: !isNullOrEmpty(subscriptionOfferDetails)
          ? subscriptionOfferDetails?.[subscriptionOfferDetails?.length - 1]
            ?.offerToken
          : '',
      }));
    }
  }, [loadingSubs, subscriptions]);

  const keyExtractor = (item: any, index: number) => item.id + index;

  const renderEmpty = () => {
    if (loadingSubs) {
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
      <Pressable
        style={[
          styles.subscribeBtn,
          (stateScreen.loading || stateScreen.selectedPlanId === '') &&
          styles.subscribeButtonDisabled,
        ]}
        onPress={onPressSubscribe}
        disabled={stateScreen.loading || stateScreen.selectedPlanId === ''}
      >
        {stateScreen.loading ? (
          <>
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.subscribeText}>Processing...</Text>
          </>
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
      </Pressable>

      <Pressable
        style={[
          styles.restoreBtn,
          stateScreen.loadingRestore && styles.restoreButtonDisabled,
        ]}
        onPress={handleRestorePurchases}
        disabled={stateScreen.loadingRestore}
      >
        {stateScreen.loadingRestore ? (
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
      </Pressable>
    </View>
  );

  const sortSubscription = subscriptions.sort((a: any, b: any) => {
    const priceA = Number(a.price);
    const priceB = Number(b.price);
    return priceB - priceA;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={onClose}>
        <Ionicons name="close" size={28} color="#222" />
      </Pressable>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Get Unlimited{'\n'}Access</Text>

        <BenefitBox />
        <View style={styles.planBoxWrapper}>
          <FlatList
            data={sortSubscription}
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
      <ModalLoading modalVisible={stateScreen.loading} color={colors.primary} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
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
