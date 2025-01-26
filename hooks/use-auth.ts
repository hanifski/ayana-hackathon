// React, Next & Hooks
import { useState } from "react";
import {

  _getCurrentUser,

} from "@/lib/supabase/auth";

// Components
import { toast } from "sonner";

// Interfaces & Types
import { LoginInput, SignUpInput } from "@/lib/validations/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);





  async function getCurrentUser() {
    setLoading(true);
    setError(null);
    try {
      const output = await _getCurrentUser();
      return output;
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error.message || "Failed to get current user.");
      return null;
    } finally {
      setLoading(false);
    }
  }



  return {
    getCurrentUser,
    loading,
    error,
  };
}
