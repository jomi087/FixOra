import Otp from "@/components/auth/Otp";
import { Button } from "@/components/ui/button";
import { useOtpLogic } from "@/hooks/useOtpLogic";
import AuthService from "@/services/AuthService";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "@/shared/enums/Payment";
import { CancelSeal, ConfirmSeal, Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import UploadWorkProofDialog from "./UploadWorkProofDialog";
import type { JobInfoDetails } from "@/shared/types/booking";

interface BookingActionProps {
  id: string;
  status: BookingStatus
  paymentInfo: {
    mop: PaymentMode;
    status: PaymentStatus;
    paidAt: Date;
    transactionId: string
    reason?: string;
  }
  scheduledAt: string;
  setBookingInDetails: React.Dispatch<React.SetStateAction<JobInfoDetails | null>>;
}

const BookingAction: React.FC<BookingActionProps> = ({ id, status, paymentInfo, scheduledAt, setBookingInDetails }) => {
  const [otp, setOtp] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { resendOtp } = useOtpLogic();

  const verifyOtp = async (otp: string): Promise<void> => {
    try {
      const res = await AuthService.verifyArrivalOtpApi(otp); // verify otp and update status from confirm to Initiated
      toast.success(res.data.message);
      setBookingInDetails((prev) => prev ? {
        ...prev,
        status: BookingStatus.INITIATED
      } : prev);

      setOtp(false);

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.OTP_VERIFICATION_FAILED;
      toast.error(errorMsg);
    }
  };

  const handleVerifyProviderArrival = async (bookingId: string) => {
    try {
      const res = await AuthService.arrivalOtpApi(bookingId);
      toast.success(res.data.message || "An OTP send to User");
      setOtp(true);

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  return (
    <>
      {status == BookingStatus.CONFIRMED && paymentInfo.status === PaymentStatus.SUCCESS &&
        <div className="flex items-end mt-5">
          <Button
            className={`cursor-pointer active:scale-95 w-44 dark:bg-yellow-500 hover:dark:bg-yellow-400   
              ${new Date() >= new Date(scheduledAt) ? "" : "hidden"}`}
            onClick={() => handleVerifyProviderArrival(id)}
          >
            Verify Arrival
          </Button>
        </div>
      }
      {status == BookingStatus.CANCELLED &&
        <div className="absolute flex items-center pt-4 opacity-40 sm:opacity-55 xl:static sm:left-75 md:left-82 lg:left-110">
          <p>
            <img
              src={CancelSeal}
              alt="BookingCanceled"
              className="w-25 sm:w-25 md:w-30 lg:w-35 rotate-20"
            />
          </p>
        </div>
      }
      {status == BookingStatus.INITIATED &&
        <div className="flex flex-col justify-end mt-2 items-end">
          <Button
            variant={"success"}
            className="w-44 cursor-pointer"
            onClick={() => setConfirmOpen(true)}
          >
            Finished
          </Button>
        </div>
      }
      {status == BookingStatus.COMPLETED &&
        <div className="absolute flex items-center pt-4 opacity-40 sm:opacity-55 xl:static sm:left-75 md:left-82 lg:left-110">
          <p>
            <img
              src={ConfirmSeal}
              alt="BookingCompleted"
              className="w-25 sm:w-25 md:w-30 lg:w-35 rotate-10"
            />
          </p>
        </div>
        
      }


      {otp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <Otp otpTime={30} otpLength={6} otpSubmit={verifyOtp} resendOtp={resendOtp} />
        </div>
      )}

      {confirmOpen &&
        <UploadWorkProofDialog
          bookingId={id}
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          setBookingInDetails={setBookingInDetails}
        />
      }
    </>
  );
};

export default BookingAction;

