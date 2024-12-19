export interface Workspace {
  id: string;
  created_at: string;
  name: string;
  owner_id: string;
}

export interface WorkspaceResponse {
  success: boolean;
  workspace?: Workspace;
  error?: string;
}
