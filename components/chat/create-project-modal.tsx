import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/user-provider";
import { useSupabase } from "@/hooks/use-supabase";
import { useOpenAI } from "@/hooks/use-openai";

// Components
import { toast } from "sonner";
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

  const { createAssistant } = useOpenAI();

  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const handleCreateProject = async () => {
    setIsLoading(true);
    try {
      // Create Assistant in OpenAI
      const assistantResult = await createAssistant({
        name: form.getValues("name"),
        model: "gpt-4-turbo-preview",
      });
      // Store assistant to Supabase
      if (assistantResult) {
        const projectResult = await insertProject({
          name: form.getValues("name"),
          user_id: user?.id,
          workspace_id: user?.active_workspace,
          assistant_id: assistantResult,
        });
        // Close modal
        onClose();
        // Show success toast
        toast.success("Project created successfully!");
        console.log(projectResult);
        // Redirect to project chat screen
        router.replace(`/d/project?project=${projectResult.data.id}`);
      }
    } catch (error) {
      // Show error toast
      toast.error("Failed to create project.");
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Project Name</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleCreateProject)}
          className="flex flex-col gap-4 py-4"
        >
          <Input
            {...form.register("name")}
            placeholder="Enter your project name..."
            className="h-11"
          />

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

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button loading={isLoading} type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
