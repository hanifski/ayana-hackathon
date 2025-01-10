"use client";

// React & Next
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useSupabase } from "@/hooks/use-supabase";
import { useUser } from "@/providers/user-provider";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Validations
import { signUpSchema, SignUpInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpPage() {
  const { signUp, loading } = useAuth();
  const { insert } = useSupabase<any>("profiles");

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

  const handleSignUp = async (input: SignUpInput) => {
    const signUpResult = await signUp(input);
    if (signUpResult && signUpResult.user) {
      await insert({
        name: form.getValues("name"),
        user_id: signUpResult.user.id,
      });
      router.push("/d");
    } else {
      toast.error("Sign up failed, please try again.");
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
          className="h-12"
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
          disabled={loading}
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
          disabled={loading}
        />
        {form.formState.errors.password && (
          <p className="text-sm font-medium text-destructive mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
        <Button
          className="w-full h-12 text-base"
          type="submit"
          disabled={loading}
        >
          {loading ? "Get ready..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
