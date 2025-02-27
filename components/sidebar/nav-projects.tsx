"use client";

import { useState } from "react";
import Link from "next/link";

// Components
import { NewProjectModal } from "../chat/create-project-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Folder, Forward, MoreHorizontal, Trash2, Plus } from "lucide-react";

// Validations
import { Assistant } from "@/types/supabase";

interface NavProjectsProps {
  assistants: Assistant[];
}

export function NavProjects({ assistants }: NavProjectsProps) {
  const { isMobile } = useSidebar();
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem onClick={() => setNewProjectModalOpen(true)}>
          <SidebarMenuButton asChild>
            <div>
              <Plus className=" h-4 w-4" />
              <p>New Project</p>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {assistants && (
          <div className="max-h-80 overflow-auto">
            {assistants.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/d/project/${item.id}`}>
                    <span className="font-normal">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </div>
        )}

        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
      />
    </SidebarGroup>
  );
}
