//DEPRECATED

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

// Custom Zod type for File objects
const FileSchema = z.custom<File>((file) => {
  return file instanceof File;
}, "Must be a File object");

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
      FileSchema
    )
    .optional(),
});

export type CreateAssistantInput = z.infer<typeof createAssistantSchema>;
