import type { BookingRequestPayload } from "@/shared/types/booking";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { BellRing } from "lucide-react";
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import { longInputLength, Messages, validationMsg } from "@/utils/constant";
import { Input } from "../ui/input";
import { useState } from "react";
import { splitDateTime } from "@/utils/helper/Date&Time";
import { ProviderResponseStatus } from "@/shared/enums/ProviderResponseStatus";
import type { AxiosError } from "axios";


interface BookingApplicationDialogueProps {
  data: BookingRequestPayload;
  onClose: () => void;
}

const BookingApplicationDialouge: React.FC<BookingApplicationDialogueProps> = ({ data, onClose, }) => {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<Exclude<ProviderResponseStatus, ProviderResponseStatus.PENDING> | null>(null);
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { date, time } = splitDateTime(data.scheduledAt);

  const askConfirmation = (type: Exclude<ProviderResponseStatus, ProviderResponseStatus.PENDING>) => {
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {

    if (!actionType) return;
    if (actionType === ProviderResponseStatus.REJECTED && !reason.trim()) {
      return setErrorMsg(validationMsg.REASON_INVALID);
    }

    try {
      await AuthService.UpdateBookingStatusApi(data.bookingId, actionType, reason);
      toast.success(actionType.toLocaleUpperCase());

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.BOOKING_STATUS_FAILED;
      toast.error(errorMsg);
    }

    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      {/* Main Booking Request popup */}
      <Dialog open onOpenChange={onClose} >
        <DialogContent
          className="pointer-events-none [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="pointer-events-auto rounded-lg border p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <BellRing className="text-yellow-500" size={32} />
              <div>
                <DialogTitle className="text-lg font-semibold">
                  New Booking Request
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Please acknowledge your booking.
                </DialogDescription>
              </div>
            </div>

            <div className="space-y-1 mb-4">
              <p>
                <span className="font-medium">From:</span>{" "}
                {data.userName.toLocaleUpperCase()}
              </p>
              <p>
                <span className="font-medium">Issue Type:</span> {data.issueType}
              </p>
              <p>
                <span className="font-medium">Date:</span> {date}
              </p>
              <p>
                <span className="font-medium">Time:</span> {time}
              </p>
              <p className="font-medium">
                Description:
                <span className="font-normal text-base"> {data.issue} </span>
              </p>
            </div>
            <button
              className=" w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
              onClick={() => askConfirmation(ProviderResponseStatus.ACCEPTED)}
            >
              Acknowledge
            </button>
            <DialogFooter className="!justify-start mt-3" >
              <div>
                <p className="text-xs text-muted-foreground">
                  Please reject a booking only if absolutely necessary
                </p>
                <p className="text-xs text-muted-foreground ">
                  Frequent rejections may impact your service reliability and visibility
                  <button
                    className="text-[11px] pl-1 text-blue-200 hover:underline cursor-pointer"
                    onClick={() => askConfirmation(ProviderResponseStatus.REJECTED)}
                  >
                    Reject
                  </button>
                </p>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>

      </Dialog>

      {/*Confirmation popup */}
      {confirmOpen && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you really want to{" "}
                {actionType === ProviderResponseStatus.ACCEPTED ? "accept" : "reject"}{" "}
                this booking ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            {actionType === ProviderResponseStatus.REJECTED &&
              <>
                <Input
                  type="text"
                  placeholder="Enter a reason"
                  value={reason}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setReason(val);
                    if (val.trim().length > 0) {
                      setErrorMsg("");
                    }
                  }}
                  maxLength={longInputLength}
                />
                {errorMsg && <p className="text-sm">{errorMsg}</p>}
              </>
            }
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setConfirmOpen(false);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default BookingApplicationDialouge;
