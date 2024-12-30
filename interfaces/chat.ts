export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelId?: string;
  createdAt: Date;
}

export interface ModelInterface {
  value: string;
  label: string;
  description?: string;
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
  models: ModelInterface[];
}
