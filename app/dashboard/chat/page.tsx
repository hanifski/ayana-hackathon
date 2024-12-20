"use client";

import { useChat } from "ai/react";
import { useState, useEffect } from "react";
import { UserMessage } from "@/components/chat/user-message";
import { AssistantMessage } from "@/components/chat/assistant-message";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, Paperclip } from "lucide-react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { Assistant } from "@/interfaces/assistant";

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Chat", href: "/dashboard/chat" },
];

export default function ChatPage() {
  const searchParams = useSearchParams();
  const assistantId = searchParams.get("assistant");
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [selectedModel, setSelectedModel] = useState("claude-3-haiku-20240307");
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        model: selectedModel,
      },
    });

  useEffect(() => {
    // Fetch assistant details if assistantId is present
    if (assistantId) {
      fetch(`/api/assistants/${assistantId}`)
        .then((res) => res.json())
        .then((data) => setAssistant(data))
        .catch((error) => console.error("Error fetching assistant:", error));
    }
  }, [assistantId, selectedModel]);

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs}>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="claude-3-haiku-20240307">
              Claude 3 Haiku
            </SelectItem>
            <SelectItem value="claude-3-sonnet-20241022">
              Claude 3 Sonnet
            </SelectItem>
            <SelectItem value="claude-3-opus-20240307">
              Claude 3 Opus
            </SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
          </SelectContent>
        </Select>
      </DashboardHeader>

      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col w-full">
        <ScrollArea className="flex-1 px-4">
          <div className="mx-auto max-w-3xl space-y-4 pb-4">
            {messages.map((message) => {
              const { id, content, role } = message;
              const messageProps = {
                message: {
                  id,
                  content,
                  role: role as "user" | "assistant",
                  createdAt: new Date(),
                },
              };

              return role === "assistant" ? (
                <AssistantMessage key={id} {...messageProps} />
              ) : (
                <UserMessage key={id} {...messageProps} />
              );
            })}
            {isLoading && (
              <div className="flex w-full items-center justify-center py-4">
                <div className="text-sm text-muted-foreground">
                  AI is thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-4 pb-4">
          <div className="mx-auto max-w-3xl">
            <div className="border border-border rounded-lg focus-within:border-primary transition-all duration-300">
              <form onSubmit={handleSubmit} className="flex flex-col">
                <textarea
                  placeholder="Type your message..."
                  value={input}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full resize-none px-3 pt-3 text-[15px] outline-none bg-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="flex flex-1 justify-between p-3">
                  <Button variant="outline" size="icon" className="size-8">
                    <Paperclip />
                  </Button>
                  <Button type="submit" size="icon" className="size-8">
                    <ArrowUpRight />
                  </Button>
                </div>
              </form>
            </div>

            <p className="mt-2 text-xs text-muted-foreground text-center">
              AI may make mistakes. Please use with discretion.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
