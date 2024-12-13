export interface LLMProvider {
  id: string;
  name: string;
  avatarUrl: string;
  models: string[];
}

export interface LLMModel {
  id: string;
  name: string;
  providerId: string;
  maxTokens?: number;
}
