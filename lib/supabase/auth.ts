"use server";

import { createClient } from "./client-server";
import { LoginInput, SignUpInput } from "../validations/auth";

export async function _loginWithPassword(input: LoginInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(input);

  if (error) {
    console.log(error);
  }
  return data;
}

export async function _logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
  }
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

export async function _signUpWithEmail(input: SignUpInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(input);

  if (error) {
    console.log(error);
  }
  return data;
}
