"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Settings,
  Handshake,
  MessageSquare,
  BotMessageSquare,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavConversations } from "@/components/nav-conversations";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSecondary } from "@/components/nav-secondary";
import { getProfile } from "@/lib/supabase/profile";
import { Profile } from "@/interfaces/profile";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  conversations: [
    {
      id: "1",
      title: "Project Planning",
      url: "/chat/project-planning",
      lastMessage: "Let's discuss the next steps",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Code Review",
      url: "/chat/code-review",
      lastMessage: "Can you check this PR?",
      timestamp: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Bug Discussion",
      url: "/chat/bug-discussion",
      lastMessage: "I found a critical issue",
      timestamp: new Date().toISOString(),
    },
  ],
  navSecondary: [
    {
      title: "Chat",
      url: "/dashboard/chat",
      icon: MessageSquare,
    },
    {
      title: "Assistant",
      url: "/dashboard/assistant",
      icon: BotMessageSquare,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="p-2 text-lg font-semibold">
          {" "}
          <h2>Etalas.ai</h2>
        </div>

        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} />
        <NavConversations conversations={data.conversations} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: `asd`,
            email: `asd@gmail.com`,
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
