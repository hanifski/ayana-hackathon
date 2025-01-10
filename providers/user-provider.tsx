"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useSupabase } from "@/hooks/use-supabase";
import { Profile } from "@/types/supabase";
import { toast } from "sonner";

// Define the shape of our user data
interface UserData {
  id: string;
  profile_id: string;
  email: string;
  name: string;
  avatar_url: string;
  active_workspace: string;
}

// Define what our context will provide
interface UserContextInterface {
  user: UserData | null;
  isLoading: boolean;
  updateUser: (newData: Partial<UserData>) => void;
  refetchUser: () => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextInterface | undefined>(undefined);

// Create the provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const { getCurrentUser } = useAuth();
  const { getList: getProfiles } = useSupabase<Profile>("profiles");

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    console.log({ user });
  }, [user]);

  const fetchUser = async () => {
    setIsLoading(true);
    setUser(null);
    // Fetch the current user
    const userResult = await getCurrentUser();
    if (userResult) {
      // Fetch the user profile (returns as an array)
      const profileResult = await getProfiles();
      if (userResult.data && profileResult && profileResult.data) {
        console.log({ userResult, profileResult });
        // Get the first item from the array
        const userProfile = profileResult.data[0];
        setUser({
          id: userResult.data.id || "",
          profile_id: userProfile.id || "",
          email: userResult.data.email || "",
          name: userProfile.name || "",
          avatar_url: userProfile.avatar_url || "",
          active_workspace: userProfile.active_workspace || "",
        });
      }
    }
    setIsLoading(false);
  };

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
  const contextValue: UserContextInterface = {
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
