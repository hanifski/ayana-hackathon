"use client";

// React & Hooks
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signUpWithEmail } from "@/lib/supabase/auth";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Validations
import { signUpSchema, SignUpInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Function for handling sign up
  const handleSignUp = async (input: SignUpInput) => {
    // Loading starts
    setLoading(true);
    try {
      // Sign user up
      await signUpWithEmail(input);
      // Redirect to dashboard
      router.push("/d/chat");
    } catch (err: any) {
      // Show error toast
      toast.error(err.message || "Sign up failed.");
    } finally {
      // Loading ends
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-3xl font-semibold text-center mb-4">Sign up</h2>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
        <Input
          {...form.register("name")}
          type="text"
          placeholder="Full Name"
          disabled={loading}
          className="h-12 md:text-base"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
        <Input
          {...form.register("email")}
          type="email"
          placeholder="Full Name"
          disabled={loading}
          className="h-12 md:text-base"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
        <Input
          {...form.register("password")}
          type="password"
          placeholder="Password"
          disabled={loading}
          className="h-12 md:text-base"
        />

        {form.formState.errors.password && (
          <p className="text-sm font-medium text-destructive mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
        <Button
          className="w-full h-12 md:text-lg"
          type="submit"
          disabled={loading}
          loading={loading}
        >
          {loading ? "Get ready..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
