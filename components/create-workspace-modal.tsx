"use client";

// React
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/providers/user-provider";
import { useSupabase } from "@/hooks/use-supabase";
import { useOpenAI } from "@/hooks/use-openai";

// Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

//Validation
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceInput, workspaceSchema } from "@/lib/validations/workspace";

import { Workspace, Member } from "@/types/supabase";
import { Profile } from "@/types/supabase";

interface CreateWorkspaceModalProps {
  onClose: () => void;
}

export function WorkspaceModal({ onClose }: CreateWorkspaceModalProps) {
  const [loading, setLoading] = useState(false);
  const { user, refetchUser } = useUser();
  const { update: updateProfile } = useSupabase<Profile>("profiles");
  const { insert: createWorkspace } = useSupabase<Workspace>("workspaces");
  const { insert: createMember } = useSupabase<Member>("members");

  const form = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreateWorkspace = async (data: WorkspaceInput) => {
    setLoading(true);
    console.log(user);
    // Create the workspace
    const workspaceResult = await createWorkspace({
      name: data.name,
      owner_id: user?.id,
    });

    if (workspaceResult.error) {
      toast.error("Failed to create workspace.");
      console.log(workspaceResult.error);
      setLoading(false);
      return;
    }

    // if (workspaceResult.data && user) {
    //   // Create the workspace member
    //   const memberResult = await createMember({
    //     workspace_id: workspaceResult.data.id,
    //     user_id: user.id,
    //     status: "accepted",
    //     role: "owner",
    //   });
    //   // Update the UserContext
    //   if (memberResult) {
    //     await updateProfile(
    //       { active_workspace: workspaceResult.data.id },
    //       { where: [{ column: "user_id", value: user.id }] }
    //     );
    //     refetchUser();
    //   }
    //   form.reset();
    //   setLoading(false);
    //   onClose();
    // }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Workspace 🎉</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a new workspace to get started with your project.
        </DialogDescription>
        <form
          onSubmit={form.handleSubmit(handleCreateWorkspace)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              {...form.register("name")}
              type="text"
              className="col-span-3"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Get startedd
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
