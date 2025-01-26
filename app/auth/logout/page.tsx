"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/supabase/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleLogout() {
      await logout();
      router.push("/auth");
    }
    handleLogout();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-muted-foreground">Signing out...</p>
    </div>
  );
}
