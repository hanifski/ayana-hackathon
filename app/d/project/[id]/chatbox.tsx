"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

import { ChatInput, chatSchema } from "@/lib/validations/chat";

interface ChatBoxProps {
  projectId: string;
  firstChat: boolean;
}

export default function ChatBox({ projectId, firstChat }: ChatBoxProps) {
  const router = useRouter();
  const form = useForm<ChatInput>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: ChatInput) => {
    if (firstChat) {
      try {
        // Redirect to chat page with the assistant ID and initial message
        router.push(
          `/d/chat?assistant=${encodeURIComponent(
            projectId
          )}&message=${encodeURIComponent(data.message)}`
        );
      } catch (error) {
        console.error("Error redirecting to chat:", error);
      }
    }
  };

  return (
    <>
      <form className="relative mb-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border border-border rounded-xl focus-within:border-primary transition-all duration-200">
          <div className="flex flex-col">
            <textarea
              {...form.register("message", { required: true })}
              placeholder="Let's start a new chat"
              rows={2}
              className="w-full resize-none px-3 pt-2 text-base outline-none bg-transparent"
            />
            <div className="flex flex-1 justify-end px-2.5 pb-2.5">
              <Button
                variant="default"
                type="submit"
                size="icon"
                className="size-8"
              >
                <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
