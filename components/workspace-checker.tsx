import { useEffect, useState, useCallback, useMemo } from "react";
import { workspaceMemberService } from "@/lib/supabase/workspace-member";
import { useSupabase } from "@/providers/supabase-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { workspaceService } from "@/lib/supabase/workspace";
import { toast } from "sonner";

interface WorkspaceCheckerProps {
  children: React.ReactNode;
}

export function WorkspaceChecker({ children }: WorkspaceCheckerProps) {
  const { hasWorkspace } = workspaceMemberService();
  const supabase = useSupabase();
  const [showDialog, setShowDialog] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const { createWorkspace } = workspaceService();
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const checkWorkspace = useCallback(async () => {
    if (hasChecked) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const result = await hasWorkspace(user.id);
      if (!result.hasWorkspace) {
        setShowDialog(true);
      }
      setHasChecked(true);
    }
  }, [hasChecked, hasWorkspace, supabase.auth]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setHasChecked(false);
        setShowDialog(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    checkWorkspace();
  }, [checkWorkspace]);

  const handleCreateWorkspace = useCallback(async () => {
    if (!workspaceName.trim()) return;

    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const result = await createWorkspace(user.id, workspaceName.trim());

      if (result.success) {
        toast.success("Workspace created successfully!");
        setShowDialog(false);
      } else {
        toast.error(result.error || "Failed to create workspace");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceName, createWorkspace, supabase.auth]);

  const handleWorkspaceNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setWorkspaceName(e.target.value);
    },
    []
  );

  const DialogInputSection = useMemo(
    () => (
      <div className="space-y-4">
        <Input
          placeholder="Enter workspace name"
          value={workspaceName}
          onChange={handleWorkspaceNameChange}
        />
        <Button
          className="w-full"
          disabled={!workspaceName.trim() || isLoading}
          onClick={handleCreateWorkspace}
        >
          {isLoading ? "Creating..." : "Create Workspace"}
        </Button>
      </div>
    ),
    [workspaceName, isLoading, handleCreateWorkspace, handleWorkspaceNameChange]
  );

  const DialogHeaderSection = useMemo(
    () => (
      <DialogHeader>
        <DialogTitle>Welcome aboard!</DialogTitle>
        <DialogDescription>
          Let's get started—create your first workspace and bring your ideas to
          life.
        </DialogDescription>
      </DialogHeader>
    ),
    []
  );

  const dialogContent = useMemo(
    () => (
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-md [&>button]:hidden"
      >
        {DialogHeaderSection}
        {DialogInputSection}
      </DialogContent>
    ),
    [DialogHeaderSection, DialogInputSection]
  );

  return (
    <>
      <Dialog open={showDialog}>{dialogContent}</Dialog>
      {children}
    </>
  );
}
