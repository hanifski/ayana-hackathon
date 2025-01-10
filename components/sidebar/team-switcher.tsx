"use client";

import React, { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { useUser } from "@/providers/user-provider";

import { toast } from "sonner";
import { WorkspaceModal } from "../create-workspace-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, Columns, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Workspace, Member } from "@/interfaces/workspace";

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface TeamSwitcherProps {
  teams: Team[];
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const [showModal, setShowModal] = useState(false);
  const [userWorkspaces, setUserWorkspaces] = useState<Workspace[]>([]);
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(
    {} as Workspace
  );
  const { getList: workspaces } = useSupabase<Workspace>("workspaces");
  const { getList: members } = useSupabase<Member>("members");

  useEffect(() => {
    async function getAllWorkspaces() {
      try {
        const membersResult = await members();

        let listOfIds: string[] = [];
        if (membersResult && membersResult.data) {
          const members = membersResult?.data;
          let listOfIds = members.map((member: Member) => member.workspace_id);
          console.log(listOfIds);
        }

        const workspaceResults = await workspaces({
          filters: [
            {
              column: "id",
              operator: "in",
              value: listOfIds,
            },
          ],
        });
        if (workspaceResults && workspaceResults.data) {
          setUserWorkspaces(workspaceResults.data);
          if (user) {
            const selectedWorkspace = userWorkspaces.find(
              (workspace) => workspace.id === user.active_workspace
            );
            if (selectedWorkspace) {
              setActiveWorkspace(selectedWorkspace);
            }
          }
        }
      } catch (error) {
        toast.error("Error fetching workspaces");
      }
    }
    getAllWorkspaces();
  }, [user, user?.active_workspace]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {userWorkspaces.length > 1 && (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"></div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeWorkspace.name}
                  </span>
                  <span className="truncate text-xs">Free Plan</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {userWorkspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.name}
                onClick={() => setActiveWorkspace(workspace)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={workspace.avatar} alt={workspace.name} />
                    <AvatarFallback className="rounded-lg">
                      {workspace.name?.[0]?.toUpperCase() ?? ""}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {workspace.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowModal(true)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      {showModal === true && (
        <WorkspaceModal onClose={() => setShowModal(false)} />
      )}
    </SidebarMenu>
  );
}
