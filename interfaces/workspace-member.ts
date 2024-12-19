export type WorkspaceRole = "owner" | "member";
export type WorkspaceMemberStatus = "pending" | "accepted";

export interface WorkspaceMember {
  user_id: string;
  workspace_id: string;
  created_at: string;
  role: WorkspaceRole;
  status: WorkspaceMemberStatus;
}
