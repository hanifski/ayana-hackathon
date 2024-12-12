import { z } from "zod";

export const createAssistantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  model: z.enum(["gpt-4-turbo-preview", "gpt-4", "gpt-3.5-turbo"]),
  instructions: z.string().min(1, "Instructions are required"),
  temperature: z.number().min(0).max(1),
  files: z.array(z.any()).optional(),
});

export type CreateAssistantForm = z.infer<typeof createAssistantSchema>;

export interface FileUpload {
  name: string;
  size: number;
  type: string;
  url?: string;
}
