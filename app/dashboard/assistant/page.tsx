"use client";

import { useState, useEffect } from "react";
import { Assistant } from "@/interfaces/assistant";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { assistantService } from "@/lib/supabase/assistant";

export default function AssistantPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAssistants() {
      const { success, data, error } = await assistantService().getAll();
      if (data) {
        setAssistants(data);
      } else {
        toast.error(error);
      }
      setIsLoading(false);
    }
    fetchAssistants();
  }, []);

  const filteredAssistants = assistants.filter((assistant) =>
    assistant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { label: "Assistants", isCurrentPage: true },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/chat/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Assistant
        </Button>
      </DashboardHeader>
      <div className="container">
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
          <div className="flex flex-col gap-4 items-center justify-between">
            <div className="w-full sm:w-[300px]"></div>
            <h2 className="text-4xl font-semibold">Assistants</h2>
            <p className="max-w-xl text-center text-muted-foreground">
              Discover or create your custom versions of assistant that combines
              instruction, knowledge and style
            </p>
            <Input
              className="h-14 px-5 text-base"
              placeholder="Search assistants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : filteredAssistants.length === 0 ? (
            <div className="text-center text-muted-foreground">
              {searchQuery
                ? "No assistants found"
                : "No assistants yet. Create your first one!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredAssistants.map((assistant) => (
                <Link
                  key={assistant.id}
                  href={`/dashboard/chat?assistant=${assistant.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center p-4 gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(assistant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col h-fit">
                        <h2 className="text-sm font-medium">
                          {assistant.name}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {assistant.model}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                      <p className="text-xs text-muted-foreground">
                        {assistant.instructions}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
