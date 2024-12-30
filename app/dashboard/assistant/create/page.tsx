"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOpenAI } from "@/hooks/use-openai";
import { useSupabase } from "@/hooks/use-supabase";
import { useUser } from "@/providers/user-provider";

import AssistantForm from "@/components/assistant/assistant-form";

import { uploadService } from "@/lib/supabase/upload";
import { Assistant } from "@/types/supabase";
import { CreateAssistantInput } from "@/lib/validations/assistant";

import { toast } from "sonner";

export default function CreateAssistantPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { insert } = useSupabase<any>("assistants");
  const { uploadFiles } = uploadService();
  const { uploadToOpenAI, createVectorStore, createAssistant } = useOpenAI();
  const { user } = useUser();

  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/assistant", label: "Assistants" },
    { label: "New Assistant", isCurrentPage: true },
  ];

  const handleFormSubmit = async (formData: CreateAssistantInput) => {
    setLoading(true);
    try {
      if (formData.files && formData.files.length > 0) {
        // 1. Upload files to Supabase
        const fileUrls = await uploadFiles(uploadedFiles);
        console.log("File successfully uploaded to OpenAI", fileUrls);
        // 2. Upload files to OpenAI
        let fileIds: string[] = [];
        if (fileUrls.success && fileUrls.data) {
          // Loop through fileUrls and then upload to OpenAI
          for (const fileUrl of fileUrls.data) {
            const fileId = await uploadToOpenAI({
              file_url: fileUrl.url,
              file_name: fileUrl.filename,
              file_type: fileUrl.type,
            });
            if (fileId) {
              console.log("fileId", fileId);
              fileIds.push(fileId);
            }
          }
          // 3. Create vector store
          const vectorId = await createVectorStore({
            name: formData.name,
            file_ids: fileIds,
          });
          console.log("Vector is successfully created", vectorId);
          // 4. Create assistant with vector store
          if (vectorId) {
            const assistantResult = await createAssistant({
              name: formData.name,
              model: formData.model,
              vector_store_id: vectorId,
              instructions: formData.instructions,
            });
            console.log("Assistant is successfully created", assistantResult);
            // 5. Store assistant to database
            if (assistantResult) {
              const createdAssistant = await insert({
                name: formData.name,
                model: formData.model,
                description: formData.instructions,
                files: fileUrls.data,
                file_ids: fileIds,
                vector_store_id: vectorId,
                assistant_id: assistantResult,
                user_id: user?.id,
                workspace_id: user?.active_workspace,
              });
              console.log(
                "Assistant is successfully created",
                createdAssistant
              );
            }
          }
        }
      }
      // Handle successful creation (e.g., show a success message, redirect)
      toast.success("Assistant created successfully");
    } catch (error) {
      console.error("Error creating assistant:", error);
      toast.error("Error creating assistant");
      // Handle error (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container h-full">
        <AssistantForm onSubmit={handleFormSubmit} />
      </div>
    </>
  );
}
