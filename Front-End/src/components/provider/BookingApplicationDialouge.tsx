import type { BookingRequestPayload } from "@/shared/types/booking";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import { ProviderResponseStatus } from "@/shared/enums/ProviderResponseStatus";
import { splitDateTime } from "@/utils/helper/Date&Time";
import { longInputLength, Messages, validationMsg } from "@/utils/constant";
import type { AxiosError } from "axios";

interface BookingApplicationDialogueProps {
  data: BookingRequestPayload;
  onClose: () => void;
}

const BookingApplicationDialog: React.FC<BookingApplicationDialogueProps> = ({
  data,
  onClose,
}) => {
  const [step, setStep] = useState<"main" | "confirm">("main");
  const [actionType, setActionType] = useState<
    Exclude<ProviderResponseStatus, ProviderResponseStatus.PENDING> | null
  >(null);

  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { date, time } = splitDateTime(data.scheduledAt);

  const openConfirm = (type: Exclude<ProviderResponseStatus, ProviderResponseStatus.PENDING>) => {
    setActionType(type);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!actionType) return;

    if (actionType === ProviderResponseStatus.REJECTED && !reason.trim()) {
      return setErrorMsg(validationMsg.INVALID);
    }

    try {
      await AuthService.UpdateBookingStatusApi(data.bookingId, actionType, reason);
      toast.success(actionType.toUpperCase());
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.BOOKING_STATUS_FAILED;
      toast.error(errorMsg);
    }

    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {step === "main" && (
          <div className="pointer-events-auto rounded-lg border p-6 shadow-md">
            <DialogHeader >
              <div className="flex items-center gap-3 mb-4">
                <BellRing className="text-yellow-500" size={32} />
                <div>
                  <DialogTitle className="text-lg font-semibold">
                    New Booking Request
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Please respond to this request.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-1 mb-4">
              <p><span className="font-medium">From:</span> {data.userName.toUpperCase()}</p>
              <p><span className="font-medium">Issue Type:</span> {data.issueType}</p>
              <p><span className="font-medium">Date:</span> {date}</p>
              <p><span className="font-medium">Time:</span> {time}</p>
              <p className="font-medium">
                Description: <span className="font-normal text-base">{data.issue}</span>
              </p>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openConfirm(ProviderResponseStatus.ACCEPTED)}
            >
              Accept
            </Button>

            <DialogFooter className="!justify-start mt-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Reject only if absolutely necessary
                </p>
                <p className="text-xs text-muted-foreground">
                  Frequent rejections may impact your service reliability and visibility
                  <button
                    className="text-[11px] pl-1 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => openConfirm(ProviderResponseStatus.REJECTED)}
                  >
                    Reject
                  </button>
                </p>
              </div>
            </DialogFooter>
          </div>
        )}

        {/* CONFIRMATION STEP */}
        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to{" "}
                {actionType === ProviderResponseStatus.ACCEPTED ? "accept" : "reject"}{" "}
                this booking?
              </DialogDescription>
            </DialogHeader>

            {actionType === ProviderResponseStatus.REJECTED && (
              <>
                <Input
                  type="text"
                  placeholder="Enter a reason"
                  value={reason}
                  maxLength={longInputLength}
                  onChange={(e) => {
                    const val = e.target.value;
                    setReason(val);
                    if (val.trim()) setErrorMsg("");
                  }}
                />
                {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
              </>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("main")}>Back</Button>
              <Button variant="destructive" onClick={handleConfirm}>
                Yes, Confirm
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingApplicationDialog;
