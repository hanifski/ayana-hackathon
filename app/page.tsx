"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/auth");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button onClick={handleRedirect} variant="default" size="lg">
        Get Started
      </Button>
    </div>
  );
}
