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
  offerToken?: string;
  receipt: string;
}

export const inAppPurchaseApi = {
  // POST /api/in-app-purchase
  submitPurchase: async (payload: InAppPurchasePayload): Promise<InAppPurchaseResponse> => {
    try {
      const response = await api.post<InAppPurchaseResponse>(ENDPOINTS.USERS.IN_APP_PURCHASE, payload);
      return response.data;
    } catch (error) {
      console.error('In-app purchase API error:', error);
      throw error;
    }
  },
};