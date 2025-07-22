import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog,DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";

interface ReasonDialogProps {
  handleRejectOnConfirm: (reason: string) => void;
  loading: boolean
  open : boolean
  setOpen: (open:boolean)=>void
  triggerLabel?: string;             
  variantStyle?:  "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | "success" | null | undefined
  triggerStyle?: string;    
}

const ReasonDialog: React.FC<ReasonDialogProps> = ({handleRejectOnConfirm, loading, open, setOpen, triggerLabel = "❌ Reject",variantStyle = "destructive",triggerStyle}) => {
  const [reason, setReason] = useState("");


  const handleConfirm = () => {
    if (reason.trim().length === 0) return;
    handleRejectOnConfirm(reason);
    setReason(""); 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={triggerStyle}
          variant={variantStyle}
          disabled = {loading} 
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>

      {/* Reason Dialog */}
      <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="">Reason</DialogTitle>
            <DialogDescription className="">Please provide good and understandable reason.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="reason-textArea" className="sr-only">reason-textArea</Label>
            <textarea
                autoFocus
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason..."
                className="p-2 border rounded-md text-sm"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Close
            </Button>
          </DialogClose>
          <Button
              variant='destructive'
              disabled={!reason.trim() || loading}  
              onClick={handleConfirm}
          >
            { loading ? "Processing" : "Confirm" } 
          </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReasonDialog;
