"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/use-supabase";
import { useUser } from "@/providers/user-provider";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Plus } from "lucide-react";

import Link from "next/link";

import { Assistant } from "@/types/supabase";

export default function AssistantPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();
  const { getList } = useSupabase<Assistant>("assistants");

  const filteredAssistants = assistants.filter((assistant) =>
    assistant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbs = [
    { href: "/d", label: "Dashboard" },
    { label: "Assistants", isCurrentPage: true },
  ];

  useEffect(() => {
    const fetchAssistants = async () => {
      setIsLoading(true);
      try {
        const assistantResults = await getList();
        if (assistantResults && assistantResults.data) {
          setAssistants(assistantResults?.data);
        }
      } catch (error) {
        console.error("Error fetching assistants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/d/assistant/create")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Assistant
        </Button>
      </DashboardHeader>
      <div className="container p-4">
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
                  href={`/d/chat?assistant=${assistant.id}`}
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
                        <h2 className="font-medium">{assistant.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {assistant.model}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                      <p className="text-sm text-muted-foreground">
                        {assistant.description}
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
