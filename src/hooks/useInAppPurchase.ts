import {
  getSubscriptions,
  ProductPurchase,
  PurchaseError,
  purchaseErrorListener,
  SubscriptionProduct,
  useIAP,
} from 'expo-iap';
import { useEffect, useRef, useState } from 'react';
import { isNullOrEmpty, SUBSCRIPTION_IDS } from '../utils';

export const useInAppPurchase = (
  onPurchaseSuccess: (purchase: ProductPurchase | undefined) => void,
  onPurchaseError: (errMsg?: PurchaseError) => void,
  clicked: boolean,
): {
  subscriptions: (SubscriptionProduct & any)[];
  loadingSubs: boolean;
} => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProduct[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(true);

  const {
    currentPurchase,
    finishTransaction,
    subscriptions: subscriptionsIAP,
  } = useIAP();

  const isMounted = useRef(true);
  const getSubs = async () => {
    try {
      if (isMounted.current && !isNullOrEmpty(subscriptionsIAP)) {
        setSubscriptions(subscriptionsIAP);
        setLoadingSubs(false);
      } else if (isMounted.current) {
        const subs = await getSubscriptions(SUBSCRIPTION_IDS);
        setSubscriptions(subs);
        setLoadingSubs(false);
      }
    } catch (error: any) {
      if (isMounted.current) {
        setLoadingSubs(false);
        console.log('Something went wrong 1');
      }
    }
  };

  const checkCurrentPurchase = async () => {
    try {
      if (currentPurchase?.transactionReceipt && clicked) {
        console.log('Start finish transaction when user click to buy');
        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: false,
        });
        onPurchaseSuccess(currentPurchase);
      }
    } catch (error) {
      if (error instanceof PurchaseError) {
        console.error({ message: `[${error.code}]: ${error.message}`, error });
      } else {
        console.error({ message: 'handleBuyProduct', error });
      }
    }
  };

  const purErrorListener = (error: PurchaseError) => {
    onPurchaseError(error);
    console.log('____', error.debugMessage);
  };

  useEffect(() => {
    isMounted.current = true;
    getSubs();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkCurrentPurchase();
    const purchaseError = purchaseErrorListener(purErrorListener);

    return () => {
      purchaseError.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPurchase, finishTransaction]);

  return {
    subscriptions,
    loadingSubs,
  };
};
