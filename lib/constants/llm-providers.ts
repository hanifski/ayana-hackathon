import { LLMProvider, LLMModel } from "@/interfaces/llm-provider";

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    avatarUrl: "/avatars/anthropic.svg",
    models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
  },
  {
    id: "openai",
    name: "OpenAI",
    avatarUrl: "/avatars/openai.svg",
    models: ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
  },
  {
    id: "mistral",
    name: "Mistral AI",
    avatarUrl: "/avatars/mistral.svg",
    models: ["mistral-large", "mistral-medium", "mistral-small"],
  },
];

export const LLM_MODELS: LLMModel[] = [
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    providerId: "anthropic",
    maxTokens: 200000,
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    providerId: "anthropic",
    maxTokens: 200000,
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    providerId: "openai",
    maxTokens: 128000,
  },
  // Add other models as needed
];

export function getProviderById(providerId: string): LLMProvider | undefined {
  return LLM_PROVIDERS.find((provider) => provider.id === providerId);
}

export function getModelById(modelId: string): LLMModel | undefined {
  return LLM_MODELS.find((model) => model.id === modelId);
}
