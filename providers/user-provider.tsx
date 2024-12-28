"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { profileService } from "@/lib/supabase/profile";
import { userService } from "@/lib/supabase/user";
import { useAuth } from "@/hooks/use-auth2";

// Define the shape of our user data
interface UserData {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  active_workspace: string;
}

// Define what our context will provide
interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  updateUser: (newData: Partial<UserData>) => void;
  refetchUser: () => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getCurrentUser } = useAuth();

  // const { getCurrentUser } = userService();
  const { getProfile } = profileService();

  // Function to fetch user data
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await getCurrentUser();
      if (userData && userData.user) {
        const newUserData: UserData = {
          id: userData.user.id,
          email: userData.user.email || "",
          name: "",
          avatar_url: "",
          active_workspace: "",
        };
        setUser(newUserData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
    setIsLoading(false);
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  // Function to update user data
  const updateUser = (newData: Partial<UserData>) => {
    setUser((currentUser) => {
      if (currentUser) {
        return { ...currentUser, ...newData };
      }
      return currentUser;
    });
  };

  // Function to refetch user data
  const refetchUser = async () => {
    await fetchUser();
  };

  // Create the context value
  const contextValue: UserContextType = {
    user,
    isLoading,
    updateUser,
    refetchUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
