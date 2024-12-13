export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelId?: string;
  createdAt: Date;
}

export interface ChatModel {
  id: string;
  name: string;
  description: string;
  provider: "openai" | "anthropic";
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export interface ChatProvider {
  id: string;
  name: string;
  models: ChatModel[];
}
