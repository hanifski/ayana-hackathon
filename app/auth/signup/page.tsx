"use client";

// React & Next
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

// Components
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Validations
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

// Supabase
import { signUp } from "@/lib/supabase/auth";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handle sign up
  const handleSignUp = async (data: SignUpInput) => {
    setIsLoading(true);
    const result = await signUp(data);

    if (!result.success) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.push(`/dashboard/chat`);
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-3xl font-semibold text-center mb-4">Sign up</h2>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
        <input
          {...form.register("name")}
          type="text"
          className="flex h-12 w-full p-3 rounded-md border border-input box-border outline-transparent focus:outline-primary bg-background transition-all duration-200 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Full Name"
          disabled={isLoading}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
        <input
          {...form.register("email")}
          type="email"
          className="flex h-12 w-full p-3 rounded-md border border-input box-border outline-transparent focus:outline-primary bg-background transition-all duration-200 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Email"
          disabled={isLoading}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
        <input
          {...form.register("password")}
          type="password"
          className="flex h-12 w-full p-3 rounded-md border border-input box-border outline-transparent focus:outline-primary bg-background transition-all duration-200 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Password"
          disabled={isLoading}
        />
        {form.formState.errors.password && (
          <p className="text-sm font-medium text-destructive mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
        <Button
          className="w-full h-12 text-base"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Get ready..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
