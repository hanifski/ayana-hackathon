import React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {" "}
        {/* <Onboarding /> */}
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
