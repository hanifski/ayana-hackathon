"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/use-supabase";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, ArrowUpRight, Files, Edit, Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UploadModal } from "@/components/project/upload-modal";
import { InstructionModal } from "@/components/project/instruction-modal";

export default function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const threadId = searchParams.get("thread_id");
  const projectId = searchParams.get("project");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const { getList: getProjects } = useSupabase<any>("projects");
  const [currentProject, setCurrentProject] = useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const result = await getProjects({
        filters: [
          {
            column: "id",
            operator: "eq",
            value: projectId,
          },
        ],
        limit: 1,
      });
      setCurrentProject(result?.data?.[0]);
    };
    fetchProject();
  }, [projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace("/d/chat?thread_id=123");
  };

  return (
    <>
      <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full p-4">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-4xl font-semibold">Name</h1>
          <p>GPT 4.0</p>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="relative mb-4">
            <div className="border border-border rounded-xl focus-within:border-primary transition-all duration-200">
              <div className="flex flex-col">
                <textarea
                  placeholder="Let's start a new chat"
                  rows={2}
                  className="w-full resize-none px-4 pt-3 text-base outline-none bg-transparent h-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="flex flex-1 justify-end p-3">
                  <Button
                    variant={"default"}
                    type="submit"
                    size="icon"
                    className="size-8"
                  >
                    <ArrowUpRight />
                  </Button>
                </div>
              </div>
            </div>
          </form>

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
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFilesUploaded={(count) => setUploadedFilesCount(count)}
      />
      <InstructionModal
        project={currentProject}
        isOpen={isEditModalOpen && currentProject !== null}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
