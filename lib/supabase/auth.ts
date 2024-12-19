import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LoginInput, SignUpInput } from "@/lib/validations/auth";

export async function login({ email, password }: LoginInput) {
  const supabase = createClientComponentClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred during login",
    };
  }
}

export async function logout() {
  const supabase = createClientComponentClient();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred during logout",
    };
  }
}

export async function signUp({ email, password, name }: SignUpInput) {
  const supabase = createClientComponentClient();

  try {
    // Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return { success: false, error: signUpError.message };
    }

    if (!data.user) {
      return { success: false, error: "User data is not available" };
    }

    // Insert profile data into the profile table
    const { error: profileError } = await supabase.from("profile").insert([
      {
        user_id: data.user.id,
        name: name,
      },
    ]);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred during signup",
    };
  }
}
