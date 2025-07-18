import api, { ApiResponse } from "..";
import { ENDPOINTS } from "../config";
import { ThreadsResponse, CreateThreadPayload, CreateThreadResponse, Thread } from "../types";

export const getHistory = async (): Promise<ApiResponse<ThreadsResponse>> => {
  return await api.get<ThreadsResponse>(ENDPOINTS.THREADS);
};

export const getThreadDetail = async (threadId: string): Promise<ApiResponse<Thread>> => {
  return await api.get<Thread>(`${ENDPOINTS.THREADS}/${threadId}`);
};

export const createThread = async (payload: CreateThreadPayload): Promise<ApiResponse<CreateThreadResponse>> => {
  return await api.post<CreateThreadResponse>(ENDPOINTS.THREADS, payload);
};