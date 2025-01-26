import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useOpenAI } from "@/hooks/use-openai";
import { useSupabase } from "@/hooks/use-supabase";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InstructionModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionModal({
  project,
  isOpen,
  onClose,
}: InstructionModalProps) {
  const { updateAssistantInstruction } = useOpenAI();
  const { update: updateProject } = useSupabase<any>("projects");
  const [loading, setLoading] = useState(false);

  // Form
  const form = useForm<any>({
    defaultValues: {
      instruction: "",
    },
  });

  // Tambahkan useEffect untuk update form values
  useEffect(() => {
    if (project) {
      form.reset({
        instruction: project.instruction || "",
      });
    }
  }, [project]);

  // To:
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Update instruction
      const result = await updateAssistantInstruction({
        assistant_id: project.assistant_id,
        instruction: data.instruction, // Use form data instead of getValues
      });

      // Update project in Supabase
      if (result) {
        const updateResult = await updateProject(
          {
            instruction: data.instruction,
          },
          {
            where: [{ column: "id", value: project.id }],
          }
        );

        if (updateResult.error) {
          throw new Error(updateResult.error.message);
        }
      }

      toast.success("Instruction updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update instruction.");
      console.error("Error updating instruction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Edit Instruction</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="py-4">
            <Textarea
              {...form.register("instruction")}
              placeholder="Enter your instruction here..."
              className="w-full h-32"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              size={"sm"}
            >
              Cancel
            </Button>
            <Button
              variant={"default"}
              type="submit"
              size={"sm"}
              loading={loading}
            >
              Save Instruction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
