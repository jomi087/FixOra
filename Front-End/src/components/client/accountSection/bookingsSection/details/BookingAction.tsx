import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "@/shared/enums/Payment";
import { useAppDispatch } from "@/store/hooks";
import { fetchProviderInfo } from "@/store/user/providerInfoSlice";
import { CancelSeal, ConfirmSeal } from "@/utils/constant";
import { Download } from "lucide-react";

interface BookingActionProps {
  status: BookingStatus
  retryPayment: () => void;
  paymentInfo: {
    mop?: PaymentMode;
    status: PaymentStatus;
    paidAt?: Date;
    transactionId?: string
    reason?: string;
  }
  scheduledAt: string;
  setOpenFeedBack: (value: boolean) => void
  setConfirmOpen: (value: boolean) => void
  setOpenBookingSlot: React.Dispatch<React.SetStateAction<boolean>>;
  providerId: string;
  hasUserReviewed: boolean | null
  handleDownloadPDF: () => void
}

const BookingAction: React.FC<BookingActionProps> = ({ status, paymentInfo, retryPayment, setOpenFeedBack, scheduledAt, setConfirmOpen, setOpenBookingSlot, providerId, hasUserReviewed, handleDownloadPDF }) => {
  const scheduledDate = new Date(scheduledAt);
  const rescheduleCutoff = new Date(scheduledDate.getTime() - 30 * 60 * 1000);
  const dispatch = useAppDispatch();

  return (
    <>
      {status == BookingStatus.CONFIRMED && paymentInfo.status === PaymentStatus.SUCCESS &&
        <div className="flex justify-between w-full items-end mt-5 ">
          <Button
            variant="destructive"
            className="cursor-pointer hover:bg-red-700 hover:dark:bg-red-700"
            onClick={() => setConfirmOpen(true)}
          >
            Cancel Booking
          </Button>
          <Button
            className={`cursor-pointer active:scale-95 w-44 dark:bg-yellow-500 hover:dark:bg-yellow-400   
              ${new Date() >= rescheduleCutoff ? "hidden" : ""}`}
            onClick={async () => {
              await dispatch(fetchProviderInfo(providerId)).unwrap();
              setOpenBookingSlot((prev) => !prev);
            }}
          >
            Re-shedule
          </Button>
        </div >
      }
      {
        status == BookingStatus.CANCELLED && paymentInfo.status === PaymentStatus.PENDING && (
          <div className="flex items-end mt-5 ">
            <Button
              variant="destructive"
              className="cursor-pointer hover:bg-red-700 hover:dark:bg-red-700"
              onClick={retryPayment}
            >
              Retry Payment
            </Button>
          </div>
        )
      }
      {
        status == BookingStatus.CANCELLED &&
        (paymentInfo.status === PaymentStatus.PARTIAL_REFUNDED ||
          paymentInfo.status === PaymentStatus.REFUNDED) && (
          <div className="absolute flex items-center pt-4 opacity-40 sm:opacity-55 xl:static sm:left-75 md:left-82 lg:left-110">
            <p>
              <img
                src={CancelSeal}
                alt="BookingCanceled"
                className="w-25 sm:w-25 md:w-30 lg:w-35 rotate-20"
              />
            </p>
          </div>
        )
      }

      {
        status == BookingStatus.INITIATED &&
        <div className="flex flex-col justify-end mt-2 item">
          <p className="text-base font-semibold font-mono hover:underline underline-offset-5 cursor-pointer">
            WORK ON PROCESS...
          </p>
        </div>
      }

      {
        status == BookingStatus.COMPLETED &&
        <>
          <div className="absolute flex items-center pt-4 opacity-40 sm:opacity-55 xl:static sm:left-75 md:left-82 lg:left-110">
            <p>
              <img
                src={ConfirmSeal}
                alt="BookingCompleted"
                className="w-25 sm:w-25 md:w-30 lg:w-35 rotate-10"
              />
            </p>
          </div>
          <div className="w-full my-4 mr-5 flex justify-between">
            <Button
              variant={"default"}
              className="cursor-pointer active:scale-95"
              onClick={handleDownloadPDF}
            >
              Invoice <Download />
            </Button>
            {hasUserReviewed == false &&
              <Button
                className="cursor-pointer active:scale-95"
                variant={"success"}
                onClick={() => setOpenFeedBack(true)}
              >
                FeedBack
              </Button>
            }
          </div>
        </>
      }
    </>
  );
};

export default BookingAction; 