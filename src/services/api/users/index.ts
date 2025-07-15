import api, { ApiResponse } from "..";
import { ENDPOINTS } from "../config";

export const getUserProfile = async () => {
  return await api.get<UserProfile>(
    ENDPOINTS.USERS.PROFILE
  ) as unknown as ApiResponse<UserProfile>;
};