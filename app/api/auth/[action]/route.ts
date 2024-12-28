import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client-server";
import {
  LoginInput,
  SignUpInput,
  ResetPasswordInput,
} from "@/lib/validations/auth";

export async function POST(
  request: NextRequest,
  context: { params: { action: string } }
) {
  const supabase = await createClient();
  const { action } = await context.params;

  // Get data sent from the form
  const formData = await request.json();

  try {
    switch (action) {
      case "login":
        return await handleLogin(supabase, formData);
      case "signup":
        return await handleSignup(supabase, formData);
      case "reset-password":
        return await handleResetPassword(supabase, formData);
      case "logout":
        return await handleLogout(supabase);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    // Handle any errors that occur during the request
    console.error(error);
    return NextResponse.json(
      { message: error },
      { status: error.status || 500 }
    );
  }
}

async function handleLogin(supabase: any, { email, password }: LoginInput) {
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) throw new Error("Login failed");
  return NextResponse.json({ message: "Login successful" });
}

async function handleSignup(
  supabase: any,
  { name, email, password }: SignUpInput
) {
  const { data: signUpData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) throw new Error("Signup failed");

  if (signUpData.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: signUpData.user.id,
      name: name,
    });

    if (profileError) throw new Error("Profile creation failed");
  }

  return NextResponse.json({ message: "Signup successful" });
}

async function handleResetPassword(
  supabase: any,
  { email }: ResetPasswordInput
) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });

  if (error) throw new Error("Password reset failed");
  return NextResponse.json({ message: "Password reset email sent" });
}

async function handleLogout(supabase: any) {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Logout failed");
  return NextResponse.json({ message: "Logout successful" });
}

// This is a catch-all route that returns a 405 error for all other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
