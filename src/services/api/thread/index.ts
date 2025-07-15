import api, { ApiResponse } from "..";
import { ENDPOINTS } from "../config";

export const getHistory = async (): Promise<ApiResponse<ThreadsResponse>> => {
  return await api.get<ThreadsResponse>(ENDPOINTS.THREAD.GET_HISTORY);
};