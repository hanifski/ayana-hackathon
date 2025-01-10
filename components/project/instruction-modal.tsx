import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Edit Instruction</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Enter your instruction here..."
            className="w-full h-32"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} size={"sm"}>
            Cancel
          </Button>
          <Button variant={"default"} onClick={onClose} size={"sm"}>
            Save Instruction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
