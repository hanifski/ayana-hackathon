import * as z from "zod";

// Workspace Schema
export const workspaceSchema = z.object({
  name: z.string().min(5, "Workspace name must be at least 3 characters"),
});

export type WorkspaceInput = z.infer<typeof workspaceSchema>;
