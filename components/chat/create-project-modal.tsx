import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/user-provider";
import { useSupabase } from "@/hooks/use-supabase";

// Components
import { BadgeInfo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { insert: insertProject } = useSupabase<any>("projects");

  const handleCreateProject = async () => {
    setIsLoading(true);
    const projectResult = await insertProject({
      name: "New Project",
      user_id: user?.id,
      workspace_id: user?.active_workspace,
    });
    setIsLoading(false);
    onClose();
    router.replace(`/d/project?project=${projectResult.data.id}`);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Project Name</DialogTitle>
        </DialogHeader>
        <div className="py-4 gap-4 flex flex-col">
          <Input placeholder="Enter your project name..." className="h-11" />
          <div className=" flex gap-2 bg-muted p-3 rounded-md">
            <BadgeInfo className="size-5" />
            <div className="flex flex-col w-full gap-0.5">
              <p className="text-xs font-medium">What's a project?</p>
              <p className="text-xs">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
                eiusmod tempor incididunt.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isLoading} onClick={handleCreateProject}>
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
