"use client";

//React
import { use, useEffect, useState } from "react";
import { useUser } from "@/providers/user-provider";

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

export function WorkspaceChecker() {
  const { user, isLoading } = useUser();
  const [openDialog, setOpenDialog] = useState(false);

  // useEffect(() => {
  //   if (user && !isLoading && !user.workspaceId) {
  //     setOpenDialog(true);
  //   }
  // }, [id]);

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
          <Input id="name" value="Pedro Duarte" className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
