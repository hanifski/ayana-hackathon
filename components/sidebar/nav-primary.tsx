"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { MessageSquare, BotMessageSquare } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavPrimaryProps
  extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items?: NavItem[];
}

export function NavPrimary({ items, ...props }: NavPrimaryProps) {
  const pathname = usePathname();

  const data = {
    navList: [
      {
        title: "Chat",
        url: "/d/chat",
        icon: MessageSquare,
      },
      {
        title: "Explore Agents",
        url: "/d/agents",
        icon: BotMessageSquare,
      },
    ],
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.navList.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  prefetch={true}
                  className={`flex items-center px-3 py-1.5 h-fit rounded-lg hover:bg-neutral-200 transition-colors ${
                    pathname === item.url
                      ? "bg-neutral-200 bg-opacity-50 hover:bg-opacity-100 text-foreground"
                      : "text-neutral-600"
                  }`}
                >
                  <item.icon className="size-6" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
