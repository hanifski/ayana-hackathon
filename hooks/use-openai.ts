import { useState } from "react";

// Lib
import { _createVectorStore, _updateVectorStore } from "@/lib/openai/vector";
import { _uploadFile } from "@/lib/openai/file";
import { _createAssistant } from "@/lib/openai/assistant";

// Interfaces
import { FileUpload } from "@/interfaces/openai.interface";
import { VectorCreate, VectorUpdate } from "@/interfaces/openai.interface";
import { AssistantCreate } from "@/interfaces/openai.interface";

// Components
import { toast } from "sonner";

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVectorStore = async (input: VectorCreate) => {
    setLoading(true);
    setError(null);
    try {
      const output = await _createVectorStore(input);
      return output;
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error.message || "Failed to create vector store.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateVectorStore = async (input: VectorUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const output = await _updateVectorStore(input);
      return output;
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error.message || "Failed to add files to vector store.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadToOpenAI = async (input: FileUpload) => {
    setLoading(true);
    setError(null);
    try {
      const output = await _uploadFile(input);
      return output;
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error.message || "Failed to upload file.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createAssistant = async (input: any) => {
    setLoading(true);
    setError(null);
    try {
      const output = await _createAssistant(input);
      return output;
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error.message || "Failed to create assistant.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAssistant,
    uploadToOpenAI,
    createVectorStore,
    updateVectorStore,
    loading,
    error,
  };
}
