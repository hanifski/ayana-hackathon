"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AuthPage() {
  // const { login, loginLoading } = useAuth();
  const router = useRouter();
  const { loginWithPassword, loading } = useAuth();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginInput) => {
    const loginSuccess = await loginWithPassword(data);
    if (loginSuccess) {
      router.push("/d");
    } else {
      toast.error("Login failed, please try again.");
    }
  };

  return (
    <>
      <div className="w-full max-w-sm">
        <div className="text-3xl font-semibold text-center mb-4">Log in</div>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-1">
            <Input
              {...form.register("email")}
              type="email"
              placeholder="Email"
              disabled={loading}
              className="h-12"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Input
              {...form.register("password")}
              type="password"
              placeholder="Password"
              disabled={loading}
              {...form.register("password")}
              className="h-12"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button
            className="w-full h-12 text-base"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </div>
    </>
  );
}
