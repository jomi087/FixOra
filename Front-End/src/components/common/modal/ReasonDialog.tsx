import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { longInputLength } from "@/utils/constant";

interface ReasonDialogProps {
  onConfirm: (reason: string) => void;
  loading: boolean
  open: boolean
  setOpen: (open: boolean) => void
  tittle?: string;
  discription?: string
  placeholder?: string
}

const ReasonDialog: React.FC<ReasonDialogProps> = ({ onConfirm, loading, open, setOpen, tittle = "Reason", discription = "", placeholder = "" }) => {
  const [reason, setReason] = useState(""); // suggestion move the state to parent cz i am not able to control setReason from partent
  const [error, setError] = useState("");
  const handleConfirm = () => {
    if (reason.trim().length <= 3) {
      setError("Please add few more words for better understanding");
      return;
    }
    onConfirm(reason);
    setTimeout(() => setReason(""), 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      {/* Reason Dialog */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="">{tittle}</DialogTitle>
          <DialogDescription className="text-xs mt-2">{discription}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="reason-textArea" className="sr-only">reason-textArea</Label>
            <textarea
              autoFocus
              value={reason}
              onChange={(e) => {
                let value = e.target.value;
                setReason(value);
                if (error && value.trim().length > 3) {
                  setError("");
                }
              }}
              placeholder={placeholder}
              className="p-2 border rounded-md text-sm"
              rows={2}
              maxLength={longInputLength}
            />
            <p className="text-red-400 text-xs px-1">{error}</p>
          </div>
        </div>

        <DialogFooter className="mt-0 flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={()=>setError("")}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            variant='destructive'
            disabled={!reason.trim() || loading}
            onClick={handleConfirm}
          >
            {loading ? "Processing" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReasonDialog;
