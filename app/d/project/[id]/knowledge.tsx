"use client";

import React from "react";
import { useState } from "react";
import { UploadModal } from "@/components/project/upload-modal";
import { InstructionModal } from "@/components/project/instruction-modal";
import { Assistant } from "@/types/supabase";

import { Files, Edit } from "lucide-react";

interface KnowledgeProps {
  project: Assistant;
}

export default function Knowledge({ project }: KnowledgeProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  return (
    <>
      <div className="flex gap-4 justify-center">
        <div
          className="flex h-20 items-center bg-muted w-full rounded-lg p-4 cursor-pointer"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <div className="flex flex-col text-sm w-full">
            <span className="flex">
              <p className="font-semibold">Upload files</p>
              {uploadedFilesCount > 0 && `(${uploadedFilesCount})`}
            </span>
            <p className="text-muted-foreground">
              Chats in this project can access file content
            </p>
          </div>
          <Files className="size-5 mr-2" />
        </div>
        <div
          className="flex h-20 items-center bg-muted w-full rounded-lg p-4 cursor-pointer"
          onClick={() => setIsEditModalOpen(true)}
        >
          <div className="flex flex-col text-sm w-full">
            <span className="flex">
              <p className="font-semibold">Add Instruction</p>
              {uploadedFilesCount > 0 && `(${uploadedFilesCount})`}
            </span>
            <p className="text-muted-foreground">
              Tailor the way AI responds in this project
            </p>
          </div>
          <Edit className="size-5 mr-2" />
        </div>
      </div>
      {/* Popups */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFilesUploaded={(count) => setUploadedFilesCount(count)}
      />
      <InstructionModal
        project={project}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
