"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { profileService } from "@/lib/supabase/profile";

import { useAuth } from "@/hooks/use-auth";
import { useSupabase } from "@/hooks/use-supabase";
import { Profile } from "@/types/supabase";

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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const { getCurrentUser } = useAuth();
  const { data: myProfile } = useSupabase<Profile>("profiles");

  console.log("myProfile", myProfile?.[0].name);

  // Function to fetch user data
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await getCurrentUser();
      if (userData && userData.user) {
        const newUserData: UserData = {
          id: userData.user.id,
          email: userData.user.email || "",
          name: myProfile?.[0].name || "",
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
