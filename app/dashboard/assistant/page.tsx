"use client";

import { Assistant } from "@/interfaces/assistant";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Plus } from "lucide-react";
import Link from "next/link";

// Updated mock data with createdBy property
const mockAssistants: Assistant[] = [
  {
    id: "1",
    name: "General Assistant",
    description:
      "A versatile AI assistant for scheduling, information, and answering questions.",
    createdBy: "Admin",
  },
  {
    id: "2",
    name: "Code Helper",
    description:
      "Assists with debugging, writing, and understanding code snippets.",
    createdBy: "Developer",
  },
  {
    id: "3",
    name: "Writing Assistant",
    description:
      "Offers suggestions, improves grammar, and enhances writing quality.",
    createdBy: "Content Team",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function AssistantPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssistants = mockAssistants.filter((assistant) =>
    assistant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { label: "Assistants", isCurrentPage: true },
  ];

  const actions = (
    <Button variant={"outline"} size={"sm"}>
      Create Assistant
    </Button>
  );

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} actions={actions} />
      <div className="container">
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
          {" "}
          <div className="flex flex-col gap-4 items-center justify-between">
            <div className="w-full sm:w-[300px]"></div>
            <h2 className="text-4xl font-semibold">Assistants</h2>
            <p className="max-w-xl text-center text-muted-foreground">
              Discover or create your custom versions of assistant that combines
              instruction, knowledge and style{" "}
            </p>
            <Input
              className="h-14 px-5 text-base"
              placeholder="Search assistants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAssistants.map((assistant) => (
              <Card
                key={assistant.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center p-4 gap-4">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col h-fit">
                    <h2 className="text-sm font-medium">{assistant.name}</h2>

                    <p className="text-xs text-muted-foreground">
                      by {assistant.createdBy}
                    </p>
                  </div>
                  <Button variant="ghost"></Button>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <p className="text-xs text-muted-foreground">
                    {assistant.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
