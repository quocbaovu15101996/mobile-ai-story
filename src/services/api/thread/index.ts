import api, { ApiResponse } from "..";
import { ENDPOINTS, ThreadsResponse } from "../config";

export const getHistory = async (): Promise<ApiResponse<ThreadsResponse>> => {
  return await api.get<ThreadsResponse>(ENDPOINTS.THREAD.GET_HISTORY);
};