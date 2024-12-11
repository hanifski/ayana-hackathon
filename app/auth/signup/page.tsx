"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Simple redirect without authentication
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000); // Added small delay to show loading state
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-3xl font-semibold text-center mb-4">Sign up</div>
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <Input
            className="h-12 text-base"
            id="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            className="h-12 text-base"
            required
          />
        </div>
        <div className="flex flex-col space-y-4 mt-4">
          <Button
            className="w-full h-12 text-base"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
