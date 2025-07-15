import api, { ApiResponse } from "..";
import { ENDPOINTS } from "../config";

export const loginByDevice = async ({ platform, deviceId }: { platform: string, deviceId: string }) => {
  const payload = {
    platform,
    deviceId,
  };
  return await api.post<LoginResponse>(
    ENDPOINTS.AUTH.LOGIN_BY_DEVICE,
    payload
  ) as unknown as ApiResponse<LoginResponse>;
}