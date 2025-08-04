import { isIos } from '@/src/utils';
import { SubscriptionProduct } from 'expo-iap';
import React from 'react';
import { NativeModules, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  item: SubscriptionProduct;
  selectedPlanId: string;
  onPress: (item: SubscriptionProduct) => void;
};

const PurchaseItem = ({ item, selectedPlanId, onPress }: Props) => {
  const yearlyPlan = item?.id.includes('12m');

  let locale: string =
    isIos
      ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  const getPrice = (itemSub: any) => {
    if (isIos) {
      const config: any = {
        style: 'currency',
        currency: itemSub.currency,
        maximumFractionDigits: 9,
      };

      const resolvedLocale = locale?.replace('_', '-');

      try {
        return new Intl.NumberFormat(resolvedLocale, config).format(
          item?.price ?? 0,
        );
      } catch (error) {
        console.error('Error formatting price:', error);
        return 'N/A';
      }
    }

    const offerPricingPhaseList =
      itemSub?.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList;
    const length = offerPricingPhaseList?.length;
    const formattedPrice =
      itemSub?.subscriptionOfferDetails?.[0]?.pricingPhases?.pricingPhaseList?.[
        length - 1
      ]?.formattedPrice;
    return formattedPrice || 'N/A';
  };

  const productName = (productId: string) => {
    return productId.includes('1w') ? 'week' : 'year';
  };

  const getTitle = (productId: string) => {
    return productId.includes('1w') ? 'Weekly' : 'Yearly';
  };
  return (
    <Pressable
      style={({ pressed }) => [
        styles.planBox,
        selectedPlanId === item.id && styles.planBoxSelected,
        pressed && { opacity: 0.8 }
      ]}
      onPress={() => onPress(item)}
    >
      <View style={styles.planRow}>
        <Text style={styles.planRenew}>{getTitle(item.id)}</Text>
        {yearlyPlan && (
          <View style={styles.saveTag}>
            <Text style={styles.saveText}>Save 90%</Text>
          </View>
        )}
      </View>
      <Text style={styles.planPrice}>
        {getPrice(item)} <Text style={styles.planPeriod}>/ {productName(item.id)}</Text>
      </Text>
    </Pressable>
  )
}

export default PurchaseItem;

const styles = StyleSheet.create({
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
    position: 'absolute',
    right: 0,
    top: 0,
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
