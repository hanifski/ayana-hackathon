export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
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
