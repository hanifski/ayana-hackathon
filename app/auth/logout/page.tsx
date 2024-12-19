"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LogoutPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const signOut = async () => {
      try {
        await supabase.auth.signOut();
        router.push("/auth");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

    signOut();
  }, [router, supabase.auth]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-muted-foreground">Signing out...</p>
    </div>
  );
}
