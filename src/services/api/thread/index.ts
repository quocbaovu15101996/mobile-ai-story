import api, { ApiResponse } from "..";
import { ENDPOINTS } from "../config";

export const getHistory = async (): Promise<ApiResponse<ThreadsResponse>> => {
  return await api.get<ThreadsResponse>(ENDPOINTS.THREAD.GET_HISTORY);
};

export const createThread = async (payload: CreateThreadPayload): Promise<ApiResponse<any>> => {
  return await api.post<any>('/v1/thread', payload);
};