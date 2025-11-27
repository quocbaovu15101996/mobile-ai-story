import api, { ApiResponse } from '..';
import { ENDPOINTS } from '../config';

export const getHistory = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<ThreadsResponse>> => {
  return await api.get<ThreadsResponse>(
    `${ENDPOINTS.THREAD.URL}?page=${page}&size=${size}`
  );
};

export const getThreadDetail = async (
  threadId: string
): Promise<ApiResponse<Thread>> => {
  return await api.get<Thread>(`${ENDPOINTS.THREAD.URL}/${threadId}`);
};

export const getThreadMessages = async (
  threadId: string
): Promise<ApiResponse<MessageItemInterface[]>> => {
  return await api.get<MessageItemInterface[]>(
    `${ENDPOINTS.THREAD.URL}/${threadId}/messages`
  );
};
export const createThread = async (
  payload: CreateThreadPayload
): Promise<ApiResponse<CreateThreadResponse>> => {
  return await api.post<CreateThreadResponse>(ENDPOINTS.THREAD.URL, payload);
};

export const createARunThread = async (
  threadId: string
): Promise<ApiResponse<MessageResponse>> => {
  return await api.post<MessageResponse>(
    ENDPOINTS.THREAD.URL + '/' + threadId + ENDPOINTS.THREAD.RUNS
  );
};

export const continueThread = async (
  threadId: string
): Promise<ApiResponse<MessageResponse>> => {
  return await api.post<MessageResponse>(
    ENDPOINTS.THREAD.URL + '/' + threadId + ENDPOINTS.THREAD.CONTINUE
  );
};

export const expandThread = async (
  threadId: string,
  payload: ExpandThreadPayload
): Promise<ApiResponse<MessageResponse>> => {
  return await api.post<MessageResponse>(
    ENDPOINTS.THREAD.URL + '/' + threadId + ENDPOINTS.THREAD.EXPAND,
    payload
  );
};

export const eraseLastMessage = async (
  threadId: string
): Promise<ApiResponse<boolean>> => {
  return await api.delete<boolean>(
    ENDPOINTS.THREAD.URL + '/' + threadId + ENDPOINTS.THREAD.ERASE
  );
};

export const rewriteLastMessage = async (
  threadId: string
): Promise<ApiResponse<MessageResponse>> => {
  return await api.post<MessageResponse>(
    ENDPOINTS.THREAD.URL + '/' + threadId + ENDPOINTS.THREAD.REWRITE
  );
};

export const deleteThread = async (
  threadId: string
): Promise<ApiResponse<boolean>> => {
  return await api.delete<boolean>(`${ENDPOINTS.THREAD.URL}/${threadId}`);
};

export const generateIdea = async (): Promise<
  ApiResponse<GenerateIdeaResponse>
> => {
  return await api.post<GenerateIdeaResponse>(
    ENDPOINTS.THREAD.URL + ENDPOINTS.THREAD.GENERATE_IDEA
  );
};
