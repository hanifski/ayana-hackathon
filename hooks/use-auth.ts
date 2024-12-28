import { useState } from "react";
import { SignUpInput, LoginInput } from "@/lib/validations/auth";
import { toast } from "sonner";

const useAuth = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const login = async (data: LoginInput) => {
    setLoginLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong, try again.");
      }
      toast.success("Successfully logged in.");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Check your network, try again.");
      return false;
    } finally {
      setLoginLoading(false);
    }
  };

  const signup = async (data: SignUpInput) => {
    setSignupLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong, try again.");
      }
      toast.success("Account created successfully.");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Check your network, try again.");
      return false;
    } finally {
      setSignupLoading(false);
    }
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong, try again.");
      }
      toast.success("Logout successfully.");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Check your network, try again.");
      return false;
    } finally {
      setLogoutLoading(false);
    }
  };

  return {
    login,
    loginLoading,
    signup,
    signupLoading,
    logout,
  };
};

export default useAuth;
