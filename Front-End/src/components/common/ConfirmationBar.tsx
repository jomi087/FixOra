import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";

interface ConfirmationBarProps {
  confirmOpen: boolean;
  setConfirmOpen: (confirmOpen: boolean) => void;
  handleAction: (args?: unknown) => Promise<void> | void;
  description?: string;
  extraContent?: React.ReactNode;
}


const ConfirmationBar: React.FC<ConfirmationBarProps> = ({ confirmOpen, setConfirmOpen, handleAction, description, extraContent, }) => {
  return (
    <>
      {
        confirmOpen && (
          <AlertDialog open>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                <AlertDialogDescription>
                  {description ? description : "Are you sure you want to proceed? "}
                </AlertDialogDescription>
              </AlertDialogHeader>
              {extraContent && <div className="my-2">{extraContent}</div>}
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  handleAction();
                  setConfirmOpen(false);
                }}>Yes</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      }
    </>
  );
};

export default ConfirmationBar;