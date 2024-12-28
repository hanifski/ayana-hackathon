// React, Next & Hooks
import { useState } from "react";
import {
  _loginWithPassword,
  _logout,
  _getCurrentUser,
  _signUpWithEmail,
} from "@/lib/supabase/auth";

// Components
import { toast } from "sonner";

// Interfaces & Types
import { LoginInput, SignUpInput } from "@/lib/validations/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loginWithPassword(input: LoginInput) {
    setLoading(true);
    setError(null);
    try {
      const output = await _loginWithPassword(input);
      return output;
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error.message || "Login failed, please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      const output = await _logout();
      return output;
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error.message || "Logout failed, please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

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

  async function signUp(input: SignUpInput) {
    setLoading(true);
    setError(null);
    try {
      const output = await _signUpWithEmail(input);
      return output;
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error.message || "Sign up failed, please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    loginWithPassword,
    logout,
    getCurrentUser,
    signUp,
    loading,
    error,
  };
}
