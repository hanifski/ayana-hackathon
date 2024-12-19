"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button
        onClick={() => router.push("/dashboard")}
        variant="default"
        size="lg"
      >
        Get Started
      </Button>
    </div>
  );
}
