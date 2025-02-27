import ChatBox from "./chatbox";
import Knowledge from "./knowledge";
import { createClient } from "@/lib/supabase/client-server";
import { Assistant } from "@/types/supabase";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("assistants")
    .select("*")
    .eq("id", id)
    .single();

  const typedProject = project as Assistant;

  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex-1 flex flex-col max-w-3xl w-full p-4">
          <div className="flex flex-col mb-6 gap-2">
            <h1 className="text-4xl font-semibold">{typedProject.name}</h1>
            <p>{typedProject.model}</p>
          </div>
          <ChatBox projectId={id} firstChat={true} />
          <Knowledge project={typedProject} />
        </div>
      </div>
    </>
  );
}
