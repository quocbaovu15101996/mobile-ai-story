import api from './client';
import { InAppPurchasePayload } from '../inAppPurchase';

export interface InAppPurchaseResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const inAppPurchaseApi = {
  // POST /api/in-app-purchase
  submitPurchase: async (payload: InAppPurchasePayload): Promise<InAppPurchaseResponse> => {
    try {
      const response = await api.post<InAppPurchaseResponse>('/api/in-app-purchase', payload);
      return response.data;
    } catch (error) {
      console.error('In-app purchase API error:', error);
      throw error;
    }
  },
};