"use client";

// THIS COMPONENT IS NOT YET READY

// React
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//Validation
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceInput, workspaceSchema } from "@/lib/validations/workspace";

export function Onboarding() {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setOpenDialog(true);
  }, []);

  const form = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Dialog open={openDialog}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome onboard! 🎉</DialogTitle>
          <DialogDescription className="text-base">
            Your first workspace is just a click away.
          </DialogDescription>
        </DialogHeader>
        <form
          // onSubmit={form.handleSubmit(handleCreateWorkspace)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="my-awesome-workspace"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              Get started
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
