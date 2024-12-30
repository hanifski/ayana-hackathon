import { ModelInterface } from "./chat";

export interface Assistantx {
  id: string;
  name: ModelInterface;
  model: string;
  instructions: string;
  description?: string;
  created_at?: number;
  tools?: Array<{ type: string }>;
}
