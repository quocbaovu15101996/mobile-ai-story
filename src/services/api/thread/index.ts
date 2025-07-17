import api, { ApiResponse } from "..";
import { ENDPOINTS } from "../config";
import { ThreadsResponse, CreateThreadPayload, CreateThreadResponse, Thread } from "../types";

export const getHistory = async (): Promise<ApiResponse<ThreadsResponse>> => {
  return await api.get<ThreadsResponse>(ENDPOINTS.THREAD.GET_HISTORY);
};

export const getThreadDetail = async (threadId: string): Promise<ApiResponse<Thread>> => {
  return await api.get<Thread>(`${ENDPOINTS.THREAD.GET_DETAIL}/${threadId}`);
};

export const createThread = async (payload: CreateThreadPayload): Promise<ApiResponse<CreateThreadResponse>> => {
  return await api.post<CreateThreadResponse>('/v1/thread', payload);
};