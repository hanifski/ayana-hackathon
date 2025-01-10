"use client";

import { useEffect } from "react";
import { useUser } from "@/providers/user-provider";

export default function DashboardPage() {
  const { refetchUser } = useUser();

  useEffect(() => {
    refetchUser();
  }, []);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
  );
}
