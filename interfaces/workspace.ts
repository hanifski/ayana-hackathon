export interface Workspace {
  created_at: string;
  id: string;
  name: string;
  owner_id: string;
}

export interface Member {
  created_at: string;
  user_id: string;
  workspace_id: string;
  role: string;
  status: string;
}
