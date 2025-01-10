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
  const { insert } = useSupabase<any>("assistants");
  const { uploadFiles: uploadToSupabase } = uploadService();
  const { uploadToOpenAI, createVectorStore, createAssistant } = useOpenAI();
  const { user } = useUser();

  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/assistant", label: "Assistants" },
    { label: "New Assistant", isCurrentPage: true },
  ];

  const handleFormSubmit = async (formData: CreateAssistantInput) => {
    try {
      if (formData.files && formData.files.length > 0) {
        // 1. Upload files to Supabase
        const uploadResults = await uploadToSupabase(formData.files);

        console.log("list of file", formData.files);

        // 2. Upload files to OpenAI
        let openAIFileIds: string[] = [];
        if (uploadResults.success && uploadResults.data) {
          // Loop through uploadResults and then upload to OpenAI
          for (const singleData of uploadResults.data) {
            const fileId = await uploadToOpenAI({
              file_url: singleData.url,
              file_name: singleData.filename,
              file_type: singleData.type,
            });
            if (fileId) {
              openAIFileIds.push(fileId);
            }
          }

          // 3. Create vector store
          const vectorIdResult = await createVectorStore({
            name: formData.name,
            file_ids: openAIFileIds,
          });
          // 4. Create assistant with vector store
          if (vectorIdResult) {
            const assistantResult = await createAssistant({
              name: formData.name,
              model: formData.model,
              vector_store_id: vectorIdResult,
              instructions: formData.instructions,
            });

            // 5. Store assistant to Supabase
            if (assistantResult) {
              const createdAssistant = await insert({
                name: formData.name,
                model: formData.model,
                description: formData.instructions,
                files: uploadResults.data,
                file_ids: openAIFileIds,
                vector_store_id: vectorIdResult,
                assistant_id: assistantResult,
                user_id: user?.id,
                workspace_id: user?.active_workspace,
              });
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
