"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { WorkspaceChecker } from "@/components/workspace-checker";
import SupabaseProvider from "@/providers/supabase-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient();

  return (
    <SupabaseProvider>
      <WorkspaceChecker>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main className="flex flex-1 flex-col">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </WorkspaceChecker>
    </SupabaseProvider>
  );
}
