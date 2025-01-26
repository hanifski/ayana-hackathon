import * as z from "zod";

// Workspace Schema
export const workspaceSchema = z.object({
  name: z
    .string()
    .min(5, "Workspace name must be at least 5 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Workspace name can only contain lowercase letters, numbers, and hyphens"
    )
    .refine(
      (name) => !name.startsWith('-') && !name.endsWith('-'),
      "Workspace name cannot start or end with a hyphen"
    )
    .refine(
      (name) => !name.includes('--'),
      "Workspace name cannot contain consecutive hyphens"
    ),
});

export type WorkspaceInput = z.infer<typeof workspaceSchema>;
