import * as z from "zod";

// Chat schema
export const chatSchema = z.object({
  message: z.string().min(3, "Chat must be at least 3 characters"),
});

export type ChatInput = z.infer<typeof chatSchema>;
