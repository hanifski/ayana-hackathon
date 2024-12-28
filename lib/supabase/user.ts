"use client";

import { createClient } from "@/lib/supabase/supabase-client";

const supabase = createClient();

export function userService() {
  // Define getCurrentUser as a proper async function
  const getCurrentUser = async () => {
    try {
      // Get the current user from Supabase
      const { data, error } = await supabase.auth.getUser();
      // Check if there's an error first
      if (error) {
        throw error;
      }
      // If successful, return the user data
      return {
        success: true,
        data: data.user, // Access user from data object
      };
    } catch (error) {
      // Handle any errors and return a friendly error message
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Couldn't get user data",
      };
    }
  };

  // Return the function so it can be used elsewhere
  return {
    getCurrentUser,
  };
}
