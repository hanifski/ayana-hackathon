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
  const [showWorkspaceSwitcher, setShowWorkspaceSwitcher] = useState(false);
  const { getList: workspaces } = useSupabase<Workspace>("workspaces");
  const { getList: members } = useSupabase<Member>("members");

  useEffect(() => {
    if (!user) return;
    getAllWorkspaces();
  }, [user]);

  async function getAllWorkspaces() {
    if (!user) return;
    try {
      // Get all this user's members
      const membersResult = await members({
        filters: [{ column: "user_id", operator: "eq", value: user.id }],
      });
      // Extract member ids
      const listOfIds =
        membersResult?.data?.map((member: Member) => member.workspace_id) || [];
      // Get all workspaces that this user is a member of
      const workspaceResults = await workspaces({
        filters: [{ column: "id", operator: "in", value: listOfIds }],
      });
      // Set all workspaces to state
      const workspacesData = workspaceResults?.data || [];
      setUserWorkspaces(workspacesData);
      // Get the active workspace
      const selectedWorkspace = workspacesData.find(
        (workspace) => workspace.id === user.active_workspace
      );
      // If the user has an active workspace, set the active workspace
      if (selectedWorkspace) {
        setActiveWorkspace(selectedWorkspace);
      }
    } catch (error) {
      toast.error("Error fetching workspaces");
    } finally {
      setShowWorkspaceSwitcher(true);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {showWorkspaceSwitcher && (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={activeWorkspace.avatar}
                    alt={activeWorkspace.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {activeWorkspace.name?.[0]?.toUpperCase() ?? ""}
                  </AvatarFallback>
                </Avatar>
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
