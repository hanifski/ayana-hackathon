"use client";

import { createClient } from "@/lib/supabase/client-browser";
import { Profile } from "@/interfaces/profile";

const supabase = createClient();

export function profileService() {
  const getProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (error) {
        throw error;
      }
      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching profile",
      };
    }
  };

  const update = async (userId: string, data: Partial<Profile>) => {
    try {
      const { data: profile, error } = await supabase
        .from("profile")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while updating profile",
      };
    }
  };

  return {
    getProfile,
    update,
  };
}
