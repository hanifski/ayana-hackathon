"use client";

import { useSupabase } from "@/providers/supabase-provider";
import { Profile } from "@/interfaces/profile";

export function profileService() {
  const supabase = useSupabase();

  const create = async (uuid: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profile")
        .insert([{ id: uuid }])
        .select()
        .single();

      if (error) throw error;

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
            : "An error occurred while creating profile",
      };
    }
  };

  const get = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", userId)
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
    create,
    get,
    update,
  };
}
