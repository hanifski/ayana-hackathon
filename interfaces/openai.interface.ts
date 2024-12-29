export interface FileUpload {
  file_url: string;
  file_name: string;
  file_type: string;
}

export interface VectorCreate {
  name: string;
  file_ids: string[];
}

export interface VectorUpdate {
  vector_store_id: string;
  file_ids: string[];
}

export interface AssistantCreate {
  name: string;
  instructions: string;
  vector_store_id: string[];
}
