import { z } from "zod";
import { ModelInterface } from "@/interfaces/chat";

export const FILE_CONFIG = {
  maxSize: 20 * 1024 * 1024,
  accept: {
    "application/pdf": [".pdf"],
    "text/plain": [".txt"],
    "text/markdown": [".md"],
    "application/json": [".json"],
  },
  acceptedTypes: [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/json",
  ],
};

export const AVAILABLE_MODELS: ModelInterface[] = [
  {
    value: "gpt-4-turbo-preview",
    label: "GPT-4 Turbo",
    provider: "openai",
  },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", provider: "openai" },
];

export const createAssistantSchema = z.object({
  name: z.string().min(2, {
    message: "Assistant name must be at least 2 characters.",
  }),
  model: z.string({
    required_error: "Please select a model.",
  }),
  instructions: z.string().min(10, {
    message: "Instructions must be at least 10 characters.",
  }),
  temperature: z.number().min(0).max(1),
  files: z
    .array(
      z.object({
        name: z.string(),
        size: z.number().max(FILE_CONFIG.maxSize, "Max file size is 20MB"),
        type: z
          .string()
          .refine((val) => FILE_CONFIG.acceptedTypes.includes(val), {
            message: "Invalid file type. Supported: PDF, TXT, MD, JSON",
          }),
      })
    )
    .optional(),
});

export type CreateAssistantInput = z.infer<typeof createAssistantSchema>;

export interface FileUpload {
  name: string;
  size: number;
  type: string;
  url?: string;
}
