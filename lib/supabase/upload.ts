"use client";

import { createClient } from "@/lib/supabase/supabase-client";

const supabase = createClient();

interface UploadResponse {
  success: boolean;
  data?: string[];
  error?: string;
}

export function uploadService() {
  const uploadFiles = async (files: File[]): Promise<UploadResponse> => {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        const bucketName = "etalas-ai";

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucketName).getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);

      return {
        success: true,
        data: urls,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while uploading files",
      };
    }
  };

  const deleteFile = async (
    path: string,
    bucketName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.storage.from(bucketName).remove([path]);

      if (error) throw error;

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting file",
      };
    }
  };

  return {
    uploadFiles,
    deleteFile,
  };
}
