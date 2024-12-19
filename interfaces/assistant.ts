export interface Assistant {
  id: string;
  name: string;
  model: string;
  instructions: string;
  description?: string;
  created_at?: number;
  tools?: Array<{ type: string }>;
}
