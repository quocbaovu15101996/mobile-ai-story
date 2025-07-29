import api, { ApiResponse } from "..";
import { ENDPOINTS } from "../config";
import { CreateThreadPayload, CreateThreadResponse, ExpandThreadPayload, MessageItem, MessageResponse, Thread, ThreadsResponse } from "../types";

export const getHistory = async (page: number = 0, size: number = 10): Promise<ApiResponse<ThreadsResponse>> => {
  return await api.get<ThreadsResponse>(`${ENDPOINTS.THREAD.URL}?page=${page}&size=${size}`);
};

export const getThreadDetail = async (threadId: string): Promise<ApiResponse<Thread>> => {
  return await api.get<Thread>(`${ENDPOINTS.THREAD.URL}/${threadId}`);
};

export const getThreadMessages = async (threadId: string): Promise<ApiResponse<MessageItem[]>> => {
  return await api.get<MessageItem[]>(`${ENDPOINTS.THREAD.URL}/${threadId}/messages`);
};
export const createThread = async (payload: CreateThreadPayload): Promise<ApiResponse<CreateThreadResponse>> => {
  return await api.post<CreateThreadResponse>(ENDPOINTS.THREAD.URL, payload);
};

export const createARunThread = async (threadId: string): Promise<ApiResponse<MessageResponse>> => {
  return await api.post<MessageResponse>(ENDPOINTS.THREAD.URL + '/' + threadId + ENDPOINTS.THREAD.RUNS);
};

export const continueThread = async (threadId: string): Promise<ApiResponse<MessageResponse>> => {
  return await api.post<MessageResponse>(ENDPOINTS.THREAD.URL + '/' + threadId + ENDPOINTS.THREAD.CONTINUE);
};

export const expandThread = async (threadId: string, payload: ExpandThreadPayload): Promise<ApiResponse<MessageResponse>> => {
  return await api.post<MessageResponse>(ENDPOINTS.THREAD.URL + '/' + threadId + ENDPOINTS.THREAD.EXPAND, payload);
};