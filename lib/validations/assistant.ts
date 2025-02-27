import * as z from "zod";

export const AVAILABLE_MODELS = [
  {
    value: "gpt-4-turbo-preview",
    label: "GPT-4 Turbo",
    provider: "openai",
  },
  { 
    value: "gpt-3.5-turbo",
    label: "GPT-3.5 Turbo",
    provider: "openai" 
  },
];

export const assistantSchema = z.object({
  name: z.string().min(6, "Name must be at least 6 characters"),
  model: z
    .enum([AVAILABLE_MODELS[0].value, AVAILABLE_MODELS[1].value])
    .default("gpt-4-turbo-preview"),
});

export type AssistantInput = z.infer<typeof assistantSchema>;