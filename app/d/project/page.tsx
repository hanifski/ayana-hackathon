"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Bot, ArrowUpRight, Files, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UploadModal } from "@/components/project/upload-modal";
import { InstructionModal } from "@/components/project/instruction-modal";

// Komponen terpisah untuk bagian yang menggunakan useSearchParams
function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const threadId = searchParams.get("thread_id");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace("/d/chat?thread_id=123");
  };

  return (
    <>
      {threadId ? (
        // Chat thread view
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4">
          <div className="flex gap-4 items-start mb-6">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p>Hey! Looks like you're testing. How can I help today?</p>
            </div>
          </div>
        </div>
      ) : (
        // Initial centered view
        <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full p-4">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-4xl font-semibold">Lorem Ipsum</h1>
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
      )}

      {/* Chat input section - position changes based on thread_id */}
      {threadId && (
        <div className="w-full mt-auto">
          <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                placeholder="Message ChatGPT"
                className="w-full bg-white border-gray-300 text-gray-900 pl-4 pr-10 py-6 rounded-xl"
              />
              <div className="absolute right-3 top-3">
                <Button type="submit" size="icon" className="rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFilesUploaded={(count) => setUploadedFilesCount(count)}
      />
      <InstructionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

// Komponen utama yang membungkus dengan Suspense
export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<div>Loading...</div>}>
          <ChatContent />
        </Suspense>
      </main>

      <footer className="text-center p-4">
        <p className="text-xs text-gray-500">
          AI may make mistakes. Please use with discretion.
        </p>
      </footer>
    </div>
  );
}
