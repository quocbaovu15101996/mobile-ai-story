import {
  ProductPurchase,
  ProductPurchaseAndroid,
  ProductPurchaseIos,
  PurchaseError,
  purchaseErrorListener,
  requestProducts,
  SubscriptionProduct,
  useIAP
} from 'expo-iap';
import { useEffect, useRef, useState } from 'react';
import { isNullOrEmpty, SUBSCRIPTION_IDS } from '../utils';

export type PurchaseSuccessInterface = ProductPurchase & ProductPurchaseAndroid & ProductPurchaseIos;

export const useInAppPurchase = (
  onPurchaseSuccess: (purchase: PurchaseSuccessInterface) => void,
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
        // const subs = await getSubscriptions(SUBSCRIPTION_IDS);
        const subs = await requestProducts({
          skus: SUBSCRIPTION_IDS,
          type: 'subs'
        });
        setSubscriptions(subs as SubscriptionProduct[]);
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
