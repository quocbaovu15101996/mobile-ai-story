import api, { ApiResponse } from "..";
import { ENDPOINTS } from "../config";

export const getUserProfile = async () => {
  return await api.get<UserProfile>(
    ENDPOINTS.USERS.PROFILE
  ) as unknown as ApiResponse<UserProfile>;
};

export const rollCall = async () => {
  return await api.post<any>(
    ENDPOINTS.USERS.ROLL_CALL
  ) as unknown as ApiResponse<any>;
};

export const earnTokenByAds = async () => {
  return await api.post<any>(
    ENDPOINTS.USERS.EARN_TOKEN_BY_ADS
  ) as unknown as ApiResponse<any>;
};