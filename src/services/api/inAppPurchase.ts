import api from '.';
import { ENDPOINTS } from './config';

export interface InAppPurchaseResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface InAppPurchasePayload {
  platform: string;
  subscriptionId: string;
  transactionId: string;
  purchaseToken: string;
  receipt: string;
}

export const inAppPurchaseApi = {
  // POST /api/in-app-purchase
  submitPurchase: async (payload: InAppPurchasePayload): Promise<any> => {
    try {
      return await api.post<any>(ENDPOINTS.USERS.IN_APP_PURCHASE, payload);
    } catch (error) {
      console.error('In-app purchase API error:', error);
      throw error;
    }
  },

  restorePurchase: async (): Promise<any> => {
    try {
      return await api.get<any>(ENDPOINTS.USERS.RESTORE_PURCHASE);
    } catch (error) {
      console.error('Restore purchase API error:', error);
      throw error;
    }
  },
};