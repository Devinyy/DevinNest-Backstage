import { request } from '../utils/request';

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
}

export interface ChatCompletionResponse {
  id: string;
  choices: any[];
  created: number;
  model: string;
}

export const chatCompletion = (data: ChatCompletionRequest) => {
  return request.post<ChatCompletionResponse>('/v1/ai/chat', data);
};
