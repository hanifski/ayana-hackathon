"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Settings,
  Handshake,
  MessageSquare,
  BotMessageSquare,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavConversations } from "@/components/sidebar/nav-conversations";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { useUser } from "@/providers/user-provider";
import { UserContextInterface } from "@/interfaces/user";

// This is sample data.
const data = {
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
  projects: [
    {
      id: "1",
      name: "Project Planning",
      url: "/chat/project-planning",
    },
  ],
  conversations: [
    {
      id: "1",
      title: "Project Planning",
      url: "/chat/project-planning",
      lastMessage: "Let's discuss the next steps",
      timestamp: "",
    },
    {
      id: "2",
      title: "Code Review",
      url: "/chat/code-review",
      lastMessage: "Can you check this PR?",
      timestamp: "",
    },
    {
      id: "3",
      title: "Bug Discussion",
      url: "/chat/bug-discussion",
      lastMessage: "I found a critical issue",
      timestamp: "",
    },
  ],
  navSecondary: [
    {
      title: "Chat",
      url: "/d/chat",
      icon: MessageSquare,
    },
    {
      title: "Assistant",
      url: "/d/assistant",
      icon: BotMessageSquare,
    },
  ],
};

export function AppSidebar() {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="p-2 text-lg font-semibold">
          {" "}
          <h2 className="font-medium text-base text-teal-700">Etalas.ai</h2>
        </div>

        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} />
        <NavProjects projects={data.projects} />
        <NavConversations conversations={data.conversations} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar_url,
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
