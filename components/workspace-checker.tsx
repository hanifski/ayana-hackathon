"use client";

//React
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSupabase } from "@/hooks/use-supabase";

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
import { Profile } from "@/types/supabase";
import { WorkspaceInput, workspaceSchema } from "@/lib/validations/workspace";

export function WorkspaceChecker() {
  const [openDialog, setOpenDialog] = useState(false);
  const { data: myProfile } = useSupabase<Profile>("profiles");

  const form = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (myProfile && !myProfile[0].active_workspace) {
      setOpenDialog(true);
    }
  }, [myProfile]);

  return (
    <Dialog open={openDialog}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Let’s Get Started! 🎉</DialogTitle>
          <DialogDescription className="text-base">
            Your first workspace is just a click away.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        <DialogFooter>
          <Button type="submit">Get started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
