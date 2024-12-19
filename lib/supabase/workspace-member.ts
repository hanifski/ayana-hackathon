"use client";

import { useSupabase } from "@/providers/supabase-provider";

export function workspaceMemberService() {
  const supabase = useSupabase();

  const hasWorkspace = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profile")
        .select("active_workspace")
        .eq("user_id", userId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        hasWorkspace: !!data?.active_workspace,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while checking workspace membership",
      };
    }
  };

  return {
    hasWorkspace,
  };
}
