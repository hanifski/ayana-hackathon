import { z } from "zod";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/json",
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
        size: z.number().max(MAX_FILE_SIZE, "Max file size is 20MB"),
        type: z.string().refine((val) => ACCEPTED_FILE_TYPES.includes(val), {
          message: "Invalid file type. Supported: PDF, TXT, MD, JSON",
        }),
      })
    )
    .optional(),
});

export type CreateAssistantForm = z.infer<typeof createAssistantSchema>;

export interface FileUpload {
  name: string;
  size: number;
  type: string;
  url?: string;
}
