export type Profile = {
  id: string;
  user_id: string;
  name: string | null;
  active_workspace: string | null;
  avatar_url: string | null;
};

export type Assistant = {
  id: string;
  name: string;
  model: string;
  description: string;
  created_at: number;
  file_ids: string[];
  workspace_id: string;
};
