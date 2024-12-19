"use client";

import { useSupabase } from "@/providers/supabase-provider";
import { WorkspaceResponse } from "@/interfaces/workspace";

export function workspaceService() {
  const supabase = useSupabase();

  const createWorkspace = async (
    userId: string,
    workspaceName: string
  ): Promise<WorkspaceResponse> => {
    try {
      // Insert new workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from("workspace")
        .insert([
          {
            name: workspaceName,
            owner_id: userId,
          },
        ])
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      // Update user's active workspace
      const { error: profileError } = await supabase
        .from("profile")
        .update({ active_workspace: workspace.workspace_id })
        .eq("user_id", userId);

      if (profileError) throw profileError;

      return {
        success: true,
        workspace,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while creating the workspace",
      };
    }
  };

  return {
    createWorkspace,
  };
}
