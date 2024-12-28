"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth2";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await useAuth().logout();
      router.push("/auth");
    };
    logout();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-muted-foreground">Signing out...</p>
    </div>
  );
}
