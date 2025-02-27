import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client-browser";

import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

// Navigation Components
import { NavConversations } from "@/components/sidebar/nav-conversations";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { Assistant } from "@/types/supabase";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavPrimary } from "@/components/sidebar/nav-primary";

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

  conversations: [
    {
      id: "1",
      title: "Project Planning",
      url: "/chat/project-planning",
      lastMessage: "Let's discuss the next steps",
      timestamp: "",
    },
  ],
};

export async function AppSidebar() {
  // Fetch assistants data from Supabase
  const supabase = createClient();
  const { data: assistantsData } = await supabase
    .from("assistants")
    .select("*")
    .limit(100);

  const typedAssistants = assistantsData as Assistant[];

  return (
    <>
      {" "}
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="p-2 text-lg font-semibold">
            {" "}
            <h2 className="font-medium text-base text-teal-700">Etalas.ai</h2>
          </div>
          {/* <TeamSwitcher teams={data.teams} /> */}
        </SidebarHeader>
        <SidebarContent>
          <NavPrimary />
          <NavProjects assistants={typedAssistants} />
          <NavConversations conversations={data.conversations} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
