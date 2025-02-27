"use server";

import { createClient } from "./client-server";
import { LoginInput, SignUpInput } from "../validations/auth";

export async function loginWithPassword(input: LoginInput) {
  const supabase = await createClient();

  // Log the user in
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword(input);
  // Throw error if login fails
  if (authError) throw authError;
  // Throw error for edge cases
  if (!authData.user) throw new Error("Login failed unexpectedly.");
  // Return the logged in user
  return authData.user;
}

export async function logout() {
  const supabase = await createClient();

  // Log the user out
  const { error: logoutError } = await supabase.auth.signOut();
  // Throw error if logout fails
  if (logoutError) throw logoutError;
  return null;
}


export async function _getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log(error);
    return { data: null, error: error };
  }
  return { data: data.user, error: null };
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  return userData.user;
}

export async function signUpWithEmail(input: SignUpInput) {
  const supabase = await createClient();

  // Step 1: Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });
  // Throw error if signup fails
  if (authError) throw authError;
  // Throw error for edge cases
  if (!authData.user) throw new Error("Signup failed unexpectedly.");

  // Step 2: Create the user's profile
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      name: input.name,
      user_id: authData.user.id, // Link profile to the auth user
    });
  // Throw error if profile creation fails
  if (profileError) throw profileError; 
  // Return the created user

  // Step 3: Create the workspace
  const { data: workspaceData, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      name: input.email,
      owner_id: authData.user.id, // Link workspace to the auth user
    })
    .select()
    .single();
  // Throw error if workspace creation fails
  if (workspaceError) throw workspaceError;
  if (!workspaceData) throw new Error("Workspace creation failed unexpectedly.");

  const { data: memberData, error: memberError } = await supabase
    .from("members")
    .insert({
      workspace_id: workspaceData.id,
      user_id: authData.user.id,
      status: "accepted",
      role: "owner",
    })
    .select()
    .single();
  // Throw error if member creation fails
  if (memberError) throw memberError;
  if (!memberData) throw new Error("Member creation failed unexpectedly.");

  return authData.user; 
}